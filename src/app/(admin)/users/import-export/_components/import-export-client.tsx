"use client";

import React, { useState, useTransition, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Upload,
  FileSpreadsheet,
  FileDown,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  FileText,
  UserCheck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { LiyonCard } from "@/shared/components/liyon";
import {
  exportUsersCsvAction,
  getUsersCsvTemplateAction,
  validateUsersCsvAction,
  batchImportUsersAction,
} from "@/features/identity/actions";
import type {
  ValidImportUser,
  InvalidImportUser,
  CsvValidationResult,
} from "@/features/identity/_internal/services/import-export.service";

interface RolePick {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
}

interface Props {
  roles: RolePick[];
}

export function ImportExportClient({ roles }: Props) {
  const t = useT();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<"export" | "import">("export");

  // Export State
  const [exportStatus, setExportStatus] = useState<"all" | "active" | "inactive">("all");
  const [exportRoleId, setExportRoleId] = useState<string>("");
  const [isExporting, startExport] = useTransition();

  // Import State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null);
  const [isValidating, startValidate] = useTransition();
  const [isImporting, startImport] = useTransition();
  const [defaultPassword, setDefaultPassword] = useState("Password123!");
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  // Trigger browser download of CSV string
  const triggerDownload = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Export
  const handleExport = () => {
    startExport(async () => {
      const res = await exportUsersCsvAction({
        status: exportStatus,
        roleId: exportRoleId || undefined,
      });

      if (res.ok) {
        triggerDownload(res.data.csv, res.data.filename);
        toast.success("ส่งออกไฟล์ CSV เรียบร้อยแล้ว");
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  // Handle Download Template
  const handleDownloadTemplate = () => {
    startExport(async () => {
      const res = await getUsersCsvTemplateAction();
      if (res.ok) {
        triggerDownload(res.data.csv, res.data.filename);
        toast.success("ดาวน์โหลดไฟล์แม่แบบเรียบร้อยแล้ว");
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationResult(null);
    setImportSuccessCount(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        toast.error("ไม่สามารถอ่านข้อมูลจากไฟล์ได้");
        return;
      }

      startValidate(async () => {
        const res = await validateUsersCsvAction(text);
        if (res.ok) {
          setValidationResult(res.data);
          if (res.data.invalidRows.length > 0) {
            toast.warning(
              `พบ ${res.data.validRows.length} รายการที่ถูกต้อง และ ${res.data.invalidRows.length} รายการที่พบข้อผิดพลาด`
            );
          } else {
            toast.success(`ตรวจสอบผ่านทั้งหมด ${res.data.validRows.length} รายการ`);
          }
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      });
    };

    reader.readAsText(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileChange({ target: input } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    } else {
      toast.error("กรุณาเลือกไฟล์ .csv เท่านั้น");
    }
  };

  // Handle Batch Import Execution
  const handleConfirmImport = () => {
    if (!validationResult || validationResult.validRows.length === 0) {
      toast.error("ไม่มีข้อมูลที่สามารถนำเข้าได้");
      return;
    }

    startImport(async () => {
      const res = await batchImportUsersAction({
        users: validationResult.validRows,
        defaultPassword: defaultPassword.trim() || undefined,
      });

      if (res.ok) {
        setImportSuccessCount(res.data.count);
        toast.success(t("users.import.success", { n: res.data.count }));
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSelectedFile(null);
        setValidationResult(null);
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header & Navigation */}
      <div className="space-y-2">
        <Link
          href="/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("users.listTitle")}</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              <span>{t("users.importExport.title")}</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {t("users.importExport.subtitle")}
            </p>
          </div>

          {/* Tab Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg border text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("export")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === "export"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Download className="h-4 w-4" />
              <span>ส่งออก (Export CSV)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("import")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === "import"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>นำเข้า (Import CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────── TAB 1: EXPORT CSV ────────────────── */}
      {activeTab === "export" && (
        <LiyonCard className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground">
              {t("users.export.title")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("users.export.desc")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                {t("users.filterStatus")}
              </label>
              <select
                value={exportStatus}
                onChange={(e) => setExportStatus(e.target.value as "all" | "active" | "inactive")}
                className="w-full h-9 px-3 rounded-md border text-xs bg-background"
              >
                <option value="all">{t("users.export.all")}</option>
                <option value="active">{t("users.export.activeOnly")}</option>
                <option value="inactive">{t("users.export.inactiveOnly")}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                {t("users.export.filterRole")}
              </label>
              <select
                value={exportRoleId}
                onChange={(e) => setExportRoleId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-xs bg-background"
              >
                <option value="">{t("common.all")}</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {locale === "th" ? r.nameTh : r.nameEn} ({r.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border text-xs space-y-2">
            <div className="font-semibold flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>ข้อมูลคุณลักษณะของไฟล์ส่งออก:</span>
            </div>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>คอลัมน์ในไฟล์: <strong>ID, ชื่อ, อีเมล, บทบาท, สถานะ, เข้าสู่ระบบล่าสุด, วันที่สร้าง</strong></li>
              <li>เข้ารหัส <strong>UTF-8 with BOM</strong> ทำให้เปิดใน <strong>Microsoft Excel</strong> ภาษาไทยได้โดยสระและตัวอักษรไม่เพี้ยน</li>
              <li>จัดเรียงตามชื่อผู้ใช้ กรองข้อมูลตามสิทธิ์ขององค์กรปัจจุบัน</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{t("users.export.btn")}</span>
            </Button>
          </div>
        </LiyonCard>
      )}

      {/* ────────────────── TAB 2: IMPORT CSV ────────────────── */}
      {activeTab === "import" && (
        <div className="space-y-6">
          {/* Notification on Success */}
          {importSuccessCount !== null && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="font-semibold">
                  {t("users.import.success", { n: importSuccessCount })}
                </span>
              </div>
              <Link href="/users">
                <Button size="sm" variant="outline" className="h-7 text-xs bg-background">
                  {t("users.listTitle")}
                </Button>
              </Link>
            </div>
          )}

          <LiyonCard className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">
                {t("users.import.title")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("users.import.desc")}
              </p>
            </div>
            {/* Step 1: Download Template */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border">
              <div>
                <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                  <FileDown className="h-4 w-4 text-primary" />
                  <span>ยังไม่มีรูปแบบไฟล์แม่แบบ?</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  ดาวน์โหลดไฟล์ตัวอย่างที่มีคอลัมน์มาตรฐานครบถ้วน (email, name, roleCode, password, status)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="text-xs h-8 gap-1.5 flex-shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{t("users.import.downloadTemplate")}</span>
              </Button>
            </div>

            {/* Step 2: Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-muted/20 transition-all space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {t("users.import.dropzone")}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  รองรับเฉพาะไฟล์ .csv (สูงสุด 5MB หรือ 1,000 รายการต่อครั้ง)
                </p>
              </div>

              {selectedFile && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <FileText className="h-3.5 w-3.5" />
                  <span>
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>

            {isValidating && (
              <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>กำลังแยกวิเคราะห์และตรวจสอบความถูกต้องของข้อมูล...</span>
              </div>
            )}

            {/* Step 3: Validation Results Preview */}
            {validationResult && !isValidating && (
              <div className="space-y-4 pt-2 border-t">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-xs text-foreground flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span>ผลการตรวจสอบไฟล์: ทั้งหมด {validationResult.totalRows} รายการ</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      พร้อมนำเข้า: {validationResult.validRows.length} รายการ
                    </span>
                    {validationResult.invalidRows.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-destructive/10 text-destructive">
                        ข้อผิดพลาด: {validationResult.invalidRows.length} รายการ
                      </span>
                    )}
                  </div>
                </div>

                {/* Errors Table (if any) */}
                {validationResult.invalidRows.length > 0 && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                    <div className="font-semibold text-xs text-destructive flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      <span>รายการที่พบข้อผิดพลาด (จะไม่ถูกนำเข้า):</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-destructive/10 text-xs">
                      {validationResult.invalidRows.map((inv, idx) => (
                        <div key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-mono text-muted-foreground mr-2">
                              แถว {inv.rowNumber}:
                            </span>
                            <span className="font-medium text-foreground mr-2">
                              {inv.email}
                            </span>
                            <span className="text-muted-foreground">({inv.name})</span>
                          </div>
                          <div className="text-destructive font-semibold">
                            {inv.errors.join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Valid Rows Preview Table */}
                {validationResult.validRows.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-semibold text-xs text-foreground">
                      ตัวอย่างข้อมูลที่พร้อมนำเข้า ({validationResult.validRows.length} รายการ):
                    </div>
                    <div className="max-h-60 overflow-y-auto border rounded-xl divide-y text-xs">
                      {validationResult.validRows.slice(0, 10).map((row, idx) => (
                        <div key={idx} className="p-2.5 flex items-center justify-between gap-3 hover:bg-muted/30">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-foreground">{row.name}</span>
                            <span className="text-muted-foreground font-mono">{row.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[11px]">
                              {row.roleCode}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                row.isActive
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {row.isActive ? "ใช้งาน" : "ระงับ"}
                            </span>
                          </div>
                        </div>
                      ))}
                      {validationResult.validRows.length > 10 && (
                        <div className="p-2 text-center text-muted-foreground text-[11px] italic bg-muted/20">
                          ...และอีก {validationResult.validRows.length - 10} รายการ
                        </div>
                      )}
                    </div>

                    {/* Default Password Setting */}
                    <div className="p-3.5 rounded-xl border bg-muted/30 space-y-2">
                      <label className="text-xs font-semibold text-foreground block">
                        {t("users.import.defaultPassword")}
                      </label>
                      <input
                        type="text"
                        value={defaultPassword}
                        onChange={(e) => setDefaultPassword(e.target.value)}
                        placeholder="อย่างน้อย 8 ตัวอักษร"
                        className="w-full sm:w-72 h-8 px-3 rounded-md border text-xs bg-background font-mono"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {t("users.import.defaultPasswordHint")}
                      </p>
                    </div>

                    {/* Confirm Button */}
                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        onClick={handleConfirmImport}
                        disabled={isImporting}
                        className="gap-2"
                      >
                        {isImporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <span>{t("users.import.submitBtn", { n: validationResult.validRows.length })}</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </LiyonCard>
        </div>
      )}
    </div>
  );
}
