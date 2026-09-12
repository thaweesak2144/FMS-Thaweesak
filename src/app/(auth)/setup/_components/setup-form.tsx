"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { performInitialSetupAction } from "@/features/identity/setup-actions";
import { Button } from "@/components/ui/button";

export function SetupForm() {
  const router = useRouter();
  const t = useT();

  const [tenantNameTh, setTenantNameTh] = useState("คณะวิทยาการจัดการ");
  const [tenantNameEn, setTenantNameEn] = useState("Faculty of Management Science");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tenantNameTh.trim() || !adminName.trim() || !adminEmail.trim() || !password) {
      toast.error(t("common.required"));
      return;
    }

    if (password.length < 8) {
      toast.error(t("setup.password"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("reset.mismatch"));
      return;
    }

    setIsPending(true);
    try {
      const res = await performInitialSetupAction({
        tenantNameTh,
        tenantNameEn,
        adminName,
        adminEmail,
        password,
        confirmPassword,
      });

      if (res.ok) {
        toast.success(t("setup.success"));
        router.push("/login");
        router.refresh();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-card rounded-2xl shadow-xl border border-border/80 p-6 sm:p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{t("setup.title")}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{t("setup.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>ข้อมูลองค์กร / คณะ</span>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              {t("setup.orgTh")} *
            </label>
            <input
              type="text"
              required
              value={tenantNameTh}
              onChange={(e) => setTenantNameTh(e.target.value)}
              placeholder="เช่น คณะวิทยาการจัดการ"
              className="w-full h-9 px-3 rounded-md border text-sm bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              {t("setup.orgEn")} *
            </label>
            <input
              type="text"
              required
              value={tenantNameEn}
              onChange={(e) => setTenantNameEn(e.target.value)}
              placeholder="e.g. Faculty of Management Science"
              className="w-full h-9 px-3 rounded-md border text-sm bg-background"
            />
          </div>
        </div>

        <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>บัญชีผู้ดูแลระบบสูงสุด (Super Admin)</span>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              {t("setup.adminName")} *
            </label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="เช่น ผู้ดูแลระบบสูงสุด"
              className="w-full h-9 px-3 rounded-md border text-sm bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              {t("setup.adminEmail")} *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">
                {t("setup.password")} *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">
                {t("setup.confirmPassword")} *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 text-sm font-medium gap-2"
          disabled={isPending}
        >
          {isPending ? t("common.loading") : t("setup.submit")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
