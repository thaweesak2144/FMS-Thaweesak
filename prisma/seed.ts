import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { seedCore, seedUser } from "./lib/seed-core";
import { requireDatabaseUrl } from "./lib/require-database-url";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: requireDatabaseUrl() }) });

/** รหัสผ่านทุกบัญชีตัวอย่าง */
export const DEV_PASSWORD = "Passw0rd!vibe";

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_PROD !== "1") {
    console.error("[seed] ปฏิเสธ: NODE_ENV=production — ใช้ npm run db:bootstrap แทน");
    process.exit(1);
  }
  const core = await seedCore(prisma, { tenantCode: "DEMO", nameTh: "วิทยาลัยสงฆ์ตาก", nameEn: "mcutak" });
  await prisma.tenant.update({
    where: { id: core.tenantId },
    data: {
      nameTh: "วิทยาลัยสงฆ์ตาก",
      nameEn: "mcutak",
      logoUrl: "/uploads/logo-1789115643437.png",
      settings: { palette: "green" },
    },
  });
  const hash = await bcrypt.hash(DEV_PASSWORD, 12);
  const adminHash = await bcrypt.hash("0644744508Za", 12);
  const users = [
    { email: "ragnaroknaja888@gmail.com", name: "ผู้ดูแลสูงสุด", roles: ["SUPER_ADMIN"], passwordHash: adminHash },
    { email: "staff@app.local", name: "เจ้าหน้าที่", roles: ["STAFF"], passwordHash: hash },
    { email: "viewer@app.local", name: "ผู้ดู", roles: ["VIEWER"], passwordHash: hash },
    { email: "lockme@app.local", name: "บัญชีทดสอบล็อก", roles: ["VIEWER"], passwordHash: hash },
    { email: "forced@app.local", name: "บัญชีบังคับเปลี่ยนรหัส", roles: ["VIEWER"], passwordHash: hash, mustChangePassword: true },
  ];
  for (const u of users) {
    const { passwordHash: uHash, ...rest } = u;
    await seedUser(prisma, core.tenantId, { ...rest, passwordHash: uHash, roleIds: u.roles.map((c) => core.roleIds[c]) });
  }

  // Seed initial departments
  const deptCS = await prisma.department.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "CS" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "CS",
      nameTh: "ภาควิชาวิทยาการคอมพิวเตอร์",
      nameEn: "Department of Computer Science",
      sortOrder: 1,
    },
  });

  const deptIT = await prisma.department.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "IT" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "IT",
      nameTh: "ภาควิชาเทคโนโลยีสารสนเทศ",
      nameEn: "Department of Information Technology",
      sortOrder: 2,
    },
  });

  const deptSE = await prisma.department.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "SE" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "SE",
      nameTh: "สาขาวิชาวิศวกรรมซอฟต์แวร์",
      nameEn: "Software Engineering Program",
      sortOrder: 3,
    },
  });

  const deptPS = await prisma.department.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "PS" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "PS",
      nameTh: "ภาควิชารัฐศาสตร์",
      nameEn: "Department of Political Science",
      sortOrder: 4,
    },
  });

  // Seed sample personnel
  const personnelData = [
    {
      employeeCode: "FMS-001",
      titleTh: "ศ.ดร.",
      titleEn: "Prof. Dr.",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      academicRank: "ศาสตราจารย์",
      positionTh: "คณบดี และอาจารย์ประจำภาควิชา",
      positionEn: "Dean & Professor of Computer Science",
      departmentId: deptCS.id,
      personnelType: "FULL_TIME" as const,
      email: "somchai.j@app.local",
      phone: "02-123-4567",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bioTh: "ผู้เชี่ยวชาญด้านปัญญาประดิษฐ์และวิทยาการข้อมูล มีประสบการณ์สอนและวิจัยกว่า 25 ปี ดำรงตำแหน่งคณบดีประจำคณะ",
      bioEn: "Expert in Artificial Intelligence and Data Science with over 25 years of teaching and research experience.",
      expertiseTags: ["Artificial Intelligence", "Machine Learning", "Data Science", "Computer Vision"],
      isActive: true,
      educations: [
        { degree: "Ph.D. in Computer Science", major: "AI & Neural Networks", institution: "Stanford University", graduationYear: 2005, sortOrder: 1 },
        { degree: "M.S. in Computer Science", major: "Computer Science", institution: "Chulalongkorn University", graduationYear: 2000, sortOrder: 2 },
        { degree: "B.S. in Computer Science", major: "Computer Science", institution: "Chulalongkorn University", graduationYear: 1998, sortOrder: 3 },
      ],
    },
    {
      employeeCode: "FMS-002",
      titleTh: "รศ.ดร.",
      titleEn: "Assoc. Prof. Dr.",
      firstNameTh: "อรทัย",
      lastNameTh: "พัฒนศิลป์",
      firstNameEn: "Orathai",
      lastNameEn: "Pattanasilp",
      academicRank: "รองศาสตราจารย์",
      positionTh: "รองคณบดีฝ่ายวิชาการ",
      positionEn: "Associate Dean for Academic Affairs",
      departmentId: deptSE.id,
      personnelType: "FULL_TIME" as const,
      email: "orathai.p@app.local",
      phone: "02-123-4568",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bioTh: "หัวหน้ากลุ่มวิจัยวิศวกรรมซอฟต์แวร์และการพัฒนาเว็บแอพพลิเคชันระดับองค์กร",
      bioEn: "Head of Software Engineering Research Group and enterprise web development specialist.",
      expertiseTags: ["Software Architecture", "Cloud Computing", "DevOps", "Modular Monolith"],
      isActive: true,
      educations: [
        { degree: "Ph.D. in Software Engineering", major: "Software Architecture", institution: "Tokyo Institute of Technology", graduationYear: 2012, sortOrder: 1 },
        { degree: "M.Eng. in Computer Engineering", major: "Computer Engineering", institution: "Kasetsart University", graduationYear: 2007, sortOrder: 2 },
      ],
    },
    {
      employeeCode: "FMS-003",
      titleTh: "ผศ.",
      titleEn: "Asst. Prof.",
      firstNameTh: "วิชัย",
      lastNameTh: "เก่งการช่าง",
      firstNameEn: "Wichai",
      lastNameEn: "Kengkarnchang",
      academicRank: "ผู้ช่วยศาสตราจารย์",
      positionTh: "หัวหน้าภาควิชาเทคโนโลยีสารสนเทศ",
      positionEn: "Head of Information Technology Department",
      departmentId: deptIT.id,
      personnelType: "FULL_TIME" as const,
      email: "wichai.k@app.local",
      phone: "02-123-4569",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bioTh: "เชี่ยวชาญด้านความมั่นคงปลอดภัยไซเบอร์ เครือข่ายคอมพิวเตอร์ และระบบบริหารจัดการฐานข้อมูลขนาดใหญ่",
      bioEn: "Specialist in Cybersecurity, Computer Networks, and Big Data Database Management.",
      expertiseTags: ["Cybersecurity", "Network Systems", "Database Management", "IoT"],
      isActive: true,
      educations: [
        { degree: "M.S. in Information Technology", major: "Network & Security", institution: "King Mongkut's Institute of Technology Ladkrabang", graduationYear: 2010, sortOrder: 1 },
        { degree: "B.S. in Information Technology", major: "Information Technology", institution: "King Mongkut's University of Technology North Bangkok", graduationYear: 2006, sortOrder: 2 },
      ],
    },
    {
      employeeCode: "FMS-004",
      titleTh: "ดร.",
      titleEn: "Dr.",
      firstNameTh: "กานดา",
      lastNameTh: "สุวรรณรัตน์",
      firstNameEn: "Kanda",
      lastNameEn: "Suwannarat",
      academicRank: "อาจารย์",
      positionTh: "อาจารย์ประจำภาควิชาวิทยาการคอมพิวเตอร์",
      positionEn: "Lecturer in Computer Science",
      departmentId: deptCS.id,
      personnelType: "FULL_TIME" as const,
      email: "kanda.s@app.local",
      phone: "02-123-4570",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      bioTh: "นักวิจัยด้านการประมวลผลภาษาธรรมชาติ (NLP) และโมเดลภาษาขนาดใหญ่ (LLM) สำหรับภาษาไทย",
      bioEn: "Researcher specializing in Natural Language Processing (NLP) and Large Language Models (LLM) for Thai language.",
      expertiseTags: ["NLP", "LLM", "Generative AI", "Python"],
      isActive: true,
      educations: [
        { degree: "Ph.D. in Computer Science", major: "Natural Language Processing", institution: "Edinburgh University", graduationYear: 2021, sortOrder: 1 },
        { degree: "B.Sc. in Computer Science", major: "Computer Science (1st Class Honors)", institution: "Mahidol University", graduationYear: 2016, sortOrder: 2 },
      ],
    },
  ];

  for (const p of personnelData) {
    const { educations, ...profile } = p;
    const existing = await prisma.personnelProfile.findFirst({
      where: { tenantId: core.tenantId, employeeCode: p.employeeCode },
    });

    if (!existing) {
      await prisma.personnelProfile.create({
        data: {
          tenantId: core.tenantId,
          ...profile,
          educations: {
            create: educations,
          },
        },
      });
    }
  }

  // Seed News Categories
  const catAcademic = await prisma.newsCategory.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "ACADEMIC" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "ACADEMIC",
      nameTh: "ข่าววิชาการและงานวิจัย",
      nameEn: "Academic & Research News",
      slug: "academic",
      sortOrder: 1,
    },
  });

  const catScholarship = await prisma.newsCategory.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "SCHOLARSHIP" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "SCHOLARSHIP",
      nameTh: "ทุนการศึกษาและการแข่งขัน",
      nameEn: "Scholarships & Competitions",
      slug: "scholarships",
      sortOrder: 2,
    },
  });

  const catEvent = await prisma.newsCategory.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "EVENT" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "EVENT",
      nameTh: "ข่าวกิจกรรมและการอบรม",
      nameEn: "Events & Workshops",
      slug: "events",
      sortOrder: 3,
    },
  });

  // Seed News Posts
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@app.local" } });

  const newsData = [
    {
      titleTh: "คณะเปิดตัวหลักสูตรใหม่ ปริญญาตรี AI & Data Engineering ตอบรับความต้องการอุตสาหกรรมดิจิทัลระดับสากล",
      titleEn: "Faculty Launches New Bachelor's Program in AI & Data Engineering to Meet Global Digital Industry Demands",
      slug: "new-curriculum-ai-data-engineering",
      categoryId: catAcademic.id,
      coverImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      excerptTh: "เปิดรับนิสิตรุ่นแรกปีการศึกษา 2569 มุ่งเน้นการบูรณาการ Generative AI, Large Language Models และระบบประมวลผล Cloud ขั้นสูง",
      excerptEn: "First cohort intake for Academic Year 2026 focusing on Generative AI, Large Language Models, and advanced Cloud computing.",
      bodyTh: `คณะมีความยินดีประกาศเปิดหลักสูตรใหม่ วิศวกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล (Bachelor of Engineering in Artificial Intelligence and Data Engineering)

หลักสูตรนี้ได้รับการออกแบบร่วมกับผู้เชี่ยวชาญจากภาคอุตสาหกรรมเทคโนโลยีชั้นนำทั้งในและต่างประเทศ เพื่อสร้างบัณฑิตที่มีทักษะการปฏิบัติงานจริงในด้าน:
1. สถาปัตยกรรม Machine Learning และโมเดลภาษาขนาดใหญ่ (LLMs)
2. ระบบวิศวกรรมข้อมูลขนาดใหญ่ (Data Pipelines & Cloud Data Warehousing)
3. ความมั่นคงปลอดภัยและจริยธรรมของปัญญาประดิษฐ์ (AI Ethics & Governance)

ผู้ที่สนใจสามารถศึกษาเกณฑ์การรับสมัครและคุณสมบัติได้ในระบบรับสมัครนิสิตใหม่`,
      bodyEn: `The Faculty is proud to announce the launch of our new program: Bachelor of Engineering in Artificial Intelligence and Data Engineering.

Designed in close collaboration with tech industry leaders, the program prepares graduates for real-world excellence in:
1. Machine Learning Architectures & LLMs
2. Big Data Pipelines & Cloud Infrastructure
3. AI Ethics & Governance`,
      status: "PUBLISHED" as const,
      isPinned: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      viewCount: 142,
    },
    {
      titleTh: "เปิดรับสมัครทุนการศึกษาเรียนดีและทุนวิจัยระดับบัณฑิตศึกษา ประจำปีการศึกษา 2569",
      titleEn: "Call for Applications: Graduate Excellence & Research Scholarships for Academic Year 2026",
      slug: "scholarship-opportunity-2026",
      categoryId: catScholarship.id,
      coverImageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      excerptTh: "สนับสนุนค่าเล่าเรียนเต็มจำนวนพร้อมค่าใช้จ่ายรายเดือน สำหรับนิสิตระดับปริญญาโทและเอกที่ทำวิจัยนวัตกรรม",
      excerptEn: "Full tuition waiver plus monthly stipend for Master and Ph.D. students conducting innovative research.",
      bodyTh: `คณะเปิดรับสมัครผู้ขอรับทุนการศึกษาเพื่อส่งเสริมศักยภาพทางวิชาการและงานวิจัยขั้นสูง ประจำปีการศึกษา 2569

ประเภททุนการศึกษา:
- ทุนยกเว้นค่าธรรมเนียมการศึกษา 100%
- ทุนผู้ช่วยสอนและผู้ช่วยวิจัย (TA/RA) พร้อมเงินสนับสนุนรายเดือน
- ทุนสนับสนุนการนำเสนอผลงานวิชาการในที่ประชุมวิชาการระดับนานาชาติ

กำหนดการรับสมัคร: ตั้งแต่วันนี้ จนถึงวันที่ 30 พฤศจิกายน 2569 ผ่านระบบออนไลน์`,
      bodyEn: `Applications are now open for Academic Year 2026 Graduate Excellence & Research Scholarships.

Available Scholarship Categories:
- 100% Tuition Fee Waiver
- Teaching and Research Assistantships (TA/RA) with monthly stipend
- International Conference Travel Grants

Application Deadline: November 30, 2026 through the online portal.`,
      status: "PUBLISHED" as const,
      isPinned: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      viewCount: 89,
    },
    {
      titleTh: "ขอเชิญเข้าร่วมงานประชุมวิชาการระดับชาติ Digital Transformation in Higher Education 2026",
      titleEn: "Invitation: National Conference on Digital Transformation in Higher Education 2026",
      slug: "conference-digital-transformation-2026",
      categoryId: catEvent.id,
      coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      excerptTh: "พบกับการบรรยายพิเศษจากคณาจารย์และผู้ทรงคุณวุฒิ พร้อมการนำเสนองานวิจัยด้าน EdTech และ AI in Education",
      excerptEn: "Keynote sessions from distinguished faculty and researchers showcasing EdTech innovations and AI in education.",
      bodyTh: `ขอเชิญคณาจารย์ นิสิตนักศึกษา นักวิจัย และบุคคลทั่วไป เข้าร่วมงานประชุมวิชาการระดับชาติ Digital Transformation in Higher Education 2026

หัวข้อการบรรยายพิเศษ:
- บทบาทของ Generative AI ในการเรียนการสอนยุคใหม่
- การพัฒนา Modular Monolith Platform สำหรับสถาบันการศึกษา
- การรักษาความมั่นคงปลอดภัยไซเบอร์ในระบบสารสนเทศมหาวิทยาลัย

งานจัดขึ้น ณ หอประชุมใหญ่ประจำคณะ และถ่ายทอดสดผ่านระบบออนไลน์`,
      bodyEn: `You are cordially invited to join the National Conference on Digital Transformation in Higher Education 2026.

Featured Sessions:
- The role of Generative AI in modern pedagogical practices
- Developing enterprise modular monolith platforms for higher education
- University-wide cybersecurity risk management`,
      status: "PUBLISHED" as const,
      isPinned: false,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      viewCount: 56,
    },
  ];

  for (const n of newsData) {
    const existing = await prisma.newsPost.findFirst({
      where: { tenantId: core.tenantId, slug: n.slug },
    });
    if (!existing) {
      await prisma.newsPost.create({
        data: {
          tenantId: core.tenantId,
          authorId: adminUser?.id ?? null,
          ...n,
        },
      });
    }
  }

  // --- Seed Curriculums ---
  const curriculumCS = await prisma.curriculum.findFirst({ where: { tenantId: core.tenantId, code: "256601CS" } });
  if (!curriculumCS) {
    const cs = await prisma.curriculum.create({
      data: {
        tenantId: core.tenantId,
        departmentId: deptCS.id,
        code: "256601CS",
        nameTh: "วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์",
        nameEn: "Bachelor of Science in Computer Science",
        degreeLevel: "BACHELOR",
        totalCredits: 129,
        curriculumYear: 2566,
        studyPeriodYears: 4,
        tuitionFee: 25000,
        philosophyTh: "มุ่งเน้นการผลิตบัณฑิตที่มีความรู้ความสามารถทางการพัฒนาซอฟต์แวร์ ปัญญาประดิษฐ์ และระบบคอมพิวเตอร์สมัยใหม่",
        careerProspectsTh: "- นักพัฒนาซอฟต์แวร์ (Software Developer)\n- วิศวกรข้อมูล (Data Engineer)\n- นักวิทยาศาสตร์ข้อมูล (Data Scientist)",
        isActive: true,
      }
    });

    // Seed Study Plan for CS
    await prisma.curriculumPlan.createMany({
      data: [
        { curriculumId: cs.id, academicYear: 1, semester: 1, courseCode: "CS101", courseNameTh: "การเขียนโปรแกรมคอมพิวเตอร์ 1", courseNameEn: "Computer Programming I", credits: 3, courseType: "วิชาแกน" },
        { curriculumId: cs.id, academicYear: 1, semester: 1, courseCode: "MA101", courseNameTh: "แคลคูลัส 1", courseNameEn: "Calculus I", credits: 3, courseType: "วิชาพื้นฐาน" },
        { curriculumId: cs.id, academicYear: 1, semester: 2, courseCode: "CS102", courseNameTh: "โครงสร้างข้อมูลและอัลกอริทึม", courseNameEn: "Data Structures and Algorithms", credits: 3, courseType: "วิชาแกน" },
        { curriculumId: cs.id, academicYear: 2, semester: 1, courseCode: "CS201", courseNameTh: "สถาปัตยกรรมคอมพิวเตอร์", courseNameEn: "Computer Architecture", credits: 3, courseType: "วิชาเฉพาะบังคับ" },
        { curriculumId: cs.id, academicYear: 2, semester: 2, courseCode: "CS202", courseNameTh: "ระบบฐานข้อมูล", courseNameEn: "Database Systems", credits: 3, courseType: "วิชาเฉพาะบังคับ" },
      ]
    });
  }

  const curriculumIT = await prisma.curriculum.findFirst({ where: { tenantId: core.tenantId, code: "256602IT" } });
  if (!curriculumIT) {
    const it = await prisma.curriculum.create({
      data: {
        tenantId: core.tenantId,
        departmentId: deptIT.id,
        code: "256602IT",
        nameTh: "วิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศ",
        nameEn: "Bachelor of Science in Information Technology",
        degreeLevel: "BACHELOR",
        totalCredits: 125,
        curriculumYear: 2566,
        studyPeriodYears: 4,
        tuitionFee: 22000,
        philosophyTh: "ผลิตบัณฑิตให้มีความเชี่ยวชาญด้านการประยุกต์ใช้เทคโนโลยีสารสนเทศ การบริหารจัดการเครือข่าย และความปลอดภัยไซเบอร์",
        careerProspectsTh: "- นักวิเคราะห์ระบบสารสนเทศ (System Analyst)\n- ผู้ดูแลระบบเครือข่าย (Network Administrator)\n- ผู้เชี่ยวชาญความปลอดภัยไซเบอร์ (Cybersecurity Specialist)",
        isActive: true,
      }
    });

    await prisma.curriculumPlan.createMany({
      data: [
        { curriculumId: it.id, academicYear: 1, semester: 1, courseCode: "IT101", courseNameTh: "ความรู้เบื้องต้นเกี่ยวกับเทคโนโลยีสารสนเทศ", courseNameEn: "Introduction to IT", credits: 3, courseType: "วิชาแกน" },
        { curriculumId: it.id, academicYear: 1, semester: 2, courseCode: "IT102", courseNameTh: "พื้นฐานเครือข่ายคอมพิวเตอร์", courseNameEn: "Computer Network Fundamentals", credits: 3, courseType: "วิชาแกน" },
        { curriculumId: it.id, academicYear: 2, semester: 1, courseCode: "IT201", courseNameTh: "ความปลอดภัยของระบบสารสนเทศ", courseNameEn: "Information System Security", credits: 3, courseType: "วิชาเฉพาะบังคับ" },
      ]
    });
  }

  const curriculumMasterCS = await prisma.curriculum.findFirst({ where: { tenantId: core.tenantId, code: "2567M1CS" } });
  if (!curriculumMasterCS) {
    await prisma.curriculum.create({
      data: {
        tenantId: core.tenantId,
        departmentId: deptCS.id,
        code: "2567M1CS",
        nameTh: "วิทยาศาสตรมหาบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์",
        nameEn: "Master of Science in Computer Science",
        degreeLevel: "MASTER",
        totalCredits: 36,
        curriculumYear: 2567,
        studyPeriodYears: 2,
        tuitionFee: 45000,
        philosophyTh: "มุ่งเน้นการวิจัยและพัฒนาองค์ความรู้ระดับสูงทางวิทยาการคอมพิวเตอร์ โดยเน้นเทคโนโลยีเกิดใหม่ เช่น AI และ Quantum Computing",
        isActive: true,
      }
    });
  }

  const curriculumBPA = await prisma.curriculum.findFirst({ where: { tenantId: core.tenantId, code: "T20232145107835" } });
  if (!curriculumBPA) {
    const bpa = await prisma.curriculum.create({
      data: {
        tenantId: core.tenantId,
        departmentId: deptPS.id,
        code: "T20232145107835",
        nameTh: "หลักสูตรรัฐประศาสนศาสตรบัณฑิต สาขาวิชารัฐประศาสนศาสตร์ (หลักสูตรใหม่ พ.ศ. ๒๕๖๖)",
        nameEn: "Bachelor of Public Administration Program in Public Administration",
        degreeLevel: "BACHELOR",
        totalCredits: 132,
        curriculumYear: 2566,
        studyPeriodYears: 4,
        tuitionFee: 8000,
        degreeNameTh: "รัฐประศาสนศาสตรบัณฑิต (รัฐประศาสนศาสตร์)",
        degreeNameEn: "Bachelor of Public Administration (Public Administration)",
        degreeAbbrTh: "รป.บ. (รัฐประศาสนศาสตร์)",
        degreeAbbrEn: "B.P.A. (Public Administration)",
        philosophyTh: "มุ่งเน้นผลิตบัณฑิตทางรัฐประศาสนศาสตร์ที่เปี่ยมไปด้วยความรู้บูรณาการกับหลักพุทธธรรม มีคุณธรรมจริยธรรม มีภาวะผู้นำ และมีจิตสาธารณะ พร้อมรับใช้สังคม ประเทศชาติ และพระพุทธศาสนา",
        objectivesTh: `๑. เพื่อผลิตบัณฑิตให้มีความรู้ความเข้าใจในหลักวิชาการ ทฤษฎี และทักษะปฏิบัติทางรัฐประศาสนศาสตร์ บูรณาการกับหลักพุทธธรรม\n๒. เพื่อผลิตบัณฑิตให้มีทักษะในการวิเคราะห์สถานการณ์ทางรัฐประศาสนศาสตร์ การพัฒนานวัตกรรมทางการบริหารเพื่อแก้ปัญหาสังคม มีความสามารถในการใช้เทคโนโลยีสารสนเทศและการสื่อสาร\n๓. เพื่อผลิตบัณฑิตให้มีคุณธรรมจริยธรรม มีความรับผิดชอบและมีจิตสาธารณะ สามารถประยุกต์ใช้คุณธรรมจริยธรรมในการแก้ปัญหาตนเองและสังคม`,
        ploTh: `PLO ๑: สามารถอธิบายหลักการ แนวคิดทฤษฎีทางรัฐประศาสนศาสตร์และหลักพุทธธรรมได้\nPLO ๒: สามารถวิเคราะห์และประยุกต์ใช้องค์ความรู้ทางรัฐประศาสนศาสตร์ได้\nPLO ๓: มีคุณธรรมจริยธรรมและมีจิตสาธารณะ สามารถประยุกต์ใช้คุณธรรมจริยธรรมในการแก้ปัญหาได้\nPLO ๔: มีทักษะด้านความสัมพันธ์ระหว่างบุคคล สามารถทำงานเป็นทีม มีความรับผิดชอบต่อตนเองและสังคม\nPLO ๕: สามารถใช้เทคโนโลยีสารสนเทศ และสื่อสารนำเสนอได้อย่างมีประสิทธิภาพ`,
        careerProspectsTh: `๑) ปลัดอำเภอ ปลัดองค์กรปกครองส่วนท้องถิ่น\n๒) ข้าราชการพลเรือน ทหาร และตำรวจ\n๓) พนักงานภาครัฐ รัฐวิสาหกิจ องค์กรอิสระ และเอกชน\n๔) ครู อาจารย์ในสถาบันการศึกษาทั้งภาครัฐและเอกชน\n๕) นักการเมือง นักวิชาการ นักปกครอง`,
        isActive: true,
        sortOrder: 1,
      },
    });

    await prisma.curriculumPlan.createMany({
      data: [
        { curriculumId: bpa.id, academicYear: 1, semester: 1, courseCode: "000 101", courseNameTh: "มนุษย์กับสังคม", courseNameEn: "Man and Society", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 1 },
        { curriculumId: bpa.id, academicYear: 1, semester: 1, courseCode: "000 102", courseNameTh: "กฎหมายทั่วไป", courseNameEn: "General Law", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 2 },
        { curriculumId: bpa.id, academicYear: 1, semester: 1, courseCode: "000 134", courseNameTh: "วรรณกรรมพระพุทธศาสนา", courseNameEn: "Buddhist Literature", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 3 },
        { curriculumId: bpa.id, academicYear: 1, semester: 1, courseCode: "000 135", courseNameTh: "พระไตรปิฎกศึกษา", courseNameEn: "Tipitaka Studies", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 4 },
        { curriculumId: bpa.id, academicYear: 1, semester: 1, courseCode: "000 137", courseNameTh: "ประวัติพระพุทธศาสนา", courseNameEn: "History of Buddhism", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 5 },
        { curriculumId: bpa.id, academicYear: 1, semester: 1, courseCode: "401 101", courseNameTh: "ความรู้เบื้องต้นทางรัฐศาสตร์", courseNameEn: "Introduction to Political Science", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 6 },
        { curriculumId: bpa.id, academicYear: 1, semester: 2, courseCode: "000 205", courseNameTh: "ปรัชญาเบื้องต้น", courseNameEn: "Introduction to Philosophy", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 1 },
        { curriculumId: bpa.id, academicYear: 1, semester: 2, courseCode: "000 107", courseNameTh: "ความรู้เบื้องต้นเกี่ยวกับการเมืองการปกครอง", courseNameEn: "Introduction to Politics and Government", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาเลือก)", sortOrder: 2 },
        { curriculumId: bpa.id, academicYear: 1, semester: 2, courseCode: "000 136", courseNameTh: "ภาษาบาลี", courseNameEn: "Pali", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 3 },
        { curriculumId: bpa.id, academicYear: 1, semester: 2, courseCode: "000 140", courseNameTh: "กรรมฐาน ๑", courseNameEn: "Buddhist Meditation I", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 4 },
        { curriculumId: bpa.id, academicYear: 1, semester: 2, courseCode: "402 101", courseNameTh: "ความรู้เบื้องต้นทางรัฐประศาสนศาสตร์", courseNameEn: "Principle of Public Administration", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 5 },
        { curriculumId: bpa.id, academicYear: 1, semester: 2, courseCode: "402 102", courseNameTh: "ทฤษฎีทางรัฐประศาสนศาสตร์", courseNameEn: "Public Administration Theory", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 6 },
        { curriculumId: bpa.id, academicYear: 1, semester: 2, courseCode: "402 103", courseNameTh: "องค์การและการจัดการ", courseNameEn: "Organizational and Public Administration", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 7 },
        { curriculumId: bpa.id, academicYear: 2, semester: 1, courseCode: "000 103", courseNameTh: "คอมพิวเตอร์และเทคโนโลยีดิจิทัล", courseNameEn: "Computer and Digital Technology", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 1 },
        { curriculumId: bpa.id, academicYear: 2, semester: 1, courseCode: "000 204", courseNameTh: "ภาษาอังกฤษเพื่อการสื่อสาร", courseNameEn: "English for Communications", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 2 },
        { curriculumId: bpa.id, academicYear: 2, semester: 1, courseCode: "000 108", courseNameTh: "เศรษฐศาสตร์เบื้องต้น", courseNameEn: "Introduction to Economics", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาเลือก)", sortOrder: 3 },
        { curriculumId: bpa.id, academicYear: 2, semester: 1, courseCode: "000 238", courseNameTh: "เทศกาลและพิธีกรรมพระพุทธศาสนา", courseNameEn: "Buddhist Festival and Traditions", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 4 },
        { curriculumId: bpa.id, academicYear: 2, semester: 1, courseCode: "402 204", courseNameTh: "นโยบายสาธารณะและการวางแผน", courseNameEn: "Public Policy and Plan", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 5 },
        { curriculumId: bpa.id, academicYear: 2, semester: 1, courseCode: "402 205", courseNameTh: "พฤติกรรมองค์การ", courseNameEn: "Organizational Behaviors", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 6 },
        { curriculumId: bpa.id, academicYear: 2, semester: 2, courseCode: "000 206", courseNameTh: "คณิตศาสตร์และสถิติเพื่อการวิจัย", courseNameEn: "Mathematics and Statistics for Research", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 1 },
        { curriculumId: bpa.id, academicYear: 2, semester: 2, courseCode: "000 239", courseNameTh: "ธรรมะภาคภาษาอังกฤษ", courseNameEn: "Dhamma in English", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 2 },
        { curriculumId: bpa.id, academicYear: 2, semester: 2, courseCode: "000 241", courseNameTh: "กรรมฐาน ๒", courseNameEn: "Buddhist Meditation II", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 3 },
        { curriculumId: bpa.id, academicYear: 2, semester: 2, courseCode: "402 206", courseNameTh: "การบริหารทรัพยากรมนุษย์", courseNameEn: "Human Resource Management", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 4 },
        { curriculumId: bpa.id, academicYear: 2, semester: 2, courseCode: "402 307", courseNameTh: "การบริหารงบประมาณและการคลังสาธารณะ", courseNameEn: "Public Budgeting and Fiscal Administration", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 5 },
        { curriculumId: bpa.id, academicYear: 2, semester: 2, courseCode: "402 212", courseNameTh: "นวัตกรรมการบริหารสมัยใหม่", courseNameEn: "Innovation in modern management", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 6 },
        { curriculumId: bpa.id, academicYear: 3, semester: 1, courseCode: "000 342", courseNameTh: "กรรมฐาน ๓", courseNameEn: "Buddhist Meditation III", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 1 },
        { curriculumId: bpa.id, academicYear: 3, semester: 1, courseCode: "402 308", courseNameTh: "การบริหารการพัฒนาและการบริหารโครงการ", courseNameEn: "Development Management and Project Management", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 2 },
        { curriculumId: bpa.id, academicYear: 3, semester: 1, courseCode: "402 309", courseNameTh: "เทคนิคและเครื่องมือการบริหารทางรัฐประศาสนศาสตร์", courseNameEn: "Technique and tools in Public Administration", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 3 },
        { curriculumId: bpa.id, academicYear: 3, semester: 1, courseCode: "402 311", courseNameTh: "การบริหารการคลังส่วนท้องถิ่น", courseNameEn: "Local Fiscal Management", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 4 },
        { curriculumId: bpa.id, academicYear: 3, semester: 1, courseCode: "402 314", courseNameTh: "กฎหมายอาญา ๑", courseNameEn: "Criminal Law I", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 5 },
        { curriculumId: bpa.id, academicYear: 3, semester: 1, courseCode: "402 315", courseNameTh: "กฎหมายวิธีพิจารณาความอาญา", courseNameEn: "Criminal Procedure Code", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 6 },
        { curriculumId: bpa.id, academicYear: 3, semester: 2, courseCode: "000 443", courseNameTh: "กรรมฐาน ๔", courseNameEn: "Buddhist Meditation IV", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 1 },
        { curriculumId: bpa.id, academicYear: 3, semester: 2, courseCode: "402 310", courseNameTh: "การบริหารเชิงกลยุทธ์", courseNameEn: "Strategic Management", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 2 },
        { curriculumId: bpa.id, academicYear: 3, semester: 2, courseCode: "402 316", courseNameTh: "ระเบียบวิธีวิจัยทางรัฐประศาสนศาสตร์", courseNameEn: "Research Methodology for Public Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 3 },
        { curriculumId: bpa.id, academicYear: 3, semester: 2, courseCode: "402 317", courseNameTh: "ภาษาอังกฤษสำหรับรัฐประศาสนศาสตร์", courseNameEn: "English for Public Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 4 },
        { curriculumId: bpa.id, academicYear: 3, semester: 2, courseCode: "402 318", courseNameTh: "การศึกษาอิสระทางรัฐประศาสนศาสตร์", courseNameEn: "Independent Study on Public Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 5 },
        { curriculumId: bpa.id, academicYear: 3, semester: 2, courseCode: "402 321", courseNameTh: "กฎหมายลักษณะพยาน", courseNameEn: "Law of Evidence", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 6 },
        { curriculumId: bpa.id, academicYear: 4, semester: 1, courseCode: "402 419", courseNameTh: "สัมมนาทางรัฐประศาสนศาสตร์เชิงพุทธ", courseNameEn: "Seminar in Public Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 1 },
        { curriculumId: bpa.id, academicYear: 4, semester: 1, courseCode: "402 420", courseNameTh: "กฎหมายปกครอง", courseNameEn: "Administrative Law", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 2 },
        { curriculumId: bpa.id, academicYear: 4, semester: 1, courseCode: "FREE 001", courseNameTh: "วิชาเลือกเสรี ๑ (เช่น การจัดการความขัดแย้ง)", courseNameEn: "Free Elective I (e.g. Conflict Management)", credits: 3, courseType: "หมวดวิชาเลือกเสรี", sortOrder: 3 },
        { curriculumId: bpa.id, academicYear: 4, semester: 1, courseCode: "FREE 002", courseNameTh: "วิชาเลือกเสรี ๒ (เช่น การพัฒนาเศรษฐกิจชุมชนอย่างยั่งยืน)", courseNameEn: "Free Elective II (e.g. Sustainable Community Development)", credits: 3, courseType: "หมวดวิชาเลือกเสรี", sortOrder: 4 },
        { curriculumId: bpa.id, academicYear: 4, semester: 2, courseCode: "402 413", courseNameTh: "พุทธจริยธรรมทางการบริหาร", courseNameEn: "Buddhist Ethics in Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 1 },
        { curriculumId: bpa.id, academicYear: 4, semester: 2, courseCode: "402 441", courseNameTh: "การฝึกประสบการณ์ทางรัฐประศาสนศาสตร์", courseNameEn: "Practice Experience in Public Administration", credits: 3, courseType: "หมวดวิชาเลือกเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 2 },
        { curriculumId: bpa.id, academicYear: 4, semester: 2, courseCode: "402 428", courseNameTh: "ดิจิตอลเพื่อการบริหารงานภาครัฐ", courseNameEn: "Digital for Public Administration", credits: 3, courseType: "หมวดวิชาเลือกเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 3 },
      ],
    });
  }

  console.log(`[seed] เสร็จ — login: admin@app.local / ${DEV_PASSWORD}`);
}

main().finally(() => prisma.$disconnect());
