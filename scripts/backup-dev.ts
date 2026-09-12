import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import "dotenv/config";

async function main() {
  console.log("📦 เริ่มต้นสำรองข้อมูลฐานข้อมูล Development (ums_dev)...");

  const prismaDir = join(process.cwd(), "prisma");
  const backupFile = join(prismaDir, "database-backup.sql");
  const uploadsDir = join(process.cwd(), "public", "uploads");

  if (!existsSync(prismaDir)) mkdirSync(prismaDir, { recursive: true });
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:0644744508@localhost:5432/ums_dev";
  
  let pgDumpPath = "pg_dump";
  const pgWindowsPath = "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe";
  if (existsSync(pgWindowsPath)) {
    pgDumpPath = `"${pgWindowsPath}"`;
  }

  try {
    console.log(`🗄️ กำลังสำรองฐานข้อมูลไปยัง: ${backupFile}`);
    execSync(`${pgDumpPath} --dbname="${dbUrl}" --schema=public --clean --if-exists -f "${backupFile}"`, {
      stdio: "inherit",
      env: { ...process.env },
    });
    console.log(`✅ สำรองฐานข้อมูลเรียบร้อย: ${backupFile}`);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการสำรองข้อมูล:", err);
  }

  console.log("\n🎉 สำรองข้อมูลเสร็จสิ้น! สามารถ commit ไฟล์ prisma/database-backup.sql ขึ้น GitHub ได้");
}

main().catch(console.error);
