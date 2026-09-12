import { PrismaClient, DegreeLevel } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const curriculumId = "acaa3f2a-bcdb-474b-a9e0-9f07c8ebd338";

  console.log("Updating curriculum:", curriculumId);

  // 1. Update Curriculum details from มคอ. 2
  const updated = await prisma.curriculum.update({
    where: { id: curriculumId },
    data: {
      code: "2567-BM",
      nameTh: "หลักสูตรพุทธศาสตรบัณฑิต สาขาวิชาการจัดการเชิงพุทธ (หลักสูตรใหม่ พ.ศ. ๒๕๖๗)",
      nameEn: "Bachelor of Arts Program in Buddhist Management",
      degreeNameTh: "พุทธศาสตรบัณฑิต (การจัดการเชิงพุทธ)",
      degreeNameEn: "Bachelor of Arts (Buddhist Management)",
      degreeAbbrTh: "พธ.บ. (การจัดการเชิงพุทธ)",
      degreeAbbrEn: "B.A. (Buddhist Management)",
      degreeLevel: DegreeLevel.BACHELOR,
      curriculumYear: 2567,
      totalCredits: 132,
      studyPeriodYears: 4,
      tuitionFee: 8000,
      philosophyTh:
        "หลักสูตรพุทธศาสตรบัณฑิต สาขาวิชาการจัดการเชิงพุทธ มีความมุ่งมั่นในการผลิตบัณฑิตที่มีคุณลักษณะเชิงพุทธ มีความรู้ ความเข้าใจ และความสามารถด้านการจัดการตามหลักพุทธธรรมและทฤษฎีการจัดการสมัยใหม่อย่างมีประสิทธิภาพ บนพื้นฐานของแนวคิดที่ว่า “การบรรจบกันของศาสตร์การจัดการตะวันตกกับหลักธรรมทางพระพุทธศาสนา” พร้อมทั้งส่งเสริมให้สามารถประยุกต์ใช้ในการบริหารจัดการกิจการพระพุทธศาสนา เพื่อแก้ปัญหาและพัฒนาสังคม เพื่อเพิ่มพูนความรู้ ควบคู่คุณธรรม มีภาวะผู้นำ ตระหนักในอุดมการณ์ และการเสียสละ พัฒนาท้องถิ่น คณะสงฆ์ ชุมชน สังคม และประเทศ",
      philosophyEn:
        "The Bachelor of Arts Program in Buddhist Management is committed to developing graduates endowed with Buddhist values, profound knowledge, and management competence based on modern management theories integrated with Buddhist principles, under the vision of the convergence between Western management sciences and Buddhist Dhamma.",
      objectivesTh:
        "๑. เพื่อผลิตบัณฑิตให้มีความรู้ความเข้าใจในหลักการจัดการตามหลักพุทธศาสนาและวิทยาการสมัยใหม่ สามารถประยุกต์ใช้ในการบริหารจัดการพระพุทธศาสนาได้อย่างมีประสิทธิภาพ\n" +
        "๒. เพื่อผลิตบัณฑิตให้สามารถวิเคราะห์สังเคราะห์ความรู้และพัฒนาทักษะเพื่อการแก้ปัญหาของคณะสงฆ์และสังคม\n" +
        "๓. เพื่อผลิตบัณฑิตให้มีคุณธรรมจริยธรรม มีศรัทธาในพระพุทธศาสนา มีความเสียสละ เคารพศักดิ์ศรีความเป็นมนุษย์ และเป็นแบบอย่างที่ดีของสังคมชาติและศาสนา\n" +
        "๔. เพื่อผลิตบัณฑิตให้มีลักษณะบุคคลในการทำงานเป็นทีม ยอมรับความแตกต่าง รับผิดชอบต่อตนเองและสังคม มีความสามารถในการสื่อสารได้อย่างทันสมัย",
      objectivesEn:
        "1. To produce graduates with comprehensive knowledge and understanding of Buddhist principles and modern management sciences, capable of managing religious and public affairs effectively.\n" +
        "2. To cultivate graduates who can analyze, synthesize, and resolve complex issues within Sangha communities and broader society.\n" +
        "3. To nurture ethical leadership, profound faith in Buddhism, dedication, and mutual respect.\n" +
        "4. To foster teamwork, social responsibility, intercultural adaptability, and effective contemporary communication skills.",
      ploTh:
        "PLO 1 (ด้านความรู้): สามารถนำความรู้หลักการทั้งทฤษฎีและเนื้อหามาปรับใช้บูรณาการหลักพุทธธรรมเพื่อพัฒนาตนเอง คณะสงฆ์ องค์กร ชุมชน และสังคมประเทศชาติ\n" +
        "PLO 2 (ด้านทักษะ): สามารถวิเคราะห์และสังเคราะห์สื่อสารทางวิชาการในการทำงานทางด้านการบริหารจัดการที่เกี่ยวข้อง ด้วยเทคโนโลยีและเลือกเทคโนโลยีสารสนเทศเพื่อการสื่อสารได้อย่างเหมาะสม\n" +
        "PLO 3 (ด้านจริยธรรม): มีการพัฒนานิสัยเห็นคุณค่าในการจัดการพระพุทธศาสนาและศิลปวัฒนธรรมภูมิปัญญาท้องถิ่น ต่อพฤติกรรมทางศีลธรรมและศรัทธาอุทิศตนเพื่อพระพุทธศาสนา\n" +
        "PLO 4 (ด้านจริยธรรม): ประพฤติตนเป็นแบบอย่างที่ดีต่อสังคม ชาติ ศาสนา พระมหากษัตริย์\n" +
        "PLO 5 (ด้านลักษณะบุคคล): มีความรับผิดชอบในการพัฒนาตนเอง การทำงานเป็นทีม มีมนุษยสัมพันธ์ที่ดี และยอมรับความคิดที่มีความแตกต่างระหว่างบุคคล\n" +
        "PLO 6 (ด้านลักษณะบุคคล): มีบุคลิกลักษณะนิสัยในการเป็นผู้นำ และผู้ตามร่วมถึงมีความรับผิดชอบต่อตนเองและผู้อื่น",
      ploEn:
        "PLO 1 (Knowledge): Ability to integrate theoretical management principles and Buddhist teachings to develop oneself, Sangha affairs, organizations, and society.\n" +
        "PLO 2 (Skills): Analytical, synthesis, and communicative competence in management fields utilizing suitable information technologies.\n" +
        "PLO 3 (Ethics): Habitual appreciation and preservation of Buddhist values, arts, culture, and local wisdom through moral conduct.\n" +
        "PLO 4 (Ethics): Exemplary moral character adhering to national, religious, and monarchical principles.\n" +
        "PLO 5 (Personal Attributes): Dedication to continuous self-improvement, teamwork, positive human relations, and embracing diverse perspectives.\n" +
        "PLO 6 (Personal Attributes): Demonstrated leadership and follower qualities with high personal and societal accountability.",
      careerProspectsTh:
        "๑. ข้าราชการในสังกัด ก.พ. และหน่วยงานภาครัฐ\n" +
        "๒. ข้าราชการและพนักงานในองค์กรปกครองส่วนท้องถิ่น (อปท.)\n" +
        "๓. พนักงานในภาคเอกชน รัฐวิสาหกิจ และวิสาหกิจเพื่อสังคม\n" +
        "๔. นักวิชาการ นักวิจัย และอาจารย์ในสถาบันการศึกษาทั้งภาครัฐและเอกชน\n" +
        "๕. ผู้บริหารจัดการกิจการคณะสงฆ์ องค์กรทางศาสนา และมูลนิธิการกุศล",
      careerProspectsEn:
        "1. Civil servants in the Office of the Civil Service Commission and government ministries\n" +
        "2. Officers and personnel in Local Administrative Organizations (PAO, Municipality, SAO)\n" +
        "3. Corporate officers, enterprise management personnel, and social enterprise staff\n" +
        "4. Academics, educational researchers, and lecturers in public and private institutions\n" +
        "5. Administrators and project coordinators for Sangha institutions and non-profit organizations",
    },
  });

  console.log("Updated Curriculum:", updated.nameTh);

  // 2. Clear old dummy plans
  await prisma.curriculumPlan.deleteMany({
    where: { curriculumId },
  });

  // 3. Insert accurate 4-year study plan from มคอ. 2
  const courses = [
    // Year 1 Semester 1 (18 credits)
    {
      academicYear: 1,
      semester: 1,
      courseCode: "000 101",
      courseNameTh: "มนุษย์กับสังคม",
      courseNameEn: "Man and Society",
      credits: 3,
      courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)",
      sortOrder: 1,
    },
    {
      academicYear: 1,
      semester: 1,
      courseCode: "000 102",
      courseNameTh: "กฎหมายทั่วไป",
      courseNameEn: "General Law",
      credits: 3,
      courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)",
      sortOrder: 2,
    },
    {
      academicYear: 1,
      semester: 1,
      courseCode: "000 136",
      courseNameTh: "ภาษาบาลี",
      courseNameEn: "Pali",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 3,
    },
    {
      academicYear: 1,
      semester: 1,
      courseCode: "000 140",
      courseNameTh: "กรรมฐาน ๑",
      courseNameEn: "Buddhist Meditation I",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 4,
    },
    {
      academicYear: 1,
      semester: 1,
      courseCode: "403 212",
      courseNameTh: "หลักการจัดการ",
      courseNameEn: "Principles of Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 5,
    },
    {
      academicYear: 1,
      semester: 1,
      courseCode: "403 213",
      courseNameTh: "ทฤษฎีองค์การและการจัดการ",
      courseNameEn: "Organization Theory and Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 6,
    },

    // Year 1 Semester 2 (18 credits)
    {
      academicYear: 1,
      semester: 2,
      courseCode: "000 204",
      courseNameTh: "ภาษาอังกฤษเพื่อการสื่อสาร",
      courseNameEn: "English for Communications",
      credits: 3,
      courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)",
      sortOrder: 1,
    },
    {
      academicYear: 1,
      semester: 2,
      courseCode: "000 206",
      courseNameTh: "คณิตศาสตร์และสถิติเพื่อการวิจัย",
      courseNameEn: "Mathematics and Statistics for Research",
      credits: 3,
      courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)",
      sortOrder: 2,
    },
    {
      academicYear: 1,
      semester: 2,
      courseCode: "000 134",
      courseNameTh: "วรรณกรรมพระพุทธศาสนา",
      courseNameEn: "Buddhist Literature",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 3,
    },
    {
      academicYear: 1,
      semester: 2,
      courseCode: "000 239",
      courseNameTh: "ธรรมะภาคภาษาอังกฤษ",
      courseNameEn: "Dhamma in English",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 4,
    },
    {
      academicYear: 1,
      semester: 2,
      courseCode: "403 301",
      courseNameTh: "พุทธวิธีการบริหาร",
      courseNameEn: "Buddha's Administration Methods",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 5,
    },
    {
      academicYear: 1,
      semester: 2,
      courseCode: "403 302",
      courseNameTh: "การจัดการทรัพย์สินทางพระพุทธศาสนา",
      courseNameEn: "Management of Buddhist Property",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 6,
    },

    // Year 2 Semester 1 (15 credits)
    {
      academicYear: 2,
      semester: 1,
      courseCode: "000 103",
      courseNameTh: "คอมพิวเตอร์และเทคโนโลยีดิจิทัล",
      courseNameEn: "Computer and Digital Technology",
      credits: 3,
      courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)",
      sortOrder: 1,
    },
    {
      academicYear: 2,
      semester: 1,
      courseCode: "403 424",
      courseNameTh: "หลักการฝึกอบรมและการประชุม",
      courseNameEn: "Principle of Training and Meeting",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเลือกเฉพาะสาขา)",
      sortOrder: 2,
    },
    {
      academicYear: 2,
      semester: 1,
      courseCode: "000 135",
      courseNameTh: "พระไตรปิฎกศึกษา",
      courseNameEn: "Tipitaka Studies",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 3,
    },
    {
      academicYear: 2,
      semester: 1,
      courseCode: "000 241",
      courseNameTh: "กรรมฐาน ๒",
      courseNameEn: "Buddhist Meditation II",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 4,
    },
    {
      academicYear: 2,
      semester: 1,
      courseCode: "403 303",
      courseNameTh: "กฎหมายสำหรับพระสงฆ์",
      courseNameEn: "Related Laws for Sangha",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 5,
    },

    // Year 2 Semester 2 (15 credits)
    {
      academicYear: 2,
      semester: 2,
      courseCode: "000 205",
      courseNameTh: "ปรัชญาเบื้องต้น",
      courseNameEn: "Introduction to Philosophy",
      credits: 3,
      courseType: "หมวดวิชาศึกษาทั่วไป (วิชาบังคับ)",
      sortOrder: 1,
    },
    {
      academicYear: 2,
      semester: 2,
      courseCode: "403 423",
      courseNameTh: "การบริหารจัดการงบประมาณ",
      courseNameEn: "Budgeting Administration",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเลือกเฉพาะสาขา)",
      sortOrder: 2,
    },
    {
      academicYear: 2,
      semester: 2,
      courseCode: "000 237",
      courseNameTh: "ประวัติพระพุทธศาสนา",
      courseNameEn: "History of Buddhism",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 3,
    },
    {
      academicYear: 2,
      semester: 2,
      courseCode: "000 238",
      courseNameTh: "เทศกาลและพิธีกรรมพระพุทธศาสนา",
      courseNameEn: "Buddhist Festival and Traditions",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 4,
    },
    {
      academicYear: 2,
      semester: 2,
      courseCode: "403 304",
      courseNameTh: "การจัดการและพัฒนาสาธารณูปการ",
      courseNameEn: "Monastery Compound Management and Development",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 5,
    },

    // Year 3 Semester 1 (18 credits)
    {
      academicYear: 3,
      semester: 1,
      courseCode: "000 342",
      courseNameTh: "กรรมฐาน ๓",
      courseNameEn: "Buddhist Meditation III",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 1,
    },
    {
      academicYear: 3,
      semester: 1,
      courseCode: "403 305",
      courseNameTh: "การปฏิรูปกิจการพระพุทธศาสนาสมัยใหม่",
      courseNameEn: "Reform on Modern Buddhist Affairs",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 2,
    },
    {
      academicYear: 3,
      semester: 1,
      courseCode: "403 307",
      courseNameTh: "การจัดการการเผยแผ่พระพุทธศาสนายุคใหม่",
      courseNameEn: "Buddhism Dissemination Management in the Modern Era",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 3,
    },
    {
      academicYear: 3,
      semester: 1,
      courseCode: "403 308",
      courseNameTh: "การสังคมสงเคราะห์แนวพุทธยุคการเปลี่ยนแปลง",
      courseNameEn: "Buddhist Social Work in the Changing Era",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 4,
    },
    {
      academicYear: 3,
      semester: 1,
      courseCode: "403 214",
      courseNameTh: "ภาษาอังกฤษสำหรับการจัดการ",
      courseNameEn: "English for Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 5,
    },
    {
      academicYear: 3,
      semester: 1,
      courseCode: "403 316",
      courseNameTh: "การบัญชีเบื้องต้น ๑",
      courseNameEn: "Basic Accounting I",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 6,
    },

    // Year 3 Semester 2 (18 credits)
    {
      academicYear: 3,
      semester: 2,
      courseCode: "403 409",
      courseNameTh: "นวัตกรรมเชิงพุทธเพื่อการพัฒนาองค์กร",
      courseNameEn: "Buddhist Innovation for Organization Development",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 1,
    },
    {
      academicYear: 3,
      semester: 2,
      courseCode: "403 310",
      courseNameTh: "การพัฒนาภาวะผู้นำเชิงพุทธในศตวรรษที่ ๒๑",
      courseNameEn: "Buddhist Leadership Development in the 21st Century",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 2,
    },
    {
      academicYear: 3,
      semester: 2,
      courseCode: "403 411",
      courseNameTh: "การพัฒนาการจัดการศึกษาของคณะสงฆ์",
      courseNameEn: "The Development of Sangkha Educational Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 3,
    },
    {
      academicYear: 3,
      semester: 2,
      courseCode: "403 317",
      courseNameTh: "การบัญชีเบื้องต้น ๒",
      courseNameEn: "Basic Accounting II",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 4,
    },
    {
      academicYear: 3,
      semester: 2,
      courseCode: "403 319",
      courseNameTh: "กฎหมายเพื่อการจัดการ",
      courseNameEn: "Laws on Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 5,
    },
    {
      academicYear: 3,
      semester: 2,
      courseCode: "403 421",
      courseNameTh: "ระบบสารสนเทศเพื่อการจัดการ",
      courseNameEn: "Management Information Systems",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 6,
    },

    // Year 4 Semester 1 (15 credits)
    {
      academicYear: 4,
      semester: 1,
      courseCode: "000 443",
      courseNameTh: "กรรมฐาน ๔",
      courseNameEn: "Buddhist Meditation IV",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชากลุ่มพระพุทธศาสนา)",
      sortOrder: 1,
    },
    {
      academicYear: 4,
      semester: 1,
      courseCode: "403 315",
      courseNameTh: "การวิจัยเพื่อการจัดการ",
      courseNameEn: "Managerial Research",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 2,
    },
    {
      academicYear: 4,
      semester: 1,
      courseCode: "403 420",
      courseNameTh: "การจัดการเชิงกลยุทธ์",
      courseNameEn: "Strategic Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 3,
    },
    {
      academicYear: 4,
      semester: 1,
      courseCode: "403 422",
      courseNameTh: "การจัดการวิถีชุมชนและแหล่งเรียนรู้",
      courseNameEn: "Local Community Ways and Learning Resources Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 4,
    },
    {
      academicYear: 4,
      semester: 1,
      courseCode: "403 425",
      courseNameTh: "การจัดการทรัพยากรมนุษย์แนวพุทธ",
      courseNameEn: "Buddhist Human Resource Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเลือกเฉพาะสาขา)",
      sortOrder: 5,
    },

    // Year 4 Semester 2 (15 credits)
    {
      academicYear: 4,
      semester: 2,
      courseCode: "403 406",
      courseNameTh: "การศึกษาอิสระทางการจัดการเชิงพุทธ",
      courseNameEn: "Independent Study in Buddhist Management",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาแกนการจัดการเชิงพุทธ)",
      sortOrder: 1,
    },
    {
      academicYear: 4,
      semester: 2,
      courseCode: "403 418",
      courseNameTh: "การบัญชีเพื่อการจัดการ",
      courseNameEn: "Managerial Accounting",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเฉพาะด้านการจัดการเชิงพุทธ)",
      sortOrder: 2,
    },
    {
      academicYear: 4,
      semester: 2,
      courseCode: "403 426",
      courseNameTh: "การจัดการตามปรัชญาของเศรษฐกิจพอเพียง",
      courseNameEn: "Management of The Philosophy of Self Sufficient",
      credits: 3,
      courseType: "หมวดวิชาเฉพาะ (วิชาเลือกเฉพาะสาขา)",
      sortOrder: 3,
    },
    {
      academicYear: 4,
      semester: 2,
      courseCode: "FREE 01",
      courseNameTh: "วิชาเลือกเสรี ๑",
      courseNameEn: "Free Elective I",
      credits: 3,
      courseType: "หมวดวิชาเลือกเสรี",
      sortOrder: 4,
    },
    {
      academicYear: 4,
      semester: 2,
      courseCode: "FREE 02",
      courseNameTh: "วิชาเลือกเสรี ๒",
      courseNameEn: "Free Elective II",
      credits: 3,
      courseType: "หมวดวิชาเลือกเสรี",
      sortOrder: 5,
    },
  ];

  for (const course of courses) {
    await prisma.curriculumPlan.create({
      data: {
        curriculumId,
        ...course,
      },
    });
  }

  console.log(`Successfully added ${courses.length} courses across all 4 years.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
