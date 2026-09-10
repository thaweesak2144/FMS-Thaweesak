"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  UserCheck,
  Building2,
  GraduationCap,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
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
import type { PersonnelDto, DepartmentDto } from "@/features/personnel";
import {
  createPersonnelAction,
  updatePersonnelAction,
  deletePersonnelAction,
  togglePersonnelActiveAction,
  getPersonnelListAction,
} from "@/features/personnel/actions";

interface Props {
  initialPersonnel: PersonnelDto[];
  departments: DepartmentDto[];
  canWrite: boolean;
  canDelete: boolean;
}

export function PersonnelClient({
  initialPersonnel,
  departments,
  canWrite,
  canDelete,
}: Props) {
  const t = useT();
  const locale = useLocale();
  const [items, setItems] = useState<PersonnelDto[]>(initialPersonnel);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterType, setFilterType] = useState("");

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonnelDto | null>(null);
  const [deleteItem, setDeleteItem] = useState<PersonnelDto | null>(null);

  // Form states
  const [formEmployeeCode, setFormEmployeeCode] = useState("");
  const [formTitleTh, setFormTitleTh] = useState("");
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formFirstNameTh, setFormFirstNameTh] = useState("");
  const [formLastNameTh, setFormLastNameTh] = useState("");
  const [formFirstNameEn, setFormFirstNameEn] = useState("");
  const [formLastNameEn, setFormLastNameEn] = useState("");
  const [formAcademicRank, setFormAcademicRank] = useState("");
  const [formPositionTh, setFormPositionTh] = useState("");
  const [formPositionEn, setFormPositionEn] = useState("");
  const [formDepartmentId, setFormDepartmentId] = useState(departments[0]?.id ?? "");
  const [formPersonnelType, setFormPersonnelType] = useState<"FULL_TIME" | "PART_TIME" | "EXTERNAL">("FULL_TIME");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPhotoUrl, setFormPhotoUrl] = useState("");
  const [formBioTh, setFormBioTh] = useState("");
  const [formBioEn, setFormBioEn] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formEducations, setFormEducations] = useState<Array<{
    degree: string;
    major: string;
    institution: string;
    graduationYear: number | null;
  }>>([]);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormEmployeeCode("");
    setFormTitleTh("อาจารย์");
    setFormTitleEn("Lecturer");
    setFormFirstNameTh("");
    setFormLastNameTh("");
    setFormFirstNameEn("");
    setFormLastNameEn("");
    setFormAcademicRank("");
    setFormPositionTh("อาจารย์ประจำ");
    setFormPositionEn("Lecturer");
    setFormDepartmentId(departments[0]?.id ?? "");
    setFormPersonnelType("FULL_TIME");
    setFormEmail("");
    setFormPhone("");
    setFormPhotoUrl("");
    setFormBioTh("");
    setFormBioEn("");
    setFormTags("");
    setFormIsActive(true);
    setFormEducations([]);
    setModalOpen(true);
  };

  const openEditDialog = (item: PersonnelDto) => {
    setEditingItem(item);
    setFormEmployeeCode(item.employeeCode);
    setFormTitleTh(item.titleTh);
    setFormTitleEn(item.titleEn);
    setFormFirstNameTh(item.firstNameTh);
    setFormLastNameTh(item.lastNameTh);
    setFormFirstNameEn(item.firstNameEn);
    setFormLastNameEn(item.lastNameEn);
    setFormAcademicRank(item.academicRank ?? "");
    setFormPositionTh(item.positionTh);
    setFormPositionEn(item.positionEn);
    setFormDepartmentId(item.departmentId);
    setFormPersonnelType(item.personnelType);
    setFormEmail(item.email);
    setFormPhone(item.phone ?? "");
    setFormPhotoUrl(item.photoUrl ?? "");
    setFormBioTh(item.bioTh ?? "");
    setFormBioEn(item.bioEn ?? "");
    setFormTags((item.expertiseTags ?? []).join(", "));
    setFormIsActive(item.isActive);
    setFormEducations(
      (item.educations ?? []).map((e) => ({
        degree: e.degree,
        major: e.major,
        institution: e.institution,
        graduationYear: e.graduationYear,
      }))
    );
    setModalOpen(true);
  };

  const addEducationRow = () => {
    setFormEducations((prev) => [
      ...prev,
      { degree: "ปริญญาตรี", major: "", institution: "", graduationYear: null },
    ]);
  };

  const removeEducationRow = (index: number) => {
    setFormEducations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEducationRow = (index: number, field: string, value: any) => {
    setFormEducations((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    if (!formEmployeeCode.trim() || !formFirstNameTh.trim() || !formLastNameTh.trim() || !formEmail.trim() || !formDepartmentId) {
      toast.error(t("common.required"));
      return;
    }

    startTransition(async () => {
      const expertiseTags = formTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        employeeCode: formEmployeeCode.trim(),
        titleTh: formTitleTh.trim(),
        titleEn: formTitleEn.trim(),
        firstNameTh: formFirstNameTh.trim(),
        lastNameTh: formLastNameTh.trim(),
        firstNameEn: formFirstNameEn.trim(),
        lastNameEn: formLastNameEn.trim(),
        academicRank: formAcademicRank.trim() || null,
        positionTh: formPositionTh.trim(),
        positionEn: formPositionEn.trim(),
        departmentId: formDepartmentId,
        personnelType: formPersonnelType,
        email: formEmail.trim(),
        phone: formPhone.trim() || null,
        photoUrl: formPhotoUrl.trim() || null,
        bioTh: formBioTh.trim() || null,
        bioEn: formBioEn.trim() || null,
        expertiseTags,
        isActive: formIsActive,
        sortOrder: 0,
        educations: formEducations.map((e, idx) => ({
          degree: e.degree,
          major: e.major,
          institution: e.institution,
          graduationYear: e.graduationYear ? Number(e.graduationYear) : null,
          sortOrder: idx,
        })),
      };

      if (editingItem) {
        const res = await updatePersonnelAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          refreshList();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      } else {
        const res = await createPersonnelAction(payload);
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

  const handleToggleActive = (item: PersonnelDto) => {
    startTransition(async () => {
      const res = await togglePersonnelActiveAction(item.id);
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
      const res = await deletePersonnelAction(deleteItem.id);
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
    const res = await getPersonnelListAction({
      departmentId: filterDepartment || undefined,
      personnelType: (filterType as any) || undefined,
    });
    if (res.ok) {
      setItems(res.data);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterDepartment && item.departmentId !== filterDepartment) return false;
    if (filterType && item.personnelType !== filterType) return false;
    return true;
  });

  const columns: DataTableColumn<PersonnelDto>[] = [
    {
      key: "name",
      header: t("personnel.fullNameTh"),
      render: (row) => {
        const name = locale === "th"
          ? `${row.academicRank ? row.academicRank + " " : ""}${row.titleTh} ${row.firstNameTh} ${row.lastNameTh}`
          : `${row.titleEn} ${row.firstNameEn} ${row.lastNameEn}`;
        return (
          <div className="flex items-center gap-3">
            {row.photoUrl ? (
              <img
                src={row.photoUrl}
                alt={name}
                className="h-8 w-8 rounded-full object-cover border"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                {(row.firstNameEn || row.firstNameTh || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-semibold text-xs leading-tight">{name}</div>
              <div className="text-[11px] text-muted-foreground">{row.email}</div>
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "employeeCode",
      header: t("personnel.employeeCode"),
      render: (row) => <code>{row.employeeCode}</code>,
      sortable: true,
    },
    {
      key: "department",
      header: t("personnel.department"),
      render: (row) => (
        <span className="text-xs font-medium">
          {locale === "th" ? row.departmentNameTh : row.departmentNameEn}
        </span>
      ),
      sortable: true,
    },
    {
      key: "position",
      header: t("personnel.positionTh"),
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {locale === "th" ? row.positionTh : row.positionEn}
        </span>
      ),
    },
    {
      key: "type",
      header: t("personnel.type"),
      render: (row) => (
        <span className="text-[11px] px-2 py-0.5 rounded bg-muted font-medium">
          {t(`personnel.type.${row.personnelType}`)}
        </span>
      ),
    },
    {
      key: "status",
      header: t("personnel.status"),
      render: (row) => (
        <StatusPill tone={row.isActive ? "ok" : "off"}>
          {row.isActive ? t("personnel.status.active") : t("personnel.status.inactive")}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="ph hr flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{t("personnel.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("personnel.subtitle")}</p>
        </div>
        {canWrite && (
          <div className="acts ml-auto">
            <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("personnel.create")}
            </Button>
          </div>
        )}
      </header>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="h-9 px-3 rounded-md border text-xs bg-background"
        >
          <option value="">{t("personnel.allDepartments")}</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {locale === "th" ? d.nameTh : d.nameEn}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 px-3 rounded-md border text-xs bg-background"
        >
          <option value="">{t("personnel.allTypes")}</option>
          <option value="FULL_TIME">{t("personnel.type.FULL_TIME")}</option>
          <option value="PART_TIME">{t("personnel.type.PART_TIME")}</option>
          <option value="EXTERNAL">{t("personnel.type.EXTERNAL")}</option>
        </select>
      </div>

      <DataTable
        state={filteredItems.length === 0 ? "empty" : "data"}
        columns={columns}
        rows={filteredItems}
        getRowId={(item) => item.id}
        headHeading={t("personnel.title")}
        empty={{
          icon: <UserCheck className="h-8 w-8" />,
          title: t("common.noData"),
        }}
        error={{
          icon: <AlertCircle className="h-8 w-8" />,
          title: t("common.error"),
        }}
        renderRowMenu={(row) => (
          <>
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
                icon={row.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onSelect={() => handleToggleActive(row)}
              >
                {row.isActive ? t("personnel.status.inactive") : t("personnel.status.active")}
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
          title={editingItem ? t("personnel.edit") : t("personnel.create")}
          description={t("personnel.subtitle")}
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Code & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LiyonField label={t("personnel.employeeCode")}>
              <input
                value={formEmployeeCode}
                onChange={(e) => setFormEmployeeCode(e.target.value)}
                placeholder="e.g. EMP-001"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("personnel.type")}
              </label>
              <select
                value={formPersonnelType}
                onChange={(e) => setFormPersonnelType(e.target.value as any)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                <option value="FULL_TIME">{t("personnel.type.FULL_TIME")}</option>
                <option value="PART_TIME">{t("personnel.type.PART_TIME")}</option>
                <option value="EXTERNAL">{t("personnel.type.EXTERNAL")}</option>
              </select>
            </div>
          </div>

          {/* Department & Academic Rank */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("personnel.department")} *
              </label>
              <select
                value={formDepartmentId}
                onChange={(e) => setFormDepartmentId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {locale === "th" ? d.nameTh : d.nameEn} ({d.code})
                  </option>
                ))}
              </select>
            </div>
            <LiyonField label={t("personnel.academicRank")}>
              <input
                value={formAcademicRank}
                onChange={(e) => setFormAcademicRank(e.target.value)}
                placeholder="เช่น ศ., รศ., ผศ., อ."
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          {/* Thai Name & Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LiyonField label={t("personnel.titlePrefixTh")}>
              <input
                value={formTitleTh}
                onChange={(e) => setFormTitleTh(e.target.value)}
                placeholder="เช่น อาจารย์, ดร."
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("personnel.firstNameTh")}>
              <input
                value={formFirstNameTh}
                onChange={(e) => setFormFirstNameTh(e.target.value)}
                placeholder="ชื่อภาษาไทย"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("personnel.lastNameTh")}>
              <input
                value={formLastNameTh}
                onChange={(e) => setFormLastNameTh(e.target.value)}
                placeholder="นามสกุลภาษาไทย"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          {/* English Name & Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LiyonField label={t("personnel.titlePrefixEn")}>
              <input
                value={formTitleEn}
                onChange={(e) => setFormTitleEn(e.target.value)}
                placeholder="e.g. Dr., Mr., Ms."
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("personnel.firstNameEn")}>
              <input
                value={formFirstNameEn}
                onChange={(e) => setFormFirstNameEn(e.target.value)}
                placeholder="First Name (EN)"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("personnel.lastNameEn")}>
              <input
                value={formLastNameEn}
                onChange={(e) => setFormLastNameEn(e.target.value)}
                placeholder="Last Name (EN)"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          {/* Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LiyonField label={t("personnel.positionTh")}>
              <input
                value={formPositionTh}
                onChange={(e) => setFormPositionTh(e.target.value)}
                placeholder="เช่น หัวหน้าภาควิชา, อาจารย์ประจำ"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("personnel.positionEn")}>
              <input
                value={formPositionEn}
                onChange={(e) => setFormPositionEn(e.target.value)}
                placeholder="e.g. Department Head, Lecturer"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          {/* Contact & Photo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LiyonField label={t("personnel.email")}>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="name@university.ac.th"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("personnel.phone")}>
              <input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="02-xxx-xxxx"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("personnel.photo")}>
              <input
                value={formPhotoUrl}
                onChange={(e) => setFormPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          {/* Bio & Tags */}
          <div className="space-y-3">
            <LiyonField label={t("personnel.expertise")}>
              <input
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น AI, Data Science, Web Development"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  {t("personnel.bioTh")}
                </label>
                <textarea
                  value={formBioTh}
                  onChange={(e) => setFormBioTh(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-md border text-xs bg-background"
                  placeholder="ประวัติการทำงาน ผลงาน หรือแนะนำตัวสั้นๆ"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  {t("personnel.bioEn")}
                </label>
                <textarea
                  value={formBioEn}
                  onChange={(e) => setFormBioEn(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-md border text-xs bg-background"
                  placeholder="Short bio or introduction in English"
                />
              </div>
            </div>
          </div>

          {/* Educations list */}
          <div className="space-y-2 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs">{t("personnel.educations")}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEducationRow}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {t("personnel.edu.add")}
              </Button>
            </div>

            {formEducations.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">ยังไม่มีข้อมูลประวัติการศึกษา</p>
            ) : (
              <div className="space-y-2">
                {formEducations.map((edu, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-2 p-2 bg-muted/40 rounded border text-xs"
                  >
                    <input
                      value={edu.degree}
                      onChange={(e) => updateEducationRow(idx, "degree", e.target.value)}
                      placeholder="วุฒิ เช่น ปริญญาเอก"
                      className="h-8 px-2 rounded border bg-background flex-1 min-w-[100px]"
                    />
                    <input
                      value={edu.major}
                      onChange={(e) => updateEducationRow(idx, "major", e.target.value)}
                      placeholder="สาขา เช่น วิศวกรรมคอมพิวเตอร์"
                      className="h-8 px-2 rounded border bg-background flex-1 min-w-[140px]"
                    />
                    <input
                      value={edu.institution}
                      onChange={(e) => updateEducationRow(idx, "institution", e.target.value)}
                      placeholder="สถาบัน / มหาวิทยาลัย"
                      className="h-8 px-2 rounded border bg-background flex-1 min-w-[140px]"
                    />
                    <input
                      type="number"
                      value={edu.graduationYear ?? ""}
                      onChange={(e) => updateEducationRow(idx, "graduationYear", e.target.value)}
                      placeholder="ปี พ.ศ./ค.ศ."
                      className="h-8 px-2 rounded border bg-background w-20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducationRow(idx)}
                      className="h-7 w-7 p-0 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={formIsActive}
              onChange={(e) => setFormIsActive(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-medium">
              {t("personnel.status.active")}
            </label>
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
          title={t("personnel.delete")}
          description={t("personnel.deleteConfirm")}
        />
        <LiyonDialogBody>
          {deleteItem && (
            <div className="p-3 bg-muted rounded text-sm font-medium">
              {deleteItem.titleTh} {deleteItem.firstNameTh} {deleteItem.lastNameTh} ({deleteItem.employeeCode})
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
