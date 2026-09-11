/**
 * สคริปต์ Sync การตั้งค่า (Settings) และไฟล์อัปโหลด (Uploads)
 * จากเครื่อง Development (ums_dev) เข้าสู่ Docker Production (ums_prod)
 */
import { execSync } from "child_process";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

async function sync() {
  console.log("🔄 กำลังตรวจสอบและ Sync ข้อมูลจาก Dev ไปยัง Docker Production...");

  const devDbUrl = process.env.DATABASE_URL ?? "postgresql://postgres:0644744508@localhost:5432/ums_dev?schema=public";
  const prodDbUrl = process.env.PROD_DATABASE_URL ?? "postgresql://postgres:Passw0rd!vibe@localhost:5433/ums_prod?schema=public";

  const devDb = new PrismaClient({ adapter: new PrismaPg({ connectionString: devDbUrl }) });
  const prodDb = new PrismaClient({ adapter: new PrismaPg({ connectionString: prodDbUrl }) });

  try {
    const devTenant = await devDb.tenant.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } });
    if (!devTenant) {
      console.warn("⚠️ ไม่พบข้อมูล Tenant ใน Dev Database");
      return;
    }

    console.log(`📋 พบการตั้งค่า Dev: "${devTenant.nameTh}" (${devTenant.nameEn})`);

    const prodTenant = await prodDb.tenant.findFirst({ orderBy: { createdAt: "asc" } });
    if (prodTenant) {
      await prodDb.tenant.update({
        where: { id: prodTenant.id },
        data: {
          nameTh: devTenant.nameTh,
          nameEn: devTenant.nameEn,
          logoUrl: devTenant.logoUrl,
          settings: devTenant.settings ?? {},
        },
      });
      console.log("✅ อัปเดตข้อมูลการตั้งค่าและธีมเข้าสู่ Docker Production (ums_prod) สำเร็จ!");
    }

    // Sync superadmin user
    const devAdmin = await devDb.user.findFirst({ where: { email: "ragnaroknaja888@gmail.com" } });
    if (devAdmin) {
      const prodAdmin = await prodDb.user.findFirst({ where: { email: { in: ["admin@app.local", "ragnaroknaja888@gmail.com"] } } });
      if (prodAdmin) {
        await prodDb.user.update({
          where: { id: prodAdmin.id },
          data: {
            email: devAdmin.email,
            passwordHash: devAdmin.passwordHash,
            name: devAdmin.name,
          },
        });
        console.log("✅ ซิงค์บัญชี Super Admin (ragnaroknaja888@gmail.com) เข้าสู่ Docker Production สำเร็จ!");
      }
    }

    // คัดลอกไฟล์รูปภาพใน public/uploads ไปยัง Docker Container
    const uploadsDir = join(process.cwd(), "public/uploads");
    if (existsSync(uploadsDir) && readdirSync(uploadsDir).length > 0) {
      console.log("📁 กำลังคัดลอกไฟล์อัปโหลดเข้า Docker Container (fms-web-portal)...");
      try {
        execSync(`docker cp "${uploadsDir}/." fms-web-portal:/app/public/uploads/`, { stdio: "inherit" });
        console.log("✅ คัดลอกไฟล์รูปภาพและโลโก้เข้า Docker Container เรียบร้อย!");
      } catch {
        console.warn("⚠️ ไม่สามารถ docker cp ได้ (กรุณาตรวจสอบว่า Container fms-web-portal กำลังรันอยู่หรือไม่)");
      }
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ เกิดข้อผิดพลาดขณะ Sync:", errorMsg);
  } finally {
    await devDb.$disconnect();
    await prodDb.$disconnect();
  }
}

sync();
