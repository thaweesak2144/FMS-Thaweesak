"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { DataTable, LiyonDialog, LiyonDialogHeader, LiyonDialogBody, LiyonDialogFooter, LiyonField, RowMenuItem, type DataTableColumn } from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type { CurriculumDto, CurriculumPlanDto } from "@/features/curriculum";
import {
  createCurriculumPlanAction,
  updateCurriculumPlanAction,
  deleteCurriculumPlanAction,
  getCurriculumPlansAction,
} from "@/features/curriculum/actions";

interface Props {
  curriculum: CurriculumDto;
  initialPlans: CurriculumPlanDto[];
  canManage: boolean;
}

export function PlanClient({
  curriculum,
  initialPlans,
  canManage,
}: Props) {
  const t = useT();
  const locale = useLocale();
  const [items, setItems] = useState<CurriculumPlanDto[]>(initialPlans);
  const [isPending, startTransition] = useTransition();

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CurriculumPlanDto | null>(null);
  const [deleteItem, setDeleteItem] = useState<CurriculumPlanDto | null>(null);

  // Form states
  const [formYear, setFormYear] = useState("1");
  const [formSemester, setFormSemester] = useState("1");
  const [formCourseCode, setFormCourseCode] = useState("");
  const [formCourseNameTh, setFormCourseNameTh] = useState("");
  const [formCourseNameEn, setFormCourseNameEn] = useState("");
  const [formCredits, setFormCredits] = useState("3");
  const [formCourseType, setFormCourseType] = useState("วิชาบังคับ");

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormYear("1");
    setFormSemester("1");
    setFormCourseCode("");
    setFormCourseNameTh("");
    setFormCourseNameEn("");
    setFormCredits("3");
    setFormCourseType("วิชาบังคับ");
    setModalOpen(true);
  };

  const openEditDialog = (item: CurriculumPlanDto) => {
    setEditingItem(item);
    setFormYear(item.academicYear.toString());
    setFormSemester(item.semester.toString());
    setFormCourseCode(item.courseCode);
    setFormCourseNameTh(item.courseNameTh);
    setFormCourseNameEn(item.courseNameEn);
    setFormCredits(item.credits.toString());
    setFormCourseType(item.courseType);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formCourseCode.trim() || !formCourseNameTh.trim() || !formCourseNameEn.trim() || !formCourseType.trim()) {
      toast.error(t("common.required"));
      return;
    }

    startTransition(async () => {
      const payload = {
        curriculumId: curriculum.id,
        academicYear: parseInt(formYear),
        semester: parseInt(formSemester),
        courseCode: formCourseCode.trim(),
        courseNameTh: formCourseNameTh.trim(),
        courseNameEn: formCourseNameEn.trim(),
        credits: parseInt(formCredits),
        courseType: formCourseType.trim(),
        sortOrder: 0,
      };

      if (editingItem) {
        const res = await updateCurriculumPlanAction({ ...payload, id: editingItem.id, sortOrder: editingItem.sortOrder });
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          refreshList();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      } else {
        const res = await createCurriculumPlanAction(payload);
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

  const handleDelete = () => {
    if (!deleteItem) return;
    startTransition(async () => {
      const res = await deleteCurriculumPlanAction(curriculum.id, deleteItem.id);
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
    const res = await getCurriculumPlansAction(curriculum.id);
    if (res.ok) {
      setItems(res.data);
    }
  };

  // Group by year and semester for display
  // Or just show all in a datatable sorted by year, semester, courseType
  const sortedItems = [...items].sort((a, b) => {
    if (a.academicYear !== b.academicYear) return a.academicYear - b.academicYear;
    if (a.semester !== b.semester) return a.semester - b.semester;
    return a.courseCode.localeCompare(b.courseCode);
  });

  const columns: DataTableColumn<CurriculumPlanDto>[] = [
    {
      key: "term",
      header: t("curriculum.plan.year") + " / " + t("curriculum.plan.semester"),
      render: (row) => (
        <span className="font-semibold text-sm">{row.academicYear} / {row.semester}</span>
      ),
    },
    {
      key: "code",
      header: t("curriculum.plan.courseCode"),
      render: (row) => (
        <span className="font-mono text-sm font-medium">{row.courseCode}</span>
      ),
    },
    {
      key: "name",
      header: t("curriculum.plan.courseNameTh"),
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{locale === "th" ? row.courseNameTh : row.courseNameEn}</span>
          <span className="text-xs text-muted-foreground">{locale === "th" ? row.courseNameEn : row.courseNameTh}</span>
        </div>
      ),
    },
    {
      key: "credits",
      header: t("curriculum.plan.credits"),
      render: (row) => (
        <span className="text-sm font-medium">{row.credits}</span>
      ),
    },
    {
      key: "type",
      header: t("curriculum.plan.courseType"),
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.courseType}</span>
      ),
    },
  ];

  const curriculumName = locale === "th" ? curriculum.nameTh : curriculum.nameEn;

  return (
    <div className="space-y-6">
      <div className="ph">
        <Link href="/curriculum" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("curriculum.nav.list")}
        </Link>
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t("curriculum.plan.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {curriculum.code} — {curriculumName}
            </p>
          </div>
          {canManage && (
            <div className="acts ml-auto">
              <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t("curriculum.plan.addCourse")}
              </Button>
            </div>
          )}
        </header>
      </div>

      <DataTable
        state={sortedItems.length === 0 ? "empty" : "data"}
        columns={columns}
        rows={sortedItems}
        getRowId={(item) => item.id}
        headHeading={t("curriculum.plan.title")}
        empty={{
          icon: <BookOpen className="h-8 w-8" />,
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
                icon={<Pencil className="h-4 w-4" />}
                onSelect={() => openEditDialog(row)}
              >
                {t("curriculum.plan.editCourse")}
              </RowMenuItem>
            )}
            {canManage && (
              <RowMenuItem
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onSelect={() => setDeleteItem(row)}
              >
                {t("curriculum.plan.deleteCourse")}
              </RowMenuItem>
            )}
          </>
        )}
      />

      {/* Add / Edit Dialog */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen} wide>
        <LiyonDialogHeader
          title={editingItem ? t("curriculum.plan.editCourse") : t("curriculum.plan.addCourse")}
          description={curriculumName}
        />
        <LiyonDialogBody className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <LiyonField label={t("curriculum.plan.year")}>
              <select
                value={formYear}
                onChange={(e) => setFormYear(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </LiyonField>
            <LiyonField label={t("curriculum.plan.semester")}>
              <select
                value={formSemester}
                onChange={(e) => setFormSemester(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {[1, 2, 3].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </LiyonField>
            <LiyonField label={t("curriculum.plan.courseCode")}>
              <input
                value={formCourseCode}
                onChange={(e) => setFormCourseCode(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background font-mono"
              />
            </LiyonField>
            <LiyonField label={t("curriculum.plan.credits")}>
               <input
                type="number"
                value={formCredits}
                onChange={(e) => setFormCredits(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LiyonField label={t("curriculum.plan.courseNameTh")}>
              <input
                value={formCourseNameTh}
                onChange={(e) => setFormCourseNameTh(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("curriculum.plan.courseNameEn")}>
              <input
                value={formCourseNameEn}
                onChange={(e) => setFormCourseNameEn(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          <LiyonField label={t("curriculum.plan.courseType")}>
             <input
              value={formCourseType}
              onChange={(e) => setFormCourseType(e.target.value)}
              placeholder="ex. วิชาเฉพาะ, วิชาเลือกเสรี, หมวดวิชาศึกษาทั่วไป..."
              className="w-full h-9 px-3 rounded-md border text-sm bg-background"
            />
          </LiyonField>
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
          title={t("common.delete")}
          description={t("common.deleteConfirm")}
        />
        <LiyonDialogBody>
          {deleteItem && (
            <div className="p-3 bg-muted rounded text-sm font-medium">
              {deleteItem.courseCode} {locale === "th" ? deleteItem.courseNameTh : deleteItem.courseNameEn}
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
