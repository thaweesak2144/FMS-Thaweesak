"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, LiyonSelect, LiyonSwitchRow, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { Eye, EyeOff } from "lucide-react";
import { updateSettingsAction, uploadLogoAction, testSmtpAction, testGeminiAction } from "@/features/identity/actions";

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
    contact: {
      address: initial.contact?.address || "",
      phone: initial.contact?.phone || "",
      email: initial.contact?.email || "",
      officeHours: initial.contact?.officeHours || "",
      facebookUrl: initial.contact?.facebookUrl || "",
      lineUrl: initial.contact?.lineUrl || "",
      youtubeUrl: initial.contact?.youtubeUrl || "",
      mapUrl: initial.contact?.mapUrl || "",
    },
    ai: {
      geminiApiKey: initial.ai?.geminiApiKey || "",
      model: initial.ai?.model || "gemini-2.5-flash",
    },
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();
  const [testPending, startTest] = useTransition();
  const [testAiPending, startTestAi] = useTransition();
  const [showApiKey, setShowApiKey] = useState(false);
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

  function testAi() {
    if (!form.ai.geminiApiKey.trim()) {
      toast.error("กรุณาระบุ Gemini API Key ก่อนทดสอบ");
      return;
    }
    startTestAi(async () => {
      const res = await testGeminiAction({
        apiKey: form.ai.geminiApiKey.trim(),
        model: form.ai.model || "gemini-2.5-flash",
      });
      if (res.ok) {
        toast.success(res.data.message || t("settings.testAiOk"));
      } else {
        toast.error(res.error.message || t("settings.testAiFail"));
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

        {/* ข้อมูลการติดต่อ (Contact Information for Portal) */}
        <LiyonCard>
          <h2>{t("settings.contactTitle")}</h2>
          <p>{t("settings.contactDesc")}</p>
          <div style={{ marginTop: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <LiyonField
                label={t("settings.contactAddress")}
                htmlFor="s-contact-address"
                hint="ที่อยู่หน่วยงานที่ต้องการให้แสดงผลด้านล่างเว็บไซต์ (Footer)"
                error={errors["contact.address"]?.[0]}
              >
                <textarea
                  id="s-contact-address"
                  rows={2}
                  value={form.contact.address}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })}
                  placeholder={t("settings.contactAddressPh")}
                  style={{
                    width: "100%",
                    resize: "vertical",
                    padding: "8px 12px",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--border)",
                    background: "var(--field-bg)",
                    color: "var(--text-1)",
                    fontSize: "0.875rem",
                    lineHeight: "1.4",
                  }}
                />
              </LiyonField>
            </div>

            <LiyonField
              label={t("settings.contactPhone")}
              htmlFor="s-contact-phone"
              error={errors["contact.phone"]?.[0]}
            >
              <input
                id="s-contact-phone"
                value={form.contact.phone}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
                placeholder={t("settings.contactPhonePh")}
              />
            </LiyonField>

            <LiyonField
              label={t("settings.contactEmail")}
              htmlFor="s-contact-email"
              error={errors["contact.email"]?.[0]}
            >
              <input
                id="s-contact-email"
                type="email"
                value={form.contact.email}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
                placeholder={t("settings.contactEmailPh")}
              />
            </LiyonField>

            <div style={{ gridColumn: "1 / -1" }}>
              <LiyonField
                label={t("settings.contactHours")}
                htmlFor="s-contact-hours"
                error={errors["contact.officeHours"]?.[0]}
              >
                <input
                  id="s-contact-hours"
                  value={form.contact.officeHours}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact, officeHours: e.target.value } })}
                  placeholder={t("settings.contactHoursPh")}
                />
              </LiyonField>
            </div>

            <LiyonField
              label={t("settings.contactFacebook")}
              htmlFor="s-contact-facebook"
              error={errors["contact.facebookUrl"]?.[0]}
            >
              <input
                id="s-contact-facebook"
                value={form.contact.facebookUrl}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, facebookUrl: e.target.value } })}
                placeholder={t("settings.contactFacebookPh")}
              />
            </LiyonField>

            <LiyonField
              label={t("settings.contactLine")}
              htmlFor="s-contact-line"
              error={errors["contact.lineUrl"]?.[0]}
            >
              <input
                id="s-contact-line"
                value={form.contact.lineUrl}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, lineUrl: e.target.value } })}
                placeholder={t("settings.contactLinePh")}
              />
            </LiyonField>

            <LiyonField
              label={t("settings.contactYoutube")}
              htmlFor="s-contact-youtube"
              error={errors["contact.youtubeUrl"]?.[0]}
            >
              <input
                id="s-contact-youtube"
                value={form.contact.youtubeUrl}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, youtubeUrl: e.target.value } })}
                placeholder={t("settings.contactYoutubePh")}
              />
            </LiyonField>

            <LiyonField
              label={t("settings.contactMap")}
              htmlFor="s-contact-map"
              error={errors["contact.mapUrl"]?.[0]}
            >
              <input
                id="s-contact-map"
                value={form.contact.mapUrl}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, mapUrl: e.target.value } })}
                placeholder={t("settings.contactMapPh")}
              />
            </LiyonField>
          </div>
        </LiyonCard>

        {/* Gemini AI Integration */}
        <LiyonCard>
          <h2>{t("settings.aiTitle")}</h2>
          <p>{t("settings.aiDesc")}</p>
          <div style={{ marginTop: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div>
              <LiyonField
                label={t("settings.aiApiKey")}
                htmlFor="s-ai-key"
                hint={t("settings.aiApiKeyHint")}
              >
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    id="s-ai-key"
                    type={showApiKey ? "text" : "password"}
                    value={form.ai.geminiApiKey}
                    onChange={(e) => setForm({ ...form, ai: { ...form.ai, geminiApiKey: e.target.value } })}
                    placeholder={t("settings.aiApiKeyPh")}
                    style={{ width: "100%", paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "var(--text-2)",
                    }}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </LiyonField>
            </div>

            <div>
              <LiyonField
                label={t("settings.aiModel")}
                htmlFor="s-ai-model"
                hint="เลือกรุ่นโมเดล Gemini ที่ต้องการใช้งาน"
              >
                <select
                  id="s-ai-model"
                  value={form.ai.model}
                  onChange={(e) => setForm({ ...form, ai: { ...form.ai, model: e.target.value } })}
                  style={{
                    width: "100%",
                    height: "38px",
                    padding: "0 12px",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--border)",
                    background: "var(--field-bg)",
                    color: "var(--text-1)",
                  }}
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (แนะนำ - เร็วและฉลาดล่าสุด)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (เสถียรและเร็วสูง)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (รุ่นมาตรฐาน)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (งานแปลและวิเคราะห์ซับซ้อน)</option>
                </select>
              </LiyonField>
            </div>

            <div style={{
              gridColumn: "1 / -1",
              marginTop: "0.5rem",
              padding: "16px",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--glass-border)",
              background: "var(--panel)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}>
              <div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>{t("settings.testAiBtn")}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-2)", margin: "4px 0 0" }}>
                  ทดสอบการเรียกใช้งาน Google Generative Language API
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={testAi}
                disabled={testAiPending || !form.ai.geminiApiKey.trim()}
              >
                {testAiPending ? "กำลังทดสอบ..." : t("settings.testAiBtn")}
              </Button>
            </div>
          </div>
        </LiyonCard>

        <div className="savebar"><Button type="button" onClick={save} disabled={pending}>{t("common.save")}</Button></div>
      </div>
    </>
  );
}
