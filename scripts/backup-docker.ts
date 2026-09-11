import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

async function main() {
  console.log("📦 เริ่มต้นการสำรองข้อมูล (Backup) จาก Docker Production...");

  const prismaDir = join(process.cwd(), "prisma");
  const backupFile = join(prismaDir, "database-backup.sql");
  const uploadsDir = join(process.cwd(), "public", "uploads");

  if (!existsSync(prismaDir)) mkdirSync(prismaDir, { recursive: true });
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  // 1. Export database from fms-postgres container
  console.log("🗄️ กำลังดึงข้อมูลฐานข้อมูล ums_prod จาก Docker Container (fms-postgres)...");
  try {
    execSync(`docker exec fms-postgres pg_dump -U postgres -d ums_prod --schema=public --clean --if-exists > "${backupFile}"`, { stdio: "inherit" });
    console.log(`✅ สำรองฐานข้อมูลลงไฟล์เรียบร้อย: ${backupFile}`);
  } catch (err) {
    console.error("❌ ไม่สามารถดึงฐานข้อมูลจาก Docker ได้ (คอนเทนเนอร์ fms-postgres กำลังรันอยู่หรือไม่?):", err);
  }

  // 2. Export uploads from fms-web-portal container
  console.log("📁 กำลังดึงไฟล์ที่อัปโหลดทั้งหมดจาก Docker Container (fms-web-portal)...");
  try {
    execSync(`docker cp fms-web-portal:/app/public/uploads/. "${uploadsDir}/"`, { stdio: "inherit" });
    console.log(`✅ คัดลอกไฟล์รูปภาพและเอกสารเข้าโฟลเดอร์เรียบร้อย: ${uploadsDir}`);
  } catch (err) {
    console.warn("⚠️ ไม่สามารถดึงไฟล์อัปโหลดจาก Container ได้:", err);
  }

  console.log("\n🎉 สำรองข้อมูล Docker ทั้งหมดเสร็จสิ้น!");
}

main().catch(console.error);
