"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, GraduationCap, BookOpen, AlertCircle, CheckCircle2, XCircle, FileCode, Upload, Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { DataTable, StatusPill, LiyonDialog, LiyonDialogHeader, LiyonDialogBody, LiyonDialogFooter, LiyonField, RowMenuItem, type DataTableColumn } from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type { CurriculumDto } from "@/features/curriculum";
import { DegreeLevel } from "@/generated/prisma";
import {
  createCurriculumAction,
  updateCurriculumAction,
  deleteCurriculumAction,
  toggleCurriculumActiveAction,
  getCurriculumsAction,
} from "@/features/curriculum/actions";

interface DepartmentDto {
  id: string;
  nameTh: string;
  nameEn: string;
}

interface Props {
  initialCurriculums: CurriculumDto[];
  departments: DepartmentDto[];
  canWrite: boolean;
  canManage: boolean;
  canDelete: boolean;
}

// Helpers for robust JSON extraction supporting various casings, wrappers, Thai keys, and array formats
function extractJsonField(obj: Record<string, unknown>, aliases: string[]): unknown {
  const norm = (s: string) => s.toLowerCase().replace(/[-_\s]/g, "");
  const normalizedEntries = new Map<string, unknown>();

  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined && val !== null) {
      normalizedEntries.set(norm(key), val);
      normalizedEntries.set(key.toLowerCase(), val);
    }
  }

  for (const alias of aliases) {
    if (obj[alias] !== undefined && obj[alias] !== null) return obj[alias];
    const nKey = norm(alias);
    if (normalizedEntries.has(nKey)) {
      return normalizedEntries.get(nKey);
    }
  }
  return undefined;
}

function formatJsonValue(val: unknown): string {
  if (val === undefined || val === null) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (typeof item === "object" && item !== null) {
          const o = item as Record<string, unknown>;
          const code = o.code || o.id || o.no || o.ploNo || o.ploCode || "";
          const desc = o.desc || o.description || o.name || o.title || o.text || o.detail || "";
          if (code && desc) return `${code}: ${desc}`;
          if (desc) return String(desc);
          if (code) return String(code);
          return JSON.stringify(item);
        }
        return String(item);
      })
      .filter(Boolean)
      .join("\n");
  }
  if (typeof val === "object") {
    return JSON.stringify(val, null, 2);
  }
  return String(val);
}

function normalizeDegreeLevelVal(val: unknown): DegreeLevel | null {
  if (!val) return null;
  const s = String(val).toUpperCase().trim();
  if (s === "BACHELOR" || s.includes("ตรี") || s.includes("UNDERGRAD")) return DegreeLevel.BACHELOR;
  if (s === "MASTER" || s.includes("โท") || s.includes("POSTGRAD") || s.includes("GRADUATE")) return DegreeLevel.MASTER;
  if (s === "DOCTORAL" || s === "DOCTORATE" || s.includes("เอก") || s.includes("PHD")) return DegreeLevel.DOCTORAL;
  if (s === "CERTIFICATE" || s.includes("ประกาศนียบัตร") || s.includes("CERT")) return DegreeLevel.CERTIFICATE;
  return null;
}

export function CurriculumClient({
  initialCurriculums,
  departments,
  canWrite,
  canManage,
  canDelete,
}: Props) {
  const t = useT();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const departmentIdParam = searchParams.get("departmentId");
  const createParam = searchParams.get("create");

  const [items, setItems] = useState<CurriculumDto[]>(initialCurriculums);
  const [isPending, startTransition] = useTransition();

  // Filter states
  const [filterLevel, setFilterLevel] = useState<DegreeLevel | "">("");
  const [filterDepartment, setFilterDepartment] = useState(departmentIdParam ?? "");

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CurriculumDto | null>(null);
  const [deleteItem, setDeleteItem] = useState<CurriculumDto | null>(null);

  // Form states
  const [formCode, setFormCode] = useState("");
  const [formNameTh, setFormNameTh] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formDegreeLevel, setFormDegreeLevel] = useState<DegreeLevel>(DegreeLevel.BACHELOR);
  const [formDepartmentId, setFormDepartmentId] = useState(departments[0]?.id ?? "");
  const [formTotalCredits, setFormTotalCredits] = useState("120");
  const [formCurriculumYear, setFormCurriculumYear] = useState(new Date().getFullYear() + 543 + "");
  const [formStudyPeriodYears, setFormStudyPeriodYears] = useState("4");
  const [formTuitionFee, setFormTuitionFee] = useState("");
  const [formPhilosophyTh, setFormPhilosophyTh] = useState("");
  const [formPhilosophyEn, setFormPhilosophyEn] = useState("");
  const [formCareerProspectsTh, setFormCareerProspectsTh] = useState("");
  const [formCareerProspectsEn, setFormCareerProspectsEn] = useState("");
  const [formDegreeNameTh, setFormDegreeNameTh] = useState("");
  const [formDegreeNameEn, setFormDegreeNameEn] = useState("");
  const [formDegreeAbbrTh, setFormDegreeAbbrTh] = useState("");
  const [formDegreeAbbrEn, setFormDegreeAbbrEn] = useState("");
  const [formObjectivesTh, setFormObjectivesTh] = useState("");
  const [formObjectivesEn, setFormObjectivesEn] = useState("");
  const [formPloTh, setFormPloTh] = useState("");
  const [formPloEn, setFormPloEn] = useState("");

  const openCreateDialog = (defaultDeptId?: string) => {
    setEditingItem(null);
    setFormCode("");
    setFormNameTh("");
    setFormNameEn("");
    setFormDegreeLevel(DegreeLevel.BACHELOR);
    setFormDepartmentId(defaultDeptId || filterDepartment || (departments[0]?.id ?? ""));
    setFormTotalCredits("120");
    setFormCurriculumYear(new Date().getFullYear() + 543 + "");
    setFormStudyPeriodYears("4");
    setFormTuitionFee("");
    setFormPhilosophyTh("");
    setFormPhilosophyEn("");
    setFormCareerProspectsTh("");
    setFormCareerProspectsEn("");
    setFormDegreeNameTh("");
    setFormDegreeNameEn("");
    setFormDegreeAbbrTh("");
    setFormDegreeAbbrEn("");
    setFormObjectivesTh("");
    setFormObjectivesEn("");
    setFormPloTh("");
    setFormPloEn("");
    setModalOpen(true);
  };

  useEffect(() => {
    if (departmentIdParam) {
      setFilterDepartment(departmentIdParam);
    }
    if (createParam === "true") {
      openCreateDialog(departmentIdParam || undefined);
    }
  }, [departmentIdParam, createParam]);

  const openEditDialog = (item: CurriculumDto) => {
    setEditingItem(item);
    setFormCode(item.code);
    setFormNameTh(item.nameTh);
    setFormNameEn(item.nameEn);
    setFormDegreeLevel(item.degreeLevel);
    setFormDepartmentId(item.departmentId);
    setFormTotalCredits(item.totalCredits.toString());
    setFormCurriculumYear(item.curriculumYear.toString());
    setFormStudyPeriodYears(item.studyPeriodYears.toString());
    setFormTuitionFee(item.tuitionFee?.toString() ?? "");
    setFormPhilosophyTh(item.philosophyTh ?? "");
    setFormPhilosophyEn(item.philosophyEn ?? "");
    setFormCareerProspectsTh(item.careerProspectsTh ?? "");
    setFormCareerProspectsEn(item.careerProspectsEn ?? "");
    setFormDegreeNameTh(item.degreeNameTh ?? "");
    setFormDegreeNameEn(item.degreeNameEn ?? "");
    setFormDegreeAbbrTh(item.degreeAbbrTh ?? "");
    setFormDegreeAbbrEn(item.degreeAbbrEn ?? "");
    setFormObjectivesTh(item.objectivesTh ?? "");
    setFormObjectivesEn(item.objectivesEn ?? "");
    setFormPloTh(item.ploTh ?? "");
    setFormPloEn(item.ploEn ?? "");
    setModalOpen(true);
  };

  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const data = {
      code: formCode,
      nameTh: formNameTh,
      nameEn: formNameEn,
      degreeLevel: formDegreeLevel,
      departmentId: formDepartmentId,
      curriculumYear: parseInt(formCurriculumYear) || 2567,
      totalCredits: parseInt(formTotalCredits) || 120,
      studyPeriodYears: parseInt(formStudyPeriodYears) || 4,
      tuitionFee: formTuitionFee ? parseInt(formTuitionFee) : null,
      degreeNameTh: formDegreeNameTh || null,
      degreeNameEn: formDegreeNameEn || null,
      degreeAbbrTh: formDegreeAbbrTh || null,
      degreeAbbrEn: formDegreeAbbrEn || null,
      philosophyTh: formPhilosophyTh || null,
      philosophyEn: formPhilosophyEn || null,
      objectivesTh: formObjectivesTh || null,
      objectivesEn: formObjectivesEn || null,
      ploTh: formPloTh || null,
      ploEn: formPloEn || null,
      careerProspectsTh: formCareerProspectsTh || null,
      careerProspectsEn: formCareerProspectsEn || null,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeCode = (formCode.trim() || "draft").replace(/[^a-zA-Z0-9_\u0E00-\u0E7F-]/g, "_");
    link.href = url;
    link.download = `curriculum-${safeCode}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t("curriculum.json.exportSuccess"));
  };

  const handleExportRowJson = (row: CurriculumDto) => {
    const data = {
      code: row.code,
      nameTh: row.nameTh,
      nameEn: row.nameEn,
      degreeLevel: row.degreeLevel,
      departmentId: row.departmentId,
      departmentNameTh: row.departmentNameTh,
      departmentNameEn: row.departmentNameEn,
      curriculumYear: row.curriculumYear,
      totalCredits: row.totalCredits,
      studyPeriodYears: row.studyPeriodYears,
      tuitionFee: row.tuitionFee,
      degreeNameTh: row.degreeNameTh,
      degreeNameEn: row.degreeNameEn,
      degreeAbbrTh: row.degreeAbbrTh,
      degreeAbbrEn: row.degreeAbbrEn,
      philosophyTh: row.philosophyTh,
      philosophyEn: row.philosophyEn,
      objectivesTh: row.objectivesTh,
      objectivesEn: row.objectivesEn,
      ploTh: row.ploTh,
      ploEn: row.ploEn,
      careerProspectsTh: row.careerProspectsTh,
      careerProspectsEn: row.careerProspectsEn,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeCode = row.code.replace(/[^a-zA-Z0-9_\u0E00-\u0E7F-]/g, "_");
    link.href = url;
    link.download = `curriculum-${safeCode}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t("curriculum.json.exportSuccess"));
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let rawContent = (event.target?.result as string) || "";
        rawContent = rawContent.trim();
        // Strip BOM if present
        if (rawContent.charCodeAt(0) === 0xfeff) {
          rawContent = rawContent.slice(1);
        }
        // Strip markdown code fences e.g. ```json ... ```
        if (rawContent.startsWith("```")) {
          rawContent = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(rawContent);
        } catch {
          toast.error(t("curriculum.json.invalidFile"));
          return;
        }

        // If array, unwrap the first element
        if (Array.isArray(parsed)) {
          parsed = parsed[0];
        }

        if (!parsed || typeof parsed !== "object") {
          toast.error(t("curriculum.json.invalidFile"));
          return;
        }

        let obj = parsed as Record<string, unknown>;

        // Unwrap if nested in a root property
        const wrapperKeys = ["curriculum", "data", "program", "course", "curriculumInfo", "curriculum_info", "item", "result"];
        for (const wk of wrapperKeys) {
          if (obj[wk] && typeof obj[wk] === "object" && !Array.isArray(obj[wk])) {
            obj = obj[wk] as Record<string, unknown>;
            break;
          }
        }

        let updatedCount = 0;

        // 1. Code
        const codeVal = extractJsonField(obj, ["code", "curriculumCode", "curriculum_code", "programCode", "program_code", "courseCode", "id", "รหัส", "รหัสหลักสูตร", "รหัสวิชา"]);
        if (codeVal !== undefined && codeVal !== null) {
          setFormCode(formatJsonValue(codeVal));
          updatedCount++;
        }

        // 2. Name TH
        const nameThVal = extractJsonField(obj, ["nameTh", "name_th", "curriculumNameTh", "curriculum_name_th", "programNameTh", "program_name_th", "titleTh", "title_th", "name", "title", "ชื่อไทย", "ชื่อหลักสูตร", "ชื่อหลักสูตรไทย", "ชื่อหลักสูตรภาษาไทย"]);
        if (nameThVal !== undefined && nameThVal !== null) {
          setFormNameTh(formatJsonValue(nameThVal));
          updatedCount++;
        }

        // 3. Name EN
        const nameEnVal = extractJsonField(obj, ["nameEn", "name_en", "curriculumNameEn", "curriculum_name_en", "programNameEn", "program_name_en", "titleEn", "title_en", "nameEnglish", "englishName", "ชื่ออังกฤษ", "ชื่อหลักสูตรอังกฤษ", "ชื่อหลักสูตรภาษาอังกฤษ", "ชื่อภาษาอังกฤษ"]);
        if (nameEnVal !== undefined && nameEnVal !== null) {
          setFormNameEn(formatJsonValue(nameEnVal));
          updatedCount++;
        }

        // 4. Degree Name TH
        const degreeNameThVal = extractJsonField(obj, ["degreeNameTh", "degree_name_th", "degreeTitleTh", "degree_title_th", "degreeName", "degree_name", "ชื่อปริญญา", "ชื่อปริญญาไทย", "ชื่อปริญญาภาษาไทย", "ชื่อเต็มภาษาไทย"]);
        if (degreeNameThVal !== undefined && degreeNameThVal !== null) {
          setFormDegreeNameTh(formatJsonValue(degreeNameThVal));
          updatedCount++;
        }

        // 5. Degree Name EN
        const degreeNameEnVal = extractJsonField(obj, ["degreeNameEn", "degree_name_en", "degreeTitleEn", "degree_title_en", "degreeNameEnglish", "ชื่อปริญญาอังกฤษ", "ชื่อปริญญาภาษาอังกฤษ", "ชื่อเต็มภาษาอังกฤษ"]);
        if (degreeNameEnVal !== undefined && degreeNameEnVal !== null) {
          setFormDegreeNameEn(formatJsonValue(degreeNameEnVal));
          updatedCount++;
        }

        // 6. Degree Abbr TH
        const degreeAbbrThVal = extractJsonField(obj, ["degreeAbbrTh", "degree_abbr_th", "abbrTh", "abbr_th", "abbreviationTh", "abbreviation_th", "degreeAbbr", "degree_abbr", "ชื่อย่อ", "อักษรย่อ", "ชื่อย่อภาษาไทย", "อักษรย่อภาษาไทย", "ชื่อย่อปริญญาไทย"]);
        if (degreeAbbrThVal !== undefined && degreeAbbrThVal !== null) {
          setFormDegreeAbbrTh(formatJsonValue(degreeAbbrThVal));
          updatedCount++;
        }

        // 7. Degree Abbr EN
        const degreeAbbrEnVal = extractJsonField(obj, ["degreeAbbrEn", "degree_abbr_en", "abbrEn", "abbr_en", "abbreviationEn", "abbreviation_en", "degreeAbbrEnglish", "ชื่อย่อภาษาอังกฤษ", "อักษรย่อภาษาอังกฤษ", "ชื่อย่อปริญญาอังกฤษ"]);
        if (degreeAbbrEnVal !== undefined && degreeAbbrEnVal !== null) {
          setFormDegreeAbbrEn(formatJsonValue(degreeAbbrEnVal));
          updatedCount++;
        }

        // 8. Degree Level
        const levelVal = extractJsonField(obj, ["degreeLevel", "degree_level", "level", "degree", "degreeType", "degree_type", "ระดับ", "ระดับการศึกษา", "ระดับปริญญา"]);
        if (levelVal !== undefined && levelVal !== null) {
          const matchedLevel = normalizeDegreeLevelVal(levelVal);
          if (matchedLevel) {
            setFormDegreeLevel(matchedLevel);
            updatedCount++;
          }
        }

        // 9. Department
        const deptVal = extractJsonField(obj, ["departmentId", "department_id", "deptId", "dept_id", "departmentCode", "department_code", "department", "departmentName", "department_name", "departmentNameTh", "department_name_th", "departmentNameEn", "ภาควิชา", "สาขาวิชา", "สาขา"]);
        if (deptVal !== undefined && deptVal !== null) {
          const rawDeptStr = String(deptVal).trim();
          const matched = departments.find(
            (d) =>
              d.id === rawDeptStr ||
              d.nameTh === rawDeptStr ||
              d.nameEn === rawDeptStr ||
              rawDeptStr.includes(d.nameTh) ||
              d.nameTh.includes(rawDeptStr)
          );
          if (matched) {
            setFormDepartmentId(matched.id);
            updatedCount++;
          }
        }

        // 10. Curriculum Year
        const yearVal = extractJsonField(obj, ["curriculumYear", "curriculum_year", "year", "academicYear", "academic_year", "ปีหลักสูตร", "ปีพศ", "ปีการศึกษา", "พศ", "ปีที่ปรับปรุง", "ปีที่พัฒนา"]);
        if (yearVal !== undefined && yearVal !== null) {
          const rawYearNum = parseInt(String(yearVal).replace(/\D/g, ""), 10);
          if (!isNaN(rawYearNum)) {
            const finalYear = rawYearNum > 1900 && rawYearNum < 2200 ? rawYearNum + 543 : rawYearNum;
            setFormCurriculumYear(String(finalYear));
            updatedCount++;
          }
        }

        // 11. Total Credits
        const creditsVal = extractJsonField(obj, ["totalCredits", "total_credits", "credits", "credit", "totalCredit", "total_credit", "หน่วยกิต", "จำนวนหน่วยกิต", "หน่วยกิตรวม"]);
        if (creditsVal !== undefined && creditsVal !== null) {
          const cNum = parseInt(String(creditsVal).replace(/\D/g, ""), 10);
          if (!isNaN(cNum)) {
            setFormTotalCredits(String(cNum));
            updatedCount++;
          }
        }

        // 12. Study Period Years
        const periodVal = extractJsonField(obj, ["studyPeriodYears", "study_period_years", "studyPeriod", "study_period", "studyYears", "study_years", "periodYears", "period", "duration", "years", "ระยะเวลา", "ระยะเวลาศึกษา", "ระยะเวลาการศึกษา", "จำนวนปี"]);
        if (periodVal !== undefined && periodVal !== null) {
          const pNum = parseInt(String(periodVal).replace(/\D/g, ""), 10);
          if (!isNaN(pNum)) {
            setFormStudyPeriodYears(String(pNum));
            updatedCount++;
          }
        }

        // 13. Tuition Fee
        const feeVal = extractJsonField(obj, ["tuitionFee", "tuition_fee", "fee", "tuition", "feePerSemester", "fee_per_semester", "ค่าธรรมเนียม", "ค่าเทอม", "ค่าเล่าเรียน", "ค่าธรรมเนียมการศึกษา"]);
        if (feeVal !== undefined && feeVal !== null) {
          const fNum = parseInt(String(feeVal).replace(/\D/g, ""), 10);
          setFormTuitionFee(!isNaN(fNum) ? String(fNum) : "");
          updatedCount++;
        }

        // 14. Philosophy TH
        const philThVal = extractJsonField(obj, ["philosophyTh", "philosophy_th", "philosophy", "philosophyThai", "ปรัชญา", "ปรัชญาของหลักสูตร"]);
        if (philThVal !== undefined && philThVal !== null) {
          setFormPhilosophyTh(formatJsonValue(philThVal));
          updatedCount++;
        }

        // 15. Philosophy EN
        const philEnVal = extractJsonField(obj, ["philosophyEn", "philosophy_en", "philosophyEnglish", "englishPhilosophy"]);
        if (philEnVal !== undefined && philEnVal !== null) {
          setFormPhilosophyEn(formatJsonValue(philEnVal));
          updatedCount++;
        }

        // 16. Career Prospects TH
        const careerThVal = extractJsonField(obj, ["careerProspectsTh", "career_prospects_th", "careerProspects", "career_prospects", "careers", "career", "careerTh", "career_th", "careerPaths", "occupations", "อาชีพ", "อาชีพที่ประกอบได้", "อาชีพที่สามารถประกอบได้", "อาชีพหลังสำเร็จการศึกษา", "แนวทางการประกอบอาชีพ"]);
        if (careerThVal !== undefined && careerThVal !== null) {
          setFormCareerProspectsTh(formatJsonValue(careerThVal));
          updatedCount++;
        }

        // 17. Career Prospects EN
        const careerEnVal = extractJsonField(obj, ["careerProspectsEn", "career_prospects_en", "careerEn", "career_en", "careersEn", "careers_en", "careersEnglish"]);
        if (careerEnVal !== undefined && careerEnVal !== null) {
          setFormCareerProspectsEn(formatJsonValue(careerEnVal));
          updatedCount++;
        }

        // 18. Objectives TH
        const objThVal = extractJsonField(obj, ["objectivesTh", "objectives_th", "objectives", "objective", "objectivesThai", "วัตถุประสงค์", "วัตถุประสงค์ของหลักสูตร"]);
        if (objThVal !== undefined && objThVal !== null) {
          setFormObjectivesTh(formatJsonValue(objThVal));
          updatedCount++;
        }

        // 19. Objectives EN
        const objEnVal = extractJsonField(obj, ["objectivesEn", "objectives_en", "objectivesEnglish", "englishObjectives"]);
        if (objEnVal !== undefined && objEnVal !== null) {
          setFormObjectivesEn(formatJsonValue(objEnVal));
          updatedCount++;
        }

        // 20. PLO TH
        const ploThVal = extractJsonField(obj, ["ploTh", "plo_th", "plo", "plos", "ploList", "learningOutcomes", "learning_outcomes", "expectedLearningOutcomes", "ผลลัพธ์การเรียนรู้", "ผลการเรียนรู้", "ผลการเรียนรู้ที่คาดหวัง", "มาตรฐานผลการเรียนรู้", "พลีโอ"]);
        if (ploThVal !== undefined && ploThVal !== null) {
          setFormPloTh(formatJsonValue(ploThVal));
          updatedCount++;
        }

        // 21. PLO EN
        const ploEnVal = extractJsonField(obj, ["ploEn", "plo_en", "ploEnglish", "plosEnglish", "learningOutcomesEn", "expectedLearningOutcomesEn"]);
        if (ploEnVal !== undefined && ploEnVal !== null) {
          setFormPloEn(formatJsonValue(ploEnVal));
          updatedCount++;
        }

        if (updatedCount === 0) {
          toast.error("ไม่พบข้อมูลฟิลด์หลักสูตรที่ตรงกันในไฟล์ JSON (กรุณาตรวจสอบโครงสร้างไฟล์)");
        } else {
          toast.success(`${t("curriculum.json.importSuccess")} (${updatedCount} รายการ)`);
        }
      } catch (err) {
        console.error("Failed to parse JSON file", err);
        toast.error(t("curriculum.json.invalidFile"));
      } finally {
        if (jsonFileInputRef.current) {
          jsonFileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!formCode.trim() || !formNameTh.trim() || !formNameEn.trim() || !formDepartmentId) {
      toast.error(t("common.required"));
      return;
    }

    startTransition(async () => {
      const payload = {
        code: formCode.trim(),
        nameTh: formNameTh.trim(),
        nameEn: formNameEn.trim(),
        degreeLevel: formDegreeLevel,
        departmentId: formDepartmentId,
        totalCredits: parseInt(formTotalCredits) || 120,
        curriculumYear: parseInt(formCurriculumYear) || (new Date().getFullYear() + 543),
        studyPeriodYears: parseInt(formStudyPeriodYears) || 4,
        tuitionFee: formTuitionFee ? parseInt(formTuitionFee) : null,
        philosophyTh: formPhilosophyTh.trim() || null,
        philosophyEn: formPhilosophyEn.trim() || null,
        careerProspectsTh: formCareerProspectsTh.trim() || null,
        careerProspectsEn: formCareerProspectsEn.trim() || null,
        degreeNameTh: formDegreeNameTh.trim() || null,
        degreeNameEn: formDegreeNameEn.trim() || null,
        degreeAbbrTh: formDegreeAbbrTh.trim() || null,
        degreeAbbrEn: formDegreeAbbrEn.trim() || null,
        objectivesTh: formObjectivesTh.trim() || null,
        objectivesEn: formObjectivesEn.trim() || null,
        ploTh: formPloTh.trim() || null,
        ploEn: formPloEn.trim() || null,
        isActive: true,
        sortOrder: 0,
      };

      if (editingItem) {
        const res = await updateCurriculumAction({ ...payload, id: editingItem.id, isActive: editingItem.isActive, sortOrder: editingItem.sortOrder });
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          refreshList();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      } else {
        const res = await createCurriculumAction(payload);
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          refreshList();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      }
    });
  };

  const handleToggleActive = (id: string, _current?: boolean) => {
    startTransition(async () => {
      const res = await toggleCurriculumActiveAction(id);
      if (res.ok) {
        toast.success(t("common.saved"));
        refreshList();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    startTransition(async () => {
      const res = await deleteCurriculumAction(deleteItem.id);
      if (res.ok) {
        toast.success(t("common.deleted"));
        setDeleteItem(null);
        refreshList();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const refreshList = async () => {
    const res = await getCurriculumsAction({
      degreeLevel: filterLevel || undefined,
      departmentId: filterDepartment || undefined,
    });
    if (res.ok) {
      setItems(res.data);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterLevel && item.degreeLevel !== filterLevel) return false;
    if (filterDepartment && item.departmentId !== filterDepartment) return false;
    return true;
  });

  const columns: DataTableColumn<CurriculumDto>[] = [
    {
      key: "code",
      header: t("curriculum.code"),
      render: (row) => (
        <span className="font-mono text-sm font-medium">{row.code}</span>
      ),
      sortable: true,
    },
    {
      key: "name",
      header: t("curriculum.nameTh"),
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{locale === "th" ? row.nameTh : row.nameEn}</span>
          <span className="text-xs text-muted-foreground">{locale === "th" ? row.nameEn : row.nameTh}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "degreeLevel",
      header: t("curriculum.degreeLevel"),
      render: (row) => (
        <span className="text-xs">
          {t(`curriculum.level.${row.degreeLevel}`)}
        </span>
      ),
      sortable: true,
    },
    {
      key: "department",
      header: t("curriculum.department"),
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {locale === "th" ? row.departmentNameTh : row.departmentNameEn}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: t("curriculum.status"),
      render: (row) => (
        <StatusPill tone={row.isActive ? "ok" : "off"}>
          {row.isActive ? t("curriculum.status.active") : t("curriculum.status.inactive")}
        </StatusPill>
      ),
      sortable: true,
    },
    {
      key: "plan",
      header: t("curriculum.plan.title"),
      render: (row) => (
        <Link href={`/curriculum/${row.id}/plan`} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
          <BookOpen className="h-3.5 w-3.5" />
          {t("curriculum.plan.manageBtn")}
        </Link>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <header className="ph hr flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{t("curriculum.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("curriculum.subtitle")}</p>
        </div>
        {canWrite && (
          <div className="acts ml-auto">
            <Button onClick={() => openCreateDialog()} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("curriculum.create")}
            </Button>
          </div>
        )}
      </header>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value as DegreeLevel | "")}
          className="h-9 px-3 rounded-md border text-xs bg-background"
        >
          <option value="">{t("curriculum.allLevels")}</option>
          <option value="BACHELOR">{t("curriculum.level.BACHELOR")}</option>
          <option value="MASTER">{t("curriculum.level.MASTER")}</option>
          <option value="DOCTORAL">{t("curriculum.level.DOCTORAL")}</option>
          <option value="CERTIFICATE">{t("curriculum.level.CERTIFICATE")}</option>
        </select>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="h-9 px-3 rounded-md border text-xs bg-background"
        >
          <option value="">{t("curriculum.department")} (ทั้งหมด)</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {locale === "th" ? d.nameTh : d.nameEn}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        state={filteredItems.length === 0 ? "empty" : "data"}
        columns={columns}
        rows={filteredItems}
        getRowId={(item) => item.id}
        headHeading={t("curriculum.title")}
        empty={{
          icon: <GraduationCap className="h-8 w-8" />,
          title: t("common.noData"),
        }}
        error={{
          icon: <AlertCircle className="h-8 w-8" />,
          title: t("common.error"),
        }}
        renderRowMenu={(row) => (
          <>
            {canManage && (
              <RowMenuItem
                icon={<BookOpen className="h-4 w-4" />}
                onSelect={() => window.location.assign(`/curriculum/${row.id}/plan`)}
              >
                {t("curriculum.plan.manageBtn")}
              </RowMenuItem>
            )}
            {canWrite && (
              <RowMenuItem
                icon={<Pencil className="h-4 w-4" />}
                onSelect={() => openEditDialog(row)}
              >
                {t("curriculum.edit")}
              </RowMenuItem>
            )}
            <RowMenuItem
              icon={<FileDown className="h-4 w-4 text-indigo-500" />}
              onSelect={() => handleExportRowJson(row)}
            >
              {t("curriculum.json.export")}
            </RowMenuItem>
            {canWrite && (
              <RowMenuItem
                icon={row.isActive ? <XCircle className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                onSelect={() => handleToggleActive(row.id, row.isActive)}
              >
                {row.isActive ? t("curriculum.status.inactive") : t("curriculum.status.active")}
              </RowMenuItem>
            )}
            {canDelete && (
              <RowMenuItem
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onSelect={() => setDeleteItem(row)}
              >
                {t("curriculum.delete")}
              </RowMenuItem>
            )}
          </>
        )}
      />

      {/* Add / Edit Dialog */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen} wide>
        <LiyonDialogHeader
          title={editingItem ? t("curriculum.edit") : t("curriculum.create")}
          description={t("curriculum.subtitle")}
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* JSON Import/Export Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-muted/40 rounded-lg border border-border/60 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <FileCode className="h-4 w-4 text-primary" />
              <span>{t("curriculum.json.title")}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={jsonFileInputRef}
                type="file"
                accept=".json,application/json,text/plain"
                className="hidden"
                onClick={(e) => {
                  (e.currentTarget as HTMLInputElement).value = "";
                }}
                onChange={handleImportJson}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => jsonFileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5 text-blue-500" />
                {t("curriculum.json.import")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={handleExportJson}
              >
                <Download className="h-3.5 w-3.5 text-emerald-500" />
                {t("curriculum.json.export")}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LiyonField label={t("curriculum.code")}>
              <input
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="ex. 25650123456789"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("curriculum.department")} *
              </label>
              <select
                value={formDepartmentId}
                onChange={(e) => setFormDepartmentId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {locale === "th" ? d.nameTh : d.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LiyonField label={t("curriculum.nameTh")}>
              <input
                value={formNameTh}
                onChange={(e) => setFormNameTh(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("curriculum.nameEn")}>
              <input
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LiyonField label={t("curriculum.degreeNameTh")}>
              <input
                value={formDegreeNameTh}
                onChange={(e) => setFormDegreeNameTh(e.target.value)}
                placeholder="ex. รัฐประศาสนศาสตรบัณฑิต (รัฐประศาสนศาสตร์)"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("curriculum.degreeNameEn")}>
              <input
                value={formDegreeNameEn}
                onChange={(e) => setFormDegreeNameEn(e.target.value)}
                placeholder="ex. Bachelor of Public Administration (Public Administration)"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LiyonField label={t("curriculum.degreeAbbrTh")}>
              <input
                value={formDegreeAbbrTh}
                onChange={(e) => setFormDegreeAbbrTh(e.target.value)}
                placeholder="ex. รป.บ. (รัฐประศาสนศาสตร์)"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("curriculum.degreeAbbrEn")}>
              <input
                value={formDegreeAbbrEn}
                onChange={(e) => setFormDegreeAbbrEn(e.target.value)}
                placeholder="ex. B.P.A. (Public Administration)"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("curriculum.degreeLevel")} *
              </label>
              <select
                value={formDegreeLevel}
                onChange={(e) => setFormDegreeLevel(e.target.value as DegreeLevel)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                <option value="BACHELOR">{t("curriculum.level.BACHELOR")}</option>
                <option value="MASTER">{t("curriculum.level.MASTER")}</option>
                <option value="DOCTORAL">{t("curriculum.level.DOCTORAL")}</option>
                <option value="CERTIFICATE">{t("curriculum.level.CERTIFICATE")}</option>
              </select>
            </div>
            <LiyonField label={t("curriculum.year")}>
              <input
                type="number"
                value={formCurriculumYear}
                onChange={(e) => setFormCurriculumYear(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("curriculum.totalCredits")}>
              <input
                type="number"
                value={formTotalCredits}
                onChange={(e) => setFormTotalCredits(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <LiyonField label={t("curriculum.studyPeriod")}>
              <input
                type="number"
                value={formStudyPeriodYears}
                onChange={(e) => setFormStudyPeriodYears(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("curriculum.tuitionFee")}>
              <input
                type="number"
                value={formTuitionFee}
                onChange={(e) => setFormTuitionFee(e.target.value)}
                placeholder="เว้นว่างได้"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("curriculum.philosophyTh")}
              </label>
              <textarea
                value={formPhilosophyTh}
                onChange={(e) => setFormPhilosophyTh(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-md border text-xs bg-background"
              />
            </div>
             <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("curriculum.careerProspectsTh")}
              </label>
              <textarea
                value={formCareerProspectsTh}
                onChange={(e) => setFormCareerProspectsTh(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-md border text-xs bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("curriculum.objectivesTh")}
              </label>
              <textarea
                value={formObjectivesTh}
                onChange={(e) => setFormObjectivesTh(e.target.value)}
                rows={3}
                placeholder="วัตถุประสงค์ของหลักสูตร..."
                className="w-full p-2.5 rounded-md border text-xs bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("curriculum.ploTh")}
              </label>
              <textarea
                value={formPloTh}
                onChange={(e) => setFormPloTh(e.target.value)}
                rows={3}
                placeholder="ผลลัพธ์การเรียนรู้ที่คาดหวัง (PLOs)..."
                className="w-full p-2.5 rounded-md border text-xs bg-background"
              />
            </div>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Confirmation Dialog */}
      <LiyonDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)} danger>
        <LiyonDialogHeader
          title={t("curriculum.delete")}
          description={t("curriculum.deleteConfirm")}
        />
        <LiyonDialogBody>
          {deleteItem && (
            <div className="p-3 bg-muted rounded text-sm font-medium">
              {locale === "th" ? deleteItem.nameTh : deleteItem.nameEn}
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteItem(null)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {t("common.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
