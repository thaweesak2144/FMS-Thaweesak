import { app, BrowserWindow, shell, ipcMain } from "electron";
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
let pgProcess: ChildProcess | null = null;

// Paths
const appDataDir = path.join(app.getPath("appData"), "FMS-System");
const pgDataDir = path.join(appDataDir, "pgdata");
const logDir = path.join(appDataDir, "logs");

// Utility: check if port is available
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port, "127.0.0.1");
  });
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
    // In dev, use the existing PostgreSQL service configured in .env
    return true;
  }

  const pgBinDir = path.join(process.resourcesPath, "postgres", "bin");
  const initDbPath = path.join(pgBinDir, "initdb.exe");
  const pgCtlPath = path.join(pgBinDir, "pg_ctl.exe");

  if (!fs.existsSync(pgCtlPath)) {
    console.warn("[PostgreSQL] Portable binary not found at:", pgCtlPath);
    return true; // Fallback to system database
  }

  if (!fs.existsSync(appDataDir)) fs.mkdirSync(appDataDir, { recursive: true });
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  // Initialize DB cluster if not exists
  if (!fs.existsSync(pgDataDir)) {
    updateSplashStatus("กำลังสร้างฐานข้อมูลเริ่มต้น...");
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
async function startNextServer(port: number, pgPort: number): Promise<boolean> {
  if (isDev) {
    return true; // Next.js is run via npm run dev
  }

  updateSplashStatus("กำลังเริ่มต้นระบบบริการ...");
  const serverPath = path.join(process.resourcesPath, "standalone", "server.js");

  if (!fs.existsSync(serverPath)) {
    console.error("[Next.js] Standalone server not found at:", serverPath);
    return false;
  }

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PORT: String(port),
    HOSTNAME: "127.0.0.1",
    NODE_ENV: "production",
    DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${pgPort}/fms_db?schema=public`,
  };

  nextServerProcess = fork(serverPath, [], {
    env,
    stdio: "ignore",
  });

  return true;
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
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
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
    const isPgFree = await isPortAvailable(pgPort);
    if (!isPgFree) pgPort = 5434;

    const isWebFree = await isPortAvailable(webPort);
    if (!isWebFree) webPort = 3011;

    // Start DB
    await startPostgreSQL(pgPort);

    // Start Next.js
    await startNextServer(webPort, pgPort);
  }

  const appUrl = `http://127.0.0.1:${webPort}`;
  updateSplashStatus("กำลังเปิดหน้าต่างหลัก...");

  const ready = await waitForHttp(appUrl, 45000);
  if (ready) {
    createMainWindow(appUrl);
  } else {
    console.error("Server did not become ready in time.");
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
