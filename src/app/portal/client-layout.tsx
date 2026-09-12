"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogIn, LayoutDashboard, Menu, X, User, LogOut, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useAppSession } from "@/hooks/use-session";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { signOut } from "next-auth/react";
import type { ContactSettings } from "@/features/identity";

export default function PortalClientLayout({
  children,
  logoUrl,
  orgNameTh,
  orgNameEn,
  contact,
}: {
  children: React.ReactNode;
  logoUrl?: string | null;
  orgNameTh?: string | null;
  orgNameEn?: string | null;
  contact?: ContactSettings | null;
}) {
  const pathname = usePathname();
  const t = useT();
  const locale = useLocale();
  const { user, status } = useAppSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const initials = (user?.name ?? "?").trim().charAt(0).toUpperCase() || "?";
  const orgName = (locale === "th" ? orgNameTh : orgNameEn) || orgNameTh || orgNameEn || t("app.name");

  const address = contact?.address || `${orgName} อ.เมือง จ.ตาก 63000`;
  const phone = contact?.phone || "055-896083";
  const email = contact?.email || "ragnaroknaja888@gmail.com";
  const officeHours = contact?.officeHours || (locale === "th" ? "จันทร์ - ศุกร์: 08:30 - 16:30 น." : "Mon - Fri: 08:30 - 16:30");
  const facebookUrl = contact?.facebookUrl || "https://facebook.com";
  const youtubeUrl = contact?.youtubeUrl || "https://youtube.com";
  const lineUrl = contact?.lineUrl || "https://line.me";
  const mapUrl = contact?.mapUrl || "";

  const navLinks = [
    { href: "/portal", label: locale === "th" ? "หน้าหลัก" : "Home" },
    { href: "/portal/news", label: t("portal.nav.news") },
    { href: "/portal/personnel", label: t("portal.nav.personnel") },
    { href: "/portal/curriculum", label: t("portal.nav.curriculum") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top Floating Capsule Navbar (Etail.me Dribbble Style) */}
      <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-4 sm:px-8 w-full pointer-events-none">
        <div className="max-w-6xl mx-auto rounded-full bg-white dark:bg-card/95 backdrop-blur-xl border border-slate-100/90 dark:border-border/50 shadow-[0_4px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.4)] px-6 sm:px-8 h-[68px] flex items-center justify-between pointer-events-auto transition-all">
          {/* Brand Logo & Name (Like etail.me on the left) */}
          <Link href="/portal" className="flex items-center gap-2.5 group shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-9 w-9 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5 w-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                {orgName}
              </span>
              {(locale === "th" ? orgNameEn : orgNameTh) && (
                <span className="text-[11px] font-medium text-muted-foreground leading-none mt-0.5">
                  {locale === "th" ? orgNameEn : orgNameTh}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation Links (Centered, clean text like About / Features / Pricing) */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-10 list-none text-sm font-medium">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/portal" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition-colors text-sm ${
                      active
                        ? "text-slate-950 dark:text-white font-bold"
                        : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Side: Tools & Actions (Login + Start Selling / Staff Console Pill) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              className="icon-btn hover:bg-slate-100 dark:hover:bg-muted/60 rounded-full"
              aria-label={t("nav.themeToggle") || "Toggle theme"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              )}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {status === "authenticated" && user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-border/50">
                {/* User Avatar Dropdown */}
                <DropdownMenuPrimitive.Root>
                  <DropdownMenuPrimitive.Trigger asChild>
                    <button type="button" className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-muted transition-colors outline-none">
                      <span className="who inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-xs overflow-hidden" aria-hidden="true">
                        {user.image ? (
                          <img src={user.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          initials
                        )}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">{user.name}</span>
                      <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </DropdownMenuPrimitive.Trigger>
                  <DropdownMenuPrimitive.Portal>
                    <DropdownMenuPrimitive.Content className="menu-list shadow-xl rounded-xl border border-slate-200 dark:border-border/60 bg-white dark:bg-card p-1 z-50 min-w-[200px]" align="end" sideOffset={8}>
                      <div className="px-3 py-2 border-b border-muted/60 mb-1">
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                      </div>
                      <DropdownMenuPrimitive.Item asChild>
                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/70 cursor-pointer rounded-md outline-none">
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                          {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                        </Link>
                      </DropdownMenuPrimitive.Item>
                      <DropdownMenuPrimitive.Item asChild>
                        <Link href="/me" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/70 cursor-pointer rounded-md outline-none">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {locale === "th" ? "โปรไฟล์ส่วนตัว" : "My Profile"}
                        </Link>
                      </DropdownMenuPrimitive.Item>
                      <div className="my-1 border-t border-muted/60" aria-hidden="true" />
                      <DropdownMenuPrimitive.Item asChild>
                        <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/70 cursor-pointer rounded-md outline-none text-red-500 hover:text-red-600">
                          <LogOut className="h-4 w-4" />
                          {locale === "th" ? "ออกจากระบบ" : "Logout"}
                        </button>
                      </DropdownMenuPrimitive.Item>
                    </DropdownMenuPrimitive.Content>
                  </DropdownMenuPrimitive.Portal>
                </DropdownMenuPrimitive.Root>

                {/* Direct CTA Pill Button (Like Start Selling) */}
                <Link
                  href="/dashboard"
                  className="rounded-full px-5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {locale === "th" ? "แดชบอร์ด" : "Console"}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Ghost Login button (Like Login in Etail) */}
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-muted/50 transition-all"
                >
                  {locale === "th" ? "เข้าสู่ระบบ" : "Login"}
                </Link>

                {/* Dark Pill CTA (Like Start Selling in Etail) */}
                <Link
                  href="/login"
                  className="rounded-full px-5 py-2 text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  {locale === "th" ? "สำหรับเจ้าหน้าที่" : "Staff Portal"}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              className="icon-btn hover:bg-slate-100 dark:hover:bg-muted rounded-full"
              aria-label={t("nav.themeToggle") || "Toggle theme"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              )}
            </button>
            <LanguageSwitcher />
            <button
              type="button"
              className="icon-btn hover:bg-slate-100 dark:hover:bg-muted rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown (Floating Card below capsule) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-white/95 dark:bg-card/95 backdrop-blur-xl p-5 shadow-2xl space-y-3 pointer-events-auto max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-border/60 space-y-2">
              {status === "authenticated" && user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-muted/50">
                    <div className="font-semibold text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full flex justify-center w-full py-2.5 gap-2 text-xs font-semibold bg-slate-900 dark:bg-primary text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                  </Link>
                  <Link
                    href="/me"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full flex justify-center w-full py-2.5 gap-2 text-xs font-semibold border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                    {locale === "th" ? "โปรไฟล์ส่วนตัว" : "My Profile"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="rounded-full flex justify-center w-full py-2.5 gap-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {locale === "th" ? "ออกจากระบบ" : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full flex justify-center w-full py-2.5 gap-2 text-xs font-semibold border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-muted"
                  >
                    {locale === "th" ? "เข้าสู่ระบบ" : "Login"}
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full flex justify-center w-full py-2.5 gap-2 text-xs font-semibold bg-slate-900 dark:bg-primary text-white"
                  >
                    <LogIn className="h-4 w-4" />
                    {locale === "th" ? "สำหรับเจ้าหน้าที่" : "Staff Portal"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content (With top padding so it floats beneath capsule navbar) */}
      <main className="flex-1 pt-24 sm:pt-28">{children}</main>

      {/* Footer (Modern Premium University/Enterprise Portal Style) */}
      <footer className="mt-24 border-t border-border/60 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-card/90 dark:to-background text-foreground relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[250px] rounded-full blur-[140px] opacity-20 dark:opacity-10 pointer-events-none"
          style={{ background: "var(--brand)" }}
        />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
            {/* Column 1: Brand, Tagline, Mission & Social (span 4) */}
            <div className="lg:col-span-4 space-y-5">
              <Link href="/portal" className="inline-flex items-center gap-3 group">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-10 w-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg tracking-tight leading-tight group-hover:text-primary transition-colors">
                    {orgName}
                  </span>
                  {(locale === "th" ? orgNameEn : orgNameTh) && (
                    <span className="text-xs font-medium text-muted-foreground leading-tight mt-0.5">
                      {locale === "th" ? orgNameEn : orgNameTh}
                    </span>
                  )}
                </div>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {locale === "th"
                  ? "ศูนย์กลางการศึกษา นวัตกรรมดิจิทัล และการบริหารจัดการวิชาการที่ทันสมัย เพื่อพัฒนาศักยภาพผู้เรียนสู่ความเป็นเลิศในระดับสากล"
                  : "Empowering academic excellence, continuous learning, and digital innovation for our faculty community."}
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {locale === "th" ? "ระบบบริการออนไลน์เปิดทำการปกติ" : "All Services Operational"}
              </div>

              {/* Social Channels */}
              <div className="pt-1 flex items-center gap-2.5">
                {facebookUrl && (
                  <a
                    href={facebookUrl.startsWith("http") ? facebookUrl : `https://${facebookUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-full bg-background border border-border/80 hover:border-primary hover:bg-primary hover:text-white flex items-center justify-center text-muted-foreground transition-all shadow-2xs"
                    aria-label="Facebook"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl.startsWith("http") ? youtubeUrl : `https://${youtubeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-full bg-background border border-border/80 hover:border-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center text-muted-foreground transition-all shadow-2xs"
                    aria-label="YouTube"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {lineUrl && (
                  <a
                    href={lineUrl.startsWith("http") ? lineUrl : lineUrl.startsWith("@") ? `https://line.me/R/ti/p/${lineUrl}` : `https://line.me/R/ti/p/@${lineUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-full bg-background border border-border/80 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-muted-foreground transition-all shadow-2xs"
                    aria-label="LINE Official"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.499.254l2.457 3.328V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Navigation & Services (span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">
                {locale === "th" ? "เมนูและบริการ" : "Explore & Services"}
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/portal" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                    {locale === "th" ? "หน้าหลักพอร์ทัล" : "Portal Home"}
                  </Link>
                </li>
                <li>
                  <Link href="/portal/news" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                    {t("portal.nav.news")}
                  </Link>
                </li>
                <li>
                  <Link href="/portal/personnel" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                    {t("portal.nav.personnel")}
                  </Link>
                </li>
                <li>
                  <Link href="/portal/curriculum" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                    {t("portal.nav.curriculum")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                    {locale === "th" ? "ระบบจัดการหลังบ้าน" : "Management Console"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links & Support (span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">
                {locale === "th" ? "ลิงก์ด่วน" : "Quick Links"}
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/portal" className="text-muted-foreground hover:text-primary transition-colors">
                    {locale === "th" ? "เกี่ยวกับองค์กร" : "About Us"}
                  </Link>
                </li>
                <li>
                  <Link href="/portal/personnel" className="text-muted-foreground hover:text-primary transition-colors">
                    {locale === "th" ? "รับสมัครนักศึกษา" : "Admissions"}
                  </Link>
                </li>
                <li>
                  <Link href="/portal/news" className="text-muted-foreground hover:text-primary transition-colors">
                    {locale === "th" ? "งานวิจัยและวิชาการ" : "Research & Grants"}
                  </Link>
                </li>
                <li>
                  <Link href="/portal/curriculum" className="text-muted-foreground hover:text-primary transition-colors">
                    {locale === "th" ? "ปฏิทินการศึกษา" : "Academic Calendar"}
                  </Link>
                </li>
                <li>
                  <Link href="/portal" className="text-muted-foreground hover:text-primary transition-colors">
                    {locale === "th" ? "ดาวน์โหลดแบบฟอร์ม" : "Downloads"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Location (span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">
                {locale === "th" ? "ติดต่อสอบถาม" : "Contact & Office"}
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="leading-snug hover:text-primary transition-colors hover:underline"
                    >
                      {address}
                    </a>
                  ) : (
                    <span className="leading-snug">{address}</span>
                  )}
                </div>
                {phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-primary transition-colors">{phone}</a>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <a href={`mailto:${email}`} className="hover:text-primary transition-colors truncate">
                      {email}
                    </a>
                  </div>
                )}
                {officeHours && (
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>{officeHours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Legal, Staff Console Pill */}
          <div className="mt-14 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span>
                © {new Date().getFullYear()} {orgName} ({orgNameEn || "Tak Sangha College"}). สงวนลิขสิทธิ์ทุกประการ
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-background border border-border/80 hover:border-primary hover:text-primary shadow-2xs transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                {locale === "th" ? "เข้าสู่ระบบบุคลากร (Staff Login)" : "Staff Login"}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
