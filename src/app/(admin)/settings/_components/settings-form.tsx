"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, LiyonSelect, LiyonSwitchRow, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { updateSettingsAction, uploadLogoAction, testSmtpAction } from "@/features/identity/actions";

export function SettingsForm({ initial }: { initial: TenantSettings }) {
  const t = useT();
  const router = useRouter();
  const [form, setForm] = useState({
    nameTh: initial.nameTh,
    nameEn: initial.nameEn,
    logoUrl: initial.logoUrl ?? "",
    palette: initial.palette as PaletteId,
    smtp: {
      enabled: initial.smtp?.enabled ?? false,
      service: (initial.smtp?.service ?? "gmail") as "gmail" | "custom",
      host: initial.smtp?.host || "smtp.gmail.com",
      port: initial.smtp?.port || 465,
      secure: initial.smtp?.secure ?? true,
      user: initial.smtp?.user || "",
      pass: initial.smtp?.pass || "",
      from: initial.smtp?.from || "",
    },
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();
  const [testPending, startTest] = useTransition();
  const [testEmail, setTestEmail] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => { if (fileRef.current) fileRef.current.click(); };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    start(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadLogoAction(formData);
      if (res.ok) {
        setForm(prev => ({ ...prev, logoUrl: res.data }));
        toast.success("Logo uploaded successfully");
      } else {
        toast.error("Failed to upload logo");
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  function save() {
    start(async () => {
      const r = await updateSettingsAction(form);
      if (!r.ok) {
        setErrors(r.error.fieldErrors ?? {});
        if (!r.error.fieldErrors) toast.error(t(`error.${r.error.code}`));
        return;
      }
      setErrors({});
      toast.success(t("settings.saveOk"));
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-palette", form.palette);
      }
      router.refresh();
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    });
  }

  function testSmtp() {
    if (!form.smtp.user) {
      toast.error(t("settings.smtpUser") + " จำเป็นสำหรับการทดสอบ");
      return;
    }
    if (!form.smtp.pass) {
      toast.error(t("settings.smtpPass") + " จำเป็นสำหรับการทดสอบ");
      return;
    }
    const targetEmail = testEmail.trim() || form.smtp.user.trim();
    if (!targetEmail.includes("@")) {
      toast.error("กรุณาระบุอีเมลผู้รับที่ถูกต้อง");
      return;
    }

    startTest(async () => {
      const res = await testSmtpAction({
        host: form.smtp.host || "smtp.gmail.com",
        port: Number(form.smtp.port) || 465,
        secure: form.smtp.secure ?? true,
        user: form.smtp.user.trim(),
        pass: form.smtp.pass.replace(/\s/g, ""),
        from: form.smtp.from.trim() || form.smtp.user.trim(),
        testTo: targetEmail,
      });
      if (res.ok) {
        toast.success(t("settings.testOk"));
      } else {
        toast.error(res.error.message || t("settings.testFail"));
      }
    });
  }

  return (
    <>
      <header className="ph"><h1>{t("settings.title")}</h1></header>
      <div className="set-cards">
        <LiyonCard>
          <h2>{t("settings.orgTitle")}</h2>
          <div className="fields">
            <LiyonField label={t("settings.nameTh")} htmlFor="s-name-th" error={errors.nameTh?.[0]}><input id="s-name-th" value={form.nameTh} onChange={(e) => setForm({ ...form, nameTh: e.target.value })} /></LiyonField>
            <LiyonField label={t("settings.nameEn")} htmlFor="s-name-en" error={errors.nameEn?.[0]}><input id="s-name-en" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></LiyonField>
            <LiyonField label={t("settings.logoUrl")} htmlFor="s-logo" hint={t("common.optional")} error={errors.logoUrl?.[0]}>
              <div className="flex gap-2">
                <input id="s-logo" type="url" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} className="flex-1" />
                <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <Button type="button" variant="outline" onClick={handleUpload} disabled={pending}>Upload</Button>
              </div>
            </LiyonField>
          </div>
        </LiyonCard>

        <LiyonCard>
          <h2>{t("settings.brandTitle")}</h2>
          <p>{t("settings.brandDesc")}</p>
          <PalettePicker value={form.palette} onChange={(p) => { setForm({ ...form, palette: p }); if (typeof document !== "undefined") { document.documentElement.setAttribute("data-palette", p); } }} label={t("settings.paletteLabel")} />
          {form.palette === "coral" && <p className="warn" role="note">{t("settings.coralWarn")}</p>}
        </LiyonCard>

        <LiyonCard>
          <h2>{t("settings.smtpTitle")}</h2>
          <p>{t("settings.smtpDesc")}</p>
          <div style={{ marginTop: "1rem" }}>
            <LiyonSwitchRow
              id="s-smtp-enabled"
              checked={form.smtp.enabled}
              onCheckedChange={(checked) => setForm({ ...form, smtp: { ...form.smtp, enabled: checked } })}
              label={t("settings.smtpEnabled")}
              description="ส่งอีเมลแจ้งเตือน รหัสผ่าน และการยืนยันตัวตนผ่านเซิร์ฟเวอร์ SMTP อัตโนมัติ"
            />
          </div>

          {form.smtp.enabled && (
            <div className="fields" style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--glass-border)" }}>
              <LiyonField label={t("settings.smtpService")} htmlFor="s-smtp-service">
                <LiyonSelect
                  id="s-smtp-service"
                  value={form.smtp.service}
                  onChange={(e) => {
                    const s = e.target.value as "gmail" | "custom";
                    setForm({
                      ...form,
                      smtp: {
                        ...form.smtp,
                        service: s,
                        host: s === "gmail" ? "smtp.gmail.com" : form.smtp.host,
                        port: s === "gmail" ? 465 : form.smtp.port,
                        secure: s === "gmail" ? true : form.smtp.secure,
                      },
                    });
                  }}
                >
                  <option value="gmail">{t("settings.smtpGmail")}</option>
                  <option value="custom">{t("settings.smtpCustom")}</option>
                </LiyonSelect>
              </LiyonField>

              {form.smtp.service === "custom" && (
                <div className="field-row">
                  <LiyonField label={t("settings.smtpHost")} htmlFor="s-smtp-host" error={errors["smtp.host"]?.[0]}>
                    <input
                      id="s-smtp-host"
                      value={form.smtp.host}
                      onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, host: e.target.value } })}
                      placeholder="smtp.example.com"
                    />
                  </LiyonField>
                  <LiyonField label={t("settings.smtpPort")} htmlFor="s-smtp-port" error={errors["smtp.port"]?.[0]}>
                    <input
                      id="s-smtp-port"
                      type="number"
                      value={form.smtp.port}
                      onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, port: Number(e.target.value) || 0 } })}
                      placeholder="465"
                    />
                  </LiyonField>
                </div>
              )}

              <LiyonField
                label={t("settings.smtpUser")}
                htmlFor="s-smtp-user"
                error={errors["smtp.user"]?.[0]}
                hint={form.smtp.service === "gmail" ? "บัญชี Gmail ของผู้ส่ง (เช่น yourname@gmail.com)" : undefined}
              >
                <input
                  id="s-smtp-user"
                  type="email"
                  value={form.smtp.user}
                  onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, user: e.target.value } })}
                  placeholder={t("settings.smtpUserPh")}
                />
              </LiyonField>

              <LiyonField
                label={t("settings.smtpPass")}
                htmlFor="s-smtp-pass"
                hint={t("settings.smtpPassHint")}
                error={errors["smtp.pass"]?.[0]}
              >
                <input
                  id="s-smtp-pass"
                  type="password"
                  value={form.smtp.pass}
                  onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, pass: e.target.value } })}
                  placeholder={t("settings.smtpPassPh")}
                  autoComplete="new-password"
                />
              </LiyonField>

              <LiyonField
                label={t("settings.smtpFrom")}
                htmlFor="s-smtp-from"
                hint="เช่น วิทยาลัยสงฆ์ตาก <yourname@gmail.com> (หากไม่ระบุจะใช้อีเมลผู้ส่งอัตโนมัติ)"
                error={errors["smtp.from"]?.[0]}
              >
                <input
                  id="s-smtp-from"
                  value={form.smtp.from}
                  onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, from: e.target.value } })}
                  placeholder={t("settings.smtpFromPh")}
                />
              </LiyonField>

              <div style={{
                marginTop: "0.5rem",
                padding: "16px",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--glass-border)",
                background: "var(--panel)",
                display: "grid",
                gap: "10px"
              }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>{t("settings.testSmtpTitle")}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-2)", margin: 0 }}>
                  ส่งอีเมลทดสอบเพื่อตรวจสอบการเชื่อมต่อไปยังเซิร์ฟเวอร์ Gmail SMTP
                </p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="email"
                    style={{ flex: 1 }}
                    placeholder={`${t("settings.testTo")} (เว้นว่างไว้จะส่งไปยังอีเมลผู้ส่ง)`}
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testSmtp}
                    disabled={testPending || !form.smtp.user || !form.smtp.pass}
                  >
                    {testPending ? "กำลังทดสอบ..." : t("settings.testBtn")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </LiyonCard>

        <div className="savebar"><Button type="button" onClick={save} disabled={pending}>{t("common.save")}</Button></div>
      </div>
    </>
  );
}
