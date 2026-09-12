import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { requireDatabaseUrl } from "./lib/require-database-url";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: requireDatabaseUrl() }) });

async function main() {
  console.log("Seeding TQF:2 B.P.A. Curriculum 2566...");

  // 1. Find default tenant
  const tenant = await prisma.tenant.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (!tenant) {
    throw new Error("No active tenant found");
  }

  // 2. Create or find Department of Political Science (ภาควิชารัฐศาสตร์)
  const deptPS = await prisma.department.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: "PS" } },
    update: {
      nameTh: "ภาควิชารัฐศาสตร์",
      nameEn: "Department of Political Science",
    },
    create: {
      tenantId: tenant.id,
      code: "PS",
      nameTh: "ภาควิชารัฐศาสตร์",
      nameEn: "Department of Political Science",
      sortOrder: 4,
    },
  });

  console.log(`Department: ${deptPS.nameTh} (${deptPS.code})`);

  // 3. Upsert Curriculum T20232145107835
  const curriculum = await prisma.curriculum.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: "T20232145107835" } },
    update: {
      departmentId: deptPS.id,
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
      objectivesTh: `๑. เพื่อผลิตบัณฑิตให้มีความรู้ความเข้าใจในหลักวิชาการ ทฤษฎี และทักษะปฏิบัติทางรัฐประศาสนศาสตร์ บูรณาการกับหลักพุทธธรรม
๒. เพื่อผลิตบัณฑิตให้มีทักษะในการวิเคราะห์สถานการณ์ทางรัฐประศาสนศาสตร์ การพัฒนานวัตกรรมทางการบริหารเพื่อแก้ปัญหาสังคม มีความสามารถในการใช้เทคโนโลยีสารสนเทศและการสื่อสาร
๓. เพื่อผลิตบัณฑิตให้มีคุณธรรมจริยธรรม มีความรับผิดชอบและมีจิตสาธารณะ สามารถประยุกต์ใช้คุณธรรมจริยธรรมในการแก้ปัญหาตนเองและสังคม`,
      ploTh: `PLO ๑: สามารถอธิบายหลักการ แนวคิดทฤษฎีทางรัฐประศาสนศาสตร์และหลักพุทธธรรมได้
PLO ๒: สามารถวิเคราะห์และประยุกต์ใช้องค์ความรู้ทางรัฐประศาสนศาสตร์ได้
PLO ๓: มีคุณธรรมจริยธรรมและมีจิตสาธารณะ สามารถประยุกต์ใช้คุณธรรมจริยธรรมในการแก้ปัญหาได้
PLO ๔: มีทักษะด้านความสัมพันธ์ระหว่างบุคคล สามารถทำงานเป็นทีม มีความรับผิดชอบต่อตนเองและสังคม
PLO ๕: สามารถใช้เทคโนโลยีสารสนเทศ และสื่อสารนำเสนอได้อย่างมีประสิทธิภาพ`,
      careerProspectsTh: `๑) ปลัดอำเภอ ปลัดองค์กรปกครองส่วนท้องถิ่น
๒) ข้าราชการพลเรือน ทหาร และตำรวจ
๓) พนักงานภาครัฐ รัฐวิสาหกิจ องค์กรอิสระ และเอกชน
๔) ครู อาจารย์ในสถาบันการศึกษาทั้งภาครัฐและเอกชน
๕) นักการเมือง นักวิชาการ นักปกครอง`,
      isActive: true,
      sortOrder: 1,
    },
    create: {
      tenantId: tenant.id,
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
      objectivesTh: `๑. เพื่อผลิตบัณฑิตให้มีความรู้ความเข้าใจในหลักวิชาการ ทฤษฎี และทักษะปฏิบัติทางรัฐประศาสนศาสตร์ บูรณาการกับหลักพุทธธรรม
๒. เพื่อผลิตบัณฑิตให้มีทักษะในการวิเคราะห์สถานการณ์ทางรัฐประศาสนศาสตร์ การพัฒนานวัตกรรมทางการบริหารเพื่อแก้ปัญหาสังคม มีความสามารถในการใช้เทคโนโลยีสารสนเทศและการสื่อสาร
๓. เพื่อผลิตบัณฑิตให้มีคุณธรรมจริยธรรม มีความรับผิดชอบและมีจิตสาธารณะ สามารถประยุกต์ใช้คุณธรรมจริยธรรมในการแก้ปัญหาตนเองและสังคม`,
      ploTh: `PLO ๑: สามารถอธิบายหลักการ แนวคิดทฤษฎีทางรัฐประศาสนศาสตร์และหลักพุทธธรรมได้
PLO ๒: สามารถวิเคราะห์และประยุกต์ใช้องค์ความรู้ทางรัฐประศาสนศาสตร์ได้
PLO ๓: มีคุณธรรมจริยธรรมและมีจิตสาธารณะ สามารถประยุกต์ใช้คุณธรรมจริยธรรมในการแก้ปัญหาได้
PLO ๔: มีทักษะด้านความสัมพันธ์ระหว่างบุคคล สามารถทำงานเป็นทีม มีความรับผิดชอบต่อตนเองและสังคม
PLO ๕: สามารถใช้เทคโนโลยีสารสนเทศ และสื่อสารนำเสนอได้อย่างมีประสิทธิภาพ`,
      careerProspectsTh: `๑) ปลัดอำเภอ ปลัดองค์กรปกครองส่วนท้องถิ่น
๒) ข้าราชการพลเรือน ทหาร และตำรวจ
๓) พนักงานภาครัฐ รัฐวิสาหกิจ องค์กรอิสระ และเอกชน
๔) ครู อาจารย์ในสถาบันการศึกษาทั้งภาครัฐและเอกชน
๕) นักการเมือง นักวิชาการ นักปกครอง`,
      isActive: true,
      sortOrder: 1,
    },
  });

  console.log(`Curriculum: ${curriculum.nameTh} (${curriculum.code})`);

  // 4. Clean old plans for this curriculum to ensure fresh study plan
  await prisma.curriculumPlan.deleteMany({
    where: { curriculumId: curriculum.id },
  });

  // 5. Insert Study Plan (แผนการศึกษา 4 ปี 8 ภาคการศึกษา รวม 132 หน่วยกิต)
  const plans = [
    // Year 1 Semester 1 (18 credits)
    { academicYear: 1, semester: 1, courseCode: "000 101", courseNameTh: "มนุษย์กับสังคม", courseNameEn: "Man and Society", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 1 },
    { academicYear: 1, semester: 1, courseCode: "000 102", courseNameTh: "กฎหมายทั่วไป", courseNameEn: "General Law", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 2 },
    { academicYear: 1, semester: 1, courseCode: "000 134", courseNameTh: "วรรณกรรมพระพุทธศาสนา", courseNameEn: "Buddhist Literature", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 3 },
    { academicYear: 1, semester: 1, courseCode: "000 135", courseNameTh: "พระไตรปิฎกศึกษา", courseNameEn: "Tipitaka Studies", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 4 },
    { academicYear: 1, semester: 1, courseCode: "000 137", courseNameTh: "ประวัติพระพุทธศาสนา", courseNameEn: "History of Buddhism", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 5 },
    { academicYear: 1, semester: 1, courseCode: "401 101", courseNameTh: "ความรู้เบื้องต้นทางรัฐศาสตร์", courseNameEn: "Introduction to Political Science", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 6 },

    // Year 1 Semester 2 (21 credits)
    { academicYear: 1, semester: 2, courseCode: "000 205", courseNameTh: "ปรัชญาเบื้องต้น", courseNameEn: "Introduction to Philosophy", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 1 },
    { academicYear: 1, semester: 2, courseCode: "000 107", courseNameTh: "ความรู้เบื้องต้นเกี่ยวกับการเมืองการปกครอง", courseNameEn: "Introduction to Politics and Government", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาเลือก)", sortOrder: 2 },
    { academicYear: 1, semester: 2, courseCode: "000 136", courseNameTh: "ภาษาบาลี", courseNameEn: "Pali", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 3 },
    { academicYear: 1, semester: 2, courseCode: "000 140", courseNameTh: "กรรมฐาน ๑", courseNameEn: "Buddhist Meditation I", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 4 },
    { academicYear: 1, semester: 2, courseCode: "402 101", courseNameTh: "ความรู้เบื้องต้นทางรัฐประศาสนศาสตร์", courseNameEn: "Principle of Public Administration", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 5 },
    { academicYear: 1, semester: 2, courseCode: "402 102", courseNameTh: "ทฤษฎีทางรัฐประศาสนศาสตร์", courseNameEn: "Public Administration Theory", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 6 },
    { academicYear: 1, semester: 2, courseCode: "402 103", courseNameTh: "องค์การและการจัดการ", courseNameEn: "Organizational and Public Administration", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 7 },

    // Year 2 Semester 1 (18 credits)
    { academicYear: 2, semester: 1, courseCode: "000 103", courseNameTh: "คอมพิวเตอร์และเทคโนโลยีดิจิทัล", courseNameEn: "Computer and Digital Technology", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 1 },
    { academicYear: 2, semester: 1, courseCode: "000 204", courseNameTh: "ภาษาอังกฤษเพื่อการสื่อสาร", courseNameEn: "English for Communications", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 2 },
    { academicYear: 2, semester: 1, courseCode: "000 108", courseNameTh: "เศรษฐศาสตร์เบื้องต้น", courseNameEn: "Introduction to Economics", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาเลือก)", sortOrder: 3 },
    { academicYear: 2, semester: 1, courseCode: "000 238", courseNameTh: "เทศกาลและพิธีกรรมพระพุทธศาสนา", courseNameEn: "Buddhist Festival and Traditions", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 4 },
    { academicYear: 2, semester: 1, courseCode: "402 204", courseNameTh: "นโยบายสาธารณะและการวางแผน", courseNameEn: "Public Policy and Plan", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 5 },
    { academicYear: 2, semester: 1, courseCode: "402 205", courseNameTh: "พฤติกรรมองค์การ", courseNameEn: "Organizational Behaviors", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 6 },

    // Year 2 Semester 2 (18 credits)
    { academicYear: 2, semester: 2, courseCode: "000 206", courseNameTh: "คณิตศาสตร์และสถิติเพื่อการวิจัย", courseNameEn: "Mathematics and Statistics for Research", credits: 3, courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)", sortOrder: 1 },
    { academicYear: 2, semester: 2, courseCode: "000 239", courseNameTh: "ธรรมะภาคภาษาอังกฤษ", courseNameEn: "Dhamma in English", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 2 },
    { academicYear: 2, semester: 2, courseCode: "000 241", courseNameTh: "กรรมฐาน ๒", courseNameEn: "Buddhist Meditation II", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 3 },
    { academicYear: 2, semester: 2, courseCode: "402 206", courseNameTh: "การบริหารทรัพยากรมนุษย์", courseNameEn: "Human Resource Management", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 4 },
    { academicYear: 2, semester: 2, courseCode: "402 307", courseNameTh: "การบริหารงบประมาณและการคลังสาธารณะ", courseNameEn: "Public Budgeting and Fiscal Administration", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 5 },
    { academicYear: 2, semester: 2, courseCode: "402 212", courseNameTh: "นวัตกรรมการบริหารสมัยใหม่", courseNameEn: "Innovation in modern management", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 6 },

    // Year 3 Semester 1 (18 credits)
    { academicYear: 3, semester: 1, courseCode: "000 342", courseNameTh: "กรรมฐาน ๓", courseNameEn: "Buddhist Meditation III", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 1 },
    { academicYear: 3, semester: 1, courseCode: "402 308", courseNameTh: "การบริหารการพัฒนาและการบริหารโครงการ", courseNameEn: "Development Management and Project Management", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 2 },
    { academicYear: 3, semester: 1, courseCode: "402 309", courseNameTh: "เทคนิคและเครื่องมือการบริหารทางรัฐประศาสนศาสตร์", courseNameEn: "Technique and tools in Public Administration", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 3 },
    { academicYear: 3, semester: 1, courseCode: "402 311", courseNameTh: "การบริหารการคลังส่วนท้องถิ่น", courseNameEn: "Local Fiscal Management", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 4 },
    { academicYear: 3, semester: 1, courseCode: "402 314", courseNameTh: "กฎหมายอาญา ๑", courseNameEn: "Criminal Law I", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 5 },
    { academicYear: 3, semester: 1, courseCode: "402 315", courseNameTh: "กฎหมายวิธีพิจารณาความอาญา", courseNameEn: "Criminal Procedure Code", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 6 },

    // Year 3 Semester 2 (18 credits)
    { academicYear: 3, semester: 2, courseCode: "000 443", courseNameTh: "กรรมฐาน ๔", courseNameEn: "Buddhist Meditation IV", credits: 3, courseType: "หมวดวิชาเฉพาะด้าน (วิชากลุ่มพระพุทธศาสนา)", sortOrder: 1 },
    { academicYear: 3, semester: 2, courseCode: "402 310", courseNameTh: "การบริหารเชิงกลยุทธ์", courseNameEn: "Strategic Management", credits: 3, courseType: "หมวดวิชาแกนรัฐประศาสนศาสตร์", sortOrder: 2 },
    { academicYear: 3, semester: 2, courseCode: "402 316", courseNameTh: "ระเบียบวิธีวิจัยทางรัฐประศาสนศาสตร์", courseNameEn: "Research Methodology for Public Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 3 },
    { academicYear: 3, semester: 2, courseCode: "402 317", courseNameTh: "ภาษาอังกฤษสำหรับรัฐประศาสนศาสตร์", courseNameEn: "English for Public Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 4 },
    { academicYear: 3, semester: 2, courseCode: "402 318", courseNameTh: "การศึกษาอิสระทางรัฐประศาสนศาสตร์", courseNameEn: "Independent Study on Public Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 5 },
    { academicYear: 3, semester: 2, courseCode: "402 321", courseNameTh: "กฎหมายลักษณะพยาน", courseNameEn: "Law of Evidence", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 6 },

    // Year 4 Semester 1 (12 credits)
    { academicYear: 4, semester: 1, courseCode: "402 419", courseNameTh: "สัมมนาทางรัฐประศาสนศาสตร์เชิงพุทธ", courseNameEn: "Seminar in Public Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 1 },
    { academicYear: 4, semester: 1, courseCode: "402 420", courseNameTh: "กฎหมายปกครอง", courseNameEn: "Administrative Law", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 2 },
    { academicYear: 4, semester: 1, courseCode: "FREE 001", courseNameTh: "วิชาเลือกเสรี ๑ (เช่น การจัดการความขัดแย้ง)", courseNameEn: "Free Elective I (e.g. Conflict Management)", credits: 3, courseType: "หมวดวิชาเลือกเสรี", sortOrder: 3 },
    { academicYear: 4, semester: 1, courseCode: "FREE 002", courseNameTh: "วิชาเลือกเสรี ๒ (เช่น การพัฒนาเศรษฐกิจชุมชนอย่างยั่งยืน)", courseNameEn: "Free Elective II (e.g. Sustainable Community Development)", credits: 3, courseType: "หมวดวิชาเลือกเสรี", sortOrder: 4 },

    // Year 4 Semester 2 (9 credits)
    { academicYear: 4, semester: 2, courseCode: "402 413", courseNameTh: "พุทธจริยธรรมทางการบริหาร", courseNameEn: "Buddhist Ethics in Administration", credits: 3, courseType: "หมวดวิชาเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 1 },
    { academicYear: 4, semester: 2, courseCode: "402 441", courseNameTh: "การฝึกประสบการณ์ทางรัฐประศาสนศาสตร์", courseNameEn: "Practice Experience in Public Administration", credits: 3, courseType: "หมวดวิชาเลือกเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 2 },
    { academicYear: 4, semester: 2, courseCode: "402 428", courseNameTh: "ดิจิตอลเพื่อการบริหารงานภาครัฐ", courseNameEn: "Digital for Public Administration", credits: 3, courseType: "หมวดวิชาเลือกเฉพาะสาขาวิชารัฐประศาสนศาสตร์", sortOrder: 3 },
  ];

  await prisma.curriculumPlan.createMany({
    data: plans.map((p) => ({
      ...p,
      curriculumId: curriculum.id,
    })),
  });

  const totalAddedCredits = plans.reduce((sum, p) => sum + p.credits, 0);
  console.log(`Successfully seeded ${plans.length} courses across 8 semesters, total ${totalAddedCredits} credits!`);
}

main()
  .catch((e) => {
    console.error("Error seeding TQF:2 curriculum:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
