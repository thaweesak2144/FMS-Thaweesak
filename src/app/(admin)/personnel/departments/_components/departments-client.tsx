"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Building2, AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import {
  DataTable,
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  LiyonField,
  RowMenuItem,
  type DataTableColumn,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type { DepartmentDto } from "@/features/personnel";
import {
  createDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
  getDepartmentsAction,
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

  const [formCode, setFormCode] = useState("");
  const [formNameTh, setFormNameTh] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);

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
              icon={<Pencil className="h-4 w-4" />}
              onSelect={() => openEditDialog(row)}
            >
              {t("common.edit")}
            </RowMenuItem>
            <RowMenuItem
              danger
              icon={<Trash2 className="h-4 w-4" />}
              onSelect={() => setDeleteItem(row)}
            >
              {t("common.delete")}
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
    </div>
  );
}
