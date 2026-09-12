import fs from "fs";
import path from "path";

function copyRecursiveSync(src: string, dest: string) {
  const exists = fs.existsSync(src);
  if (!exists) return;

  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function main() {
  console.log("[bundle-standalone] Preparing standalone directory for Electron...");

  const rootDir = process.cwd();
  const standaloneDir = path.join(rootDir, ".next", "standalone");
  const staticSrc = path.join(rootDir, ".next", "static");
  const staticDest = path.join(standaloneDir, ".next", "static");
  const publicSrc = path.join(rootDir, "public");
  const publicDest = path.join(standaloneDir, "public");

  if (!fs.existsSync(standaloneDir)) {
    console.error("[bundle-standalone] Error: .next/standalone does not exist. Please run 'next build' first.");
    process.exit(1);
  }

  // Copy .next/static -> .next/standalone/.next/static
  console.log(`[bundle-standalone] Copying static assets to ${staticDest}`);
  copyRecursiveSync(staticSrc, staticDest);

  // Copy public -> .next/standalone/public
  console.log(`[bundle-standalone] Copying public folder to ${publicDest}`);
  copyRecursiveSync(publicSrc, publicDest);

  // Copy electron/splash.html -> dist-electron/splash.html
  const distElectron = path.join(rootDir, "dist-electron");
  const splashSrc = path.join(rootDir, "electron", "splash.html");
  if (fs.existsSync(distElectron) && fs.existsSync(splashSrc)) {
    fs.copyFileSync(splashSrc, path.join(distElectron, "splash.html"));
    console.log("[bundle-standalone] Copied splash.html to dist-electron/");
  }

  console.log("[bundle-standalone] Standalone bundle is ready!");
}

main().catch((err) => {
  console.error("[bundle-standalone] Error:", err);
  process.exit(1);
});
