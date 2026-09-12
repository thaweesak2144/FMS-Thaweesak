"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Pencil, Trash2, GraduationCap, BookOpen, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
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
    setModalOpen(true);
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
                {t("common.edit")}
              </RowMenuItem>
            )}
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
                {t("common.delete")}
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
