"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Building2, AlertCircle, Users, GraduationCap, ExternalLink, BookOpen, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import {
  DataTable,
  StatusPill,
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  LiyonField,
  RowMenuItem,
  type DataTableColumn,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type { DepartmentDto, DepartmentCurriculumSummaryDto } from "@/features/personnel";
import {
  createDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
  getDepartmentsAction,
  getDepartmentCurriculumsAction,
} from "@/features/personnel/actions";

interface Props {
  initialItems: DepartmentDto[];
}

export function DepartmentsClient({ initialItems }: Props) {
  const t = useT();
  const locale = useLocale();
  const [items, setItems] = useState<DepartmentDto[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<DepartmentDto | null>(null);
  const [editingItem, setEditingItem] = useState<DepartmentDto | null>(null);

  // Curriculum modal state
  const [curriculumsModalOpen, setCurriculumsModalOpen] = useState(false);
  const [selectedDeptForCurriculums, setSelectedDeptForCurriculums] = useState<DepartmentDto | null>(null);
  const [deptCurriculums, setDeptCurriculums] = useState<DepartmentCurriculumSummaryDto[]>([]);
  const [loadingCurriculums, setLoadingCurriculums] = useState(false);

  const [formCode, setFormCode] = useState("");
  const [formNameTh, setFormNameTh] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);

  const openCurriculumsModal = async (dept: DepartmentDto) => {
    setSelectedDeptForCurriculums(dept);
    setCurriculumsModalOpen(true);
    setLoadingCurriculums(true);
    const res = await getDepartmentCurriculumsAction(dept.id);
    if (res.ok) {
      setDeptCurriculums(res.data);
    } else {
      toast.error(res.error.message || t("common.error"));
    }
    setLoadingCurriculums(false);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormCode("");
    setFormNameTh("");
    setFormNameEn("");
    setFormSortOrder(items.length * 10);
    setModalOpen(true);
  };

  const openEditDialog = (item: DepartmentDto) => {
    setEditingItem(item);
    setFormCode(item.code);
    setFormNameTh(item.nameTh);
    setFormNameEn(item.nameEn);
    setFormSortOrder(item.sortOrder);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formCode.trim() || !formNameTh.trim() || !formNameEn.trim()) {
      toast.error(t("common.required"));
      return;
    }

    startTransition(async () => {
      const payload = {
        code: formCode.trim(),
        nameTh: formNameTh.trim(),
        nameEn: formNameEn.trim(),
        sortOrder: Number(formSortOrder) || 0,
      };

      if (editingItem) {
        const res = await updateDepartmentAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          refreshList();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      } else {
        const res = await createDepartmentAction(payload);
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
      const res = await deleteDepartmentAction(deleteItem.id);
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
    const res = await getDepartmentsAction();
    if (res.ok) {
      setItems(res.data);
    }
  };

  const columns: DataTableColumn<DepartmentDto>[] = [
    {
      key: "code",
      header: t("department.code"),
      render: (row) => <code>{row.code}</code>,
      sortable: true,
    },
    {
      key: "nameTh",
      header: t("department.nameTh"),
      render: (row) => <span className="font-medium">{row.nameTh}</span>,
      sortable: true,
    },
    {
      key: "nameEn",
      header: t("department.nameEn"),
      render: (row) => <span className="text-muted-foreground">{row.nameEn}</span>,
      sortable: true,
    },
    {
      key: "members",
      header: t("department.memberCount"),
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {row.personnelCount ?? 0}
        </span>
      ),
      sortable: true,
    },
    {
      key: "curriculums",
      header: t("department.curriculumCount"),
      render: (row) => (
        <button
          type="button"
          onClick={() => openCurriculumsModal(row)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer shadow-xs"
          title={t("department.viewCurriculums")}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{row.curriculumCount ?? 0} หลักสูตร</span>
        </button>
      ),
      sortable: true,
    },
    {
      key: "sortOrder",
      header: "Sort",
      render: (row) => <span className="text-xs text-muted-foreground">{row.sortOrder}</span>,
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="ph hr flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{t("department.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("personnel.subtitle")}</p>
        </div>
        <div className="acts ml-auto">
          <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("department.create")}
          </Button>
        </div>
      </header>

      <DataTable
        state={items.length === 0 ? "empty" : "data"}
        columns={columns}
        rows={items}
        getRowId={(item) => item.id}
        headHeading={t("department.title")}
        empty={{
          icon: <Building2 className="h-8 w-8" />,
          title: t("common.noData"),
        }}
        error={{
          icon: <AlertCircle className="h-8 w-8" />,
          title: t("common.error"),
        }}
        renderRowMenu={(row) => (
          <>
            <RowMenuItem
              icon={<GraduationCap className="h-4 w-4" />}
              onSelect={() => openCurriculumsModal(row)}
            >
              {t("department.viewCurriculums")}
            </RowMenuItem>
            <RowMenuItem
              icon={<Pencil className="h-4 w-4" />}
              onSelect={() => openEditDialog(row)}
            >
              {t("department.edit")}
            </RowMenuItem>
            <RowMenuItem
              danger
              icon={<Trash2 className="h-4 w-4" />}
              onSelect={() => setDeleteItem(row)}
            >
              {t("department.delete")}
            </RowMenuItem>
          </>
        )}
      />

      {/* Create / Edit Dialog */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader
          title={editingItem ? t("department.edit") : t("department.create")}
          description={t("personnel.subtitle")}
        />
        <LiyonDialogBody className="space-y-4">
          <LiyonField label={t("department.code")}>
            <input
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              placeholder="e.g. CS, IT, ACC"
              className="w-full h-9 px-3 rounded-md border text-sm bg-background"
            />
          </LiyonField>
          <LiyonField label={t("department.nameTh")}>
            <input
              value={formNameTh}
              onChange={(e) => setFormNameTh(e.target.value)}
              placeholder="เช่น ภาควิชาวิทยาการคอมพิวเตอร์"
              className="w-full h-9 px-3 rounded-md border text-sm bg-background"
            />
          </LiyonField>
          <LiyonField label={t("department.nameEn")}>
            <input
              value={formNameEn}
              onChange={(e) => setFormNameEn(e.target.value)}
              placeholder="e.g. Department of Computer Science"
              className="w-full h-9 px-3 rounded-md border text-sm bg-background"
            />
          </LiyonField>
          <LiyonField label="ลำดับการจัดเรียง (Sort Order)">
            <input
              type="number"
              value={String(formSortOrder)}
              onChange={(e) => setFormSortOrder(Number(e.target.value))}
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
          title={t("department.delete")}
          description={t("department.deleteConfirm")}
        />
        <LiyonDialogBody>
          {deleteItem && (
            <div className="p-3 bg-muted rounded text-sm font-medium">
              {locale === "th" ? deleteItem.nameTh : deleteItem.nameEn} ({deleteItem.code})
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

      {/* Department Curriculums Modal */}
      <LiyonDialog open={curriculumsModalOpen} onOpenChange={setCurriculumsModalOpen}>
        <LiyonDialogHeader
          title={selectedDeptForCurriculums ? `${t("department.curriculumsTitle")}: ${locale === "th" ? selectedDeptForCurriculums.nameTh : selectedDeptForCurriculums.nameEn}` : t("department.curriculumsTitle")}
          description={`${t("department.code")}: ${selectedDeptForCurriculums?.code ?? ""}`}
        />
        <LiyonDialogBody className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {loadingCurriculums ? (
            <div className="py-8 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>{t("common.loading")}</span>
            </div>
          ) : deptCurriculums.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">{t("department.noCurriculums")}</p>
              <p className="text-xs text-muted-foreground">
                สามารถเริ่มต้นสร้างหลักสูตรใหม่ที่สังกัดภาควิชาหรือส่วนงานนี้ได้ทันที
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border border rounded-lg overflow-hidden">
              {deptCurriculums.map((c) => (
                <div key={c.id} className="p-3.5 hover:bg-muted/40 transition-colors flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {c.code}
                      </code>
                      <span className="text-xs font-medium text-muted-foreground">
                        (พ.ศ. {c.curriculumYear})
                      </span>
                      <StatusPill tone={c.isActive ? "ok" : "off"}>
                        {c.isActive ? t("curriculum.status.active") : t("curriculum.status.inactive")}
                      </StatusPill>
                    </div>
                    <div className="font-medium text-sm text-foreground truncate">
                      {locale === "th" ? c.nameTh : c.nameEn}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span>{t(`curriculum.level.${c.degreeLevel}`)}</span>
                      <span>•</span>
                      <span>{c.totalCredits} {t("portal.curriculum.creditsUnit")}</span>
                      <span>•</span>
                      <span>{c.studyPeriodYears} {t("portal.curriculum.yearsUnit")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    <Link
                      href={`/curriculum/${c.id}/plan`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shadow-2xs"
                      title={t("curriculum.plan.manageBtn")}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{t("curriculum.plan.manageBtn")}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t pt-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {selectedDeptForCurriculums && (
              <Link
                href={`/curriculum?departmentId=${selectedDeptForCurriculums.id}&create=true`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t("department.addCurriculum")}</span>
              </Link>
            )}
            {selectedDeptForCurriculums && (
              <Link
                href={`/curriculum?departmentId=${selectedDeptForCurriculums.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border hover:bg-muted transition-colors text-foreground w-full sm:w-auto justify-center"
              >
                <span>{t("department.manageAllCurriculums")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurriculumsModalOpen(false)}>
            {t("common.close")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
