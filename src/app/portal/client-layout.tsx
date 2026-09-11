"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogIn, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useAppSession } from "@/hooks/use-session";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";

export default function PortalClientLayout({
  children,
  logoUrl,
  orgNameTh,
  orgNameEn,
}: {
  children: React.ReactNode;
  logoUrl?: string | null;
  orgNameTh?: string | null;
  orgNameEn?: string | null;
}) {
  const pathname = usePathname();
  const t = useT();
  const locale = useLocale();
  const { user, status } = useAppSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const initials = (user?.name ?? "?").trim().charAt(0).toUpperCase() || "?";
  const orgName = (locale === "th" ? orgNameTh : orgNameEn) || orgNameTh || orgNameEn || t("app.name");

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
                className="h-8 w-8 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="h-4 w-4" />
              </div>
            )}
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {orgName}
            </span>
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

      {/* Footer */}
      <footer>
        <div className="foot-in">
          <div>
            <Link href="/portal" className="brand flex items-center">
              {logoUrl ? <img src={logoUrl} alt="Logo" style={{ height: "2rem", width: "2rem", objectFit: "contain", marginRight: "10px" }} /> : <i><GraduationCap className="h-5 w-5" /></i>}
              <div className="flex flex-col ml-1">
                <span className="font-bold text-base tracking-tight leading-none">{orgName}</span>
              </div>
            </Link>
            <p className="foot-tag">{t("app.tagline")}</p>
          </div>
          
          <div>
            <h4>{locale === "th" ? "เมนูหลัก" : "Main Menu"}</h4>
            <ul>
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{locale === "th" ? "สำหรับเจ้าหน้าที่" : "For Staff"}</h4>
            <ul>
              <li>
                <Link href="/login">
                  {locale === "th" ? "เข้าสู่ระบบ (Admin Console)" : "Staff Login (Admin Console)"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="foot-bottom">
          <div className="foot-bottom-in">
            <span>© {new Date().getFullYear()} {orgName}. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
