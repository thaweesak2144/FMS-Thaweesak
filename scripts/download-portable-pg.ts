import fs from "fs";
import path from "path";
import https from "https";
import { execSync } from "child_process";

// URL to PostgreSQL 16 Windows x64 binaries (official EnterpriseDB / Portable distribution)
const PG_WIN_URL = "https://get.enterprisedb.com/postgresql/postgresql-16.3-1-windows-x64-binaries.zip";

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        // Handle redirect
        if (response.statusCode === 302 || response.statusCode === 301) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            downloadFile(redirectUrl, dest).then(resolve).catch(reject);
            return;
          }
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlinkSync(dest);
        reject(err);
      });
  });
}

async function main() {
  const rootDir = process.cwd();
  const resourcesDir = path.join(rootDir, "resources");
  const pgTargetDir = path.join(resourcesDir, "postgres");
  const zipPath = path.join(resourcesDir, "postgres-win-x64.zip");

  if (fs.existsSync(path.join(pgTargetDir, "bin", "pg_ctl.exe"))) {
    console.log("[download-portable-pg] Portable PostgreSQL binaries already exist in resources/postgres.");
    return;
  }

  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  }

  console.log("[download-portable-pg] Downloading PostgreSQL portable binaries for Windows...");
  console.log(`[download-portable-pg] Source: ${PG_WIN_URL}`);

  try {
    await downloadFile(PG_WIN_URL, zipPath);
    console.log("[download-portable-pg] Download complete. Extracting binaries...");

    // Use Windows built-in tar / PowerShell to extract
    execSync(`tar -xf "${zipPath}" -C "${resourcesDir}"`);

    // Clean up zip
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    // EnterpriseDB zip extracts to resources/pgsql, rename to resources/postgres
    const extractedDir = path.join(resourcesDir, "pgsql");
    if (fs.existsSync(extractedDir) && !fs.existsSync(pgTargetDir)) {
      fs.renameSync(extractedDir, pgTargetDir);
    }

    console.log("[download-portable-pg] Portable PostgreSQL is ready in resources/postgres!");
  } catch (error) {
    console.error("[download-portable-pg] Note: If downloading fails (e.g. offline/network firewall), you can manually place PostgreSQL binaries into 'resources/postgres/bin'.");
    console.error(error);
  }
}

main().catch(console.error);
