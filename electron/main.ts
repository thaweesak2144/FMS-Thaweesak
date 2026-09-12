import { app, BrowserWindow, shell } from "electron";
import path from "path";
import fs from "fs";
import http from "http";
import net from "net";
import { spawn, fork, ChildProcess } from "child_process";

const isDev = !app.isPackaged;
const DEFAULT_PORT = 3010;
const DEFAULT_PG_PORT = 5433;

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;
let nextServerProcess: ChildProcess | null = null;

// Paths
const appDataDir = path.join(app.getPath("appData"), "FMS-System");
const pgDataDir = path.join(appDataDir, "pgdata");
const logDir = path.join(appDataDir, "logs");

if (!fs.existsSync(appDataDir)) fs.mkdirSync(appDataDir, { recursive: true });
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function logToFile(filename: string, message: string) {
  const filePath = path.join(logDir, filename);
  const time = new Date().toISOString();
  fs.appendFileSync(filePath, `[${time}] ${message}\n`, "utf-8");
}

// Utility: check if a port is currently listening
function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      resolve(false);
    });
    socket.connect(port, "127.0.0.1");
  });
}

// Find a free port starting from startPort
async function getAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  while (port < startPort + 50) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      return port;
    }
    port++;
  }
  return startPort;
}

// Utility: poll HTTP URL until ready
function waitForHttp(url: string, timeoutMs = 60000): Promise<boolean> {
  const startTime = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      if (Date.now() - startTime > timeoutMs) {
        resolve(false);
        return;
      }
      const req = http.get(url, (res) => {
        if (res.statusCode && res.statusCode < 500) {
          resolve(true);
        } else {
          setTimeout(check, 1000);
        }
      });
      req.on("error", () => {
        setTimeout(check, 1000);
      });
      req.end();
    };
    check();
  });
}

function updateSplashStatus(text: string) {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.send("status-update", text);
  }
}

// 1. Initialize and start Portable PostgreSQL
async function startPostgreSQL(pgPort: number): Promise<boolean> {
  if (isDev) {
    return false; // In dev, use the existing PostgreSQL service
  }

  const pgBinDir = path.join(process.resourcesPath, "postgres", "bin");
  const initDbPath = path.join(pgBinDir, "initdb.exe");
  const pgCtlPath = path.join(pgBinDir, "pg_ctl.exe");

  if (!fs.existsSync(pgCtlPath)) {
    logToFile("main.log", "[PostgreSQL] Portable binary not found at: " + pgCtlPath + ". Using database from .env");
    return false;
  }

  // Initialize DB cluster if not exists
  if (!fs.existsSync(pgDataDir)) {
    updateSplashStatus("กำลังสร้างฐานข้อมูลเริ่มต้น...");
    logToFile("main.log", "[PostgreSQL] Initializing new cluster at: " + pgDataDir);
    await new Promise<void>((resolve, reject) => {
      const initProc = spawn(
        initDbPath,
        ["-D", pgDataDir, "-U", "postgres", "-E", "UTF8", "--locale=C", "--no-instructions"],
        { windowsHide: true }
      );
      initProc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`initdb exited with code ${code}`));
      });
    });
  }

  // Start PostgreSQL
  updateSplashStatus("กำลังเริ่มบริการฐานข้อมูล...");
  const logFile = path.join(logDir, "postgres.log");
  return new Promise<boolean>((resolve) => {
    const startProc = spawn(
      pgCtlPath,
      ["-D", pgDataDir, "-l", logFile, "-o", `-p ${pgPort}`, "start"],
      { windowsHide: true }
    );
    startProc.on("close", (code) => {
      logToFile("main.log", `[PostgreSQL] Started on port ${pgPort} with exit code ${code}`);
      resolve(code === 0);
    });
  });
}

// 2. Stop Portable PostgreSQL
function stopPostgreSQL() {
  if (isDev) return;

  const pgBinDir = path.join(process.resourcesPath, "postgres", "bin");
  const pgCtlPath = path.join(pgBinDir, "pg_ctl.exe");

  if (fs.existsSync(pgCtlPath) && fs.existsSync(pgDataDir)) {
    try {
      spawn(pgCtlPath, ["-D", pgDataDir, "stop", "-m", "fast"], {
        windowsHide: true,
        stdio: "ignore",
      });
    } catch (err) {
      console.error("[PostgreSQL] Failed to stop cleanly:", err);
    }
  }
}

// 3. Start Next.js Standalone Server
async function startNextServer(port: number, pgPort: number, hasPortablePg: boolean): Promise<boolean> {
  if (isDev) {
    return true; // Next.js is run via npm run dev
  }

  updateSplashStatus("กำลังเริ่มต้นระบบบริการ...");
  const standaloneDir = path.join(process.resourcesPath, "standalone");
  const serverPath = path.join(standaloneDir, "server.js");

  if (!fs.existsSync(serverPath)) {
    const err = `[Next.js] Standalone server not found at: ${serverPath}`;
    logToFile("main.log", err);
    console.error(err);
    return false;
  }

  // Read .env from standaloneDir if present
  const envFile = path.join(standaloneDir, ".env");
  const localEnv: Record<string, string> = {};
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, "utf-8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (line && !line.startsWith("#")) {
        const eqIdx = line.indexOf("=");
        if (eqIdx > 0) {
          const k = line.slice(0, eqIdx).trim();
          const v = line.slice(eqIdx + 1).trim();
          localEnv[k] = v;
        }
      }
    }
    logToFile("main.log", `Loaded .env from standalone directory (${Object.keys(localEnv).length} variables)`);
  }

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    ...localEnv,
    PORT: String(port),
    HOSTNAME: "127.0.0.1",
    NODE_ENV: "production",
    APP_URL: `http://127.0.0.1:${port}`,
    AUTH_TRUST_HOST: "true",
  };

  // Only override DATABASE_URL if portable PostgreSQL was actually started
  if (hasPortablePg) {
    env.DATABASE_URL = `postgresql://postgres:postgres@127.0.0.1:${pgPort}/postgres?schema=public`;
  } else if (localEnv.DATABASE_URL) {
    env.DATABASE_URL = localEnv.DATABASE_URL;
  }

  if (!env.AUTH_SECRET) {
    env.AUTH_SECRET = localEnv.AUTH_SECRET || "fms-desktop-production-secret-2026";
  }

  logToFile("main.log", `Starting Next.js standalone server on port ${port} with DATABASE_URL=${env.DATABASE_URL?.replace(/:[^:@]+@/, ":***@")}`);

  const serverLog = path.join(logDir, "server.log");
  const logStream = fs.createWriteStream(serverLog, { flags: "a" });

  try {
    nextServerProcess = fork(serverPath, [], {
      cwd: standaloneDir,
      env,
      stdio: ["ignore", "pipe", "pipe", "ipc"],
    });

    nextServerProcess.stdout?.pipe(logStream);
    nextServerProcess.stderr?.pipe(logStream);

    nextServerProcess.on("error", (err) => {
      logToFile("main.log", `[Next.js Process Error] ${err.message}`);
    });

    nextServerProcess.on("exit", (code) => {
      logToFile("main.log", `[Next.js Process Exit] Code: ${code}`);
    });

    return true;
  } catch (err: unknown) {
    logToFile("main.log", `[Next.js Launch Error] ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 480,
    height: 360,
    frame: false,
    resizable: false,
    center: true,
    show: false,
    backgroundColor: "#0f172a",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const splashPath = fs.existsSync(path.join(__dirname, "splash.html"))
    ? path.join(__dirname, "splash.html")
    : path.join(__dirname, "..", "electron", "splash.html");
  splashWindow.loadFile(splashPath);
  splashWindow.once("ready-to-show", () => {
    splashWindow?.show();
  });
}

function createMainWindow(url: string) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    title: "ระบบบริหารจัดการองค์กร - FMS Management System",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(url);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    if (targetUrl.startsWith("http:") || targetUrl.startsWith("https:")) {
      shell.openExternal(targetUrl);
    }
    return { action: "deny" };
  });

  mainWindow.once("ready-to-show", () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// App Lifecycle
app.whenReady().then(async () => {
  createSplashWindow();

  let webPort = DEFAULT_PORT;
  let pgPort = DEFAULT_PG_PORT;

  if (!isDev) {
    webPort = await getAvailablePort(DEFAULT_PORT);
    pgPort = await getAvailablePort(DEFAULT_PG_PORT);

    logToFile("main.log", `Selected ports -> Web: ${webPort}, PG: ${pgPort}`);

    // Start DB
    const hasPortablePg = await startPostgreSQL(pgPort);

    // Start Next.js
    await startNextServer(webPort, pgPort, hasPortablePg);
  }

  const appUrl = `http://127.0.0.1:${webPort}`;
  updateSplashStatus("กำลังเปิดหน้าต่างหลัก...");

  const ready = await waitForHttp(appUrl, 45000);
  if (ready) {
    createMainWindow(appUrl);
  } else {
    logToFile("main.log", "Server did not become ready in time; opening window anyway.");
    createMainWindow(appUrl);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextServerProcess) {
    nextServerProcess.kill();
    nextServerProcess = null;
  }
  stopPostgreSQL();
});
