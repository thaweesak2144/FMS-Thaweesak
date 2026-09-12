const fs = require("fs");
const path = require("path");

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;

  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursiveSync(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

exports.default = async function (context) {
  console.log("[afterPack] Copying standalone Next.js server with node_modules...");
  const rootDir = process.cwd();
  const standaloneSrc = path.join(rootDir, ".next", "standalone");
  const destDir = path.join(context.appOutDir, "resources", "standalone");

  if (!fs.existsSync(standaloneSrc)) {
    throw new Error("[afterPack] .next/standalone does not exist! Please build Next.js first.");
  }

  // Copy entire .next/standalone (including its node_modules)
  copyRecursiveSync(standaloneSrc, destDir);

  // Ensure root .env is copied to resources/standalone/.env
  const rootEnv = path.join(rootDir, ".env");
  const destEnv = path.join(destDir, ".env");
  if (fs.existsSync(rootEnv)) {
    fs.copyFileSync(rootEnv, destEnv);
    console.log("[afterPack] Copied .env to resources/standalone/.env");
  }

  console.log("[afterPack] Standalone Next.js server successfully installed in app resources!");
};
