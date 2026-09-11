"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { updateSettingsAction, uploadLogoAction } from "@/features/identity/actions";
import { useRef } from "react";

export function SettingsForm({ initial }: { initial: TenantSettings }) {
  const t = useT();
  const router = useRouter();
  const [form, setForm] = useState({ nameTh: initial.nameTh, nameEn: initial.nameEn, logoUrl: initial.logoUrl ?? "", palette: initial.palette as PaletteId });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => { if (fileRef.current) fileRef.current.click(); };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; start(async () => { const formData = new FormData(); formData.append("file", file); const res = await uploadLogoAction(formData); if (res.ok) { setForm(prev => ({ ...prev, logoUrl: res.data })); toast.success("Logo uploaded successfully"); } else { toast.error("Failed to upload logo"); } if (fileRef.current) fileRef.current.value = ""; }); };

  function save() {
    start(async () => {
      const r = await updateSettingsAction(form);
      if (!r.ok) { setErrors(r.error.fieldErrors ?? {}); if (!r.error.fieldErrors) toast.error(t(`error.${r.error.code}`)); return; }
      setErrors({});
      toast.success(t("settings.saveOk"));
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-palette", form.palette);
      }
      router.refresh();
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
        <div className="savebar"><Button type="button" onClick={save} disabled={pending}>{t("common.save")}</Button></div>
      </div>
    </>
  );
}
