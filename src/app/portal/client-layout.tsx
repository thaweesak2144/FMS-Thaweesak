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
      {/* Top Banner / Navbar */}
      <header className="nav glass">
        <div className="nav-in">
          {/* Brand Logo */}
          <Link href="/portal" className="brand group flex items-center">
            {logoUrl ? <img src={logoUrl} alt="Logo" style={{ height: "2rem", width: "2rem", objectFit: "contain", marginRight: "10px" }} className="group-hover:scale-105 transition-transform" /> : <i className="group-hover:scale-105 transition-transform"><GraduationCap className="h-5 w-5" /></i>}
            <div className="flex flex-col ml-1">
              <span className="font-bold text-base tracking-tight leading-none group-hover:text-primary transition-colors">{orgName}</span>
              <span className="text-xs text-muted-foreground mt-0.5 font-normal">{t("app.tagline")}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/portal" && pathname.startsWith(link.href));
              return (
                <li key={link.href} className={active ? "on" : ""}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              );
            })}
          </ul>

          {/* Actions: Lang Switcher & Login / Admin Console */}
          <div className="right hidden sm:flex">
            <button
              type="button"
              className="icon-btn"
              aria-label={t("nav.themeToggle") || "Toggle theme"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              )}
            </button>
            <LanguageSwitcher />
            {status === "authenticated" && user ? (
              <div className="acct">
              <DropdownMenuPrimitive.Root>
                <DropdownMenuPrimitive.Trigger asChild>
                  <button type="button">
                    <span className="who" aria-hidden="true">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        initials
                      )}
                    </span>
                    <span className="nm">{user.name}</span>
                    <svg className="chev" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuPrimitive.Portal>
                  <DropdownMenuPrimitive.Content className="menu-list" align="end" sideOffset={12} style={{ position: "static" }}>
                    <div className="h px-3 py-2 border-b mb-1">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    <DropdownMenuPrimitive.Item asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-sm outline-none">
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                      </Link>
                    </DropdownMenuPrimitive.Item>
                    <DropdownMenuPrimitive.Item asChild>
                      <Link href="/me" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-sm outline-none">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {locale === "th" ? "โปรไฟล์ส่วนตัว" : "My Profile"}
                      </Link>
                    </DropdownMenuPrimitive.Item>
                    <div className="my-1 border-t" aria-hidden="true" />
                    <DropdownMenuPrimitive.Item asChild>
                      <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-sm outline-none text-red-500 hover:text-red-600">
                        <LogOut className="h-4 w-4" />
                        {locale === "th" ? "ออกจากระบบ" : "Logout"}
                      </button>
                    </DropdownMenuPrimitive.Item>
                  </DropdownMenuPrimitive.Content>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenuPrimitive.Root>
            </div>
            ) : (
              <Link href="/login" className="btn-outline text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all">
                <LogIn className="h-3.5 w-3.5" />
                {locale === "th" ? "เข้าสู่ระบบเจ้าหน้าที่" : "Staff Login"}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden ml-auto">
            <button
              type="button"
              className="icon-btn"
              aria-label={t("nav.themeToggle") || "Toggle theme"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              )}
            </button>
            <LanguageSwitcher />
            <button type="button" className="icon-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b bg-background px-4 pt-2 pb-4 space-y-2 absolute top-[64px] w-full shadow-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2">
              {status === "authenticated" && user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2 border-b border-muted">
                    <div className="font-semibold text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary flex justify-center w-full py-2 gap-2 rounded-md mt-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                  </Link>
                  <Link href="/me" onClick={() => setMobileMenuOpen(false)} className="btn-outline flex justify-center w-full py-2 gap-2 rounded-md">
                    <User className="h-4 w-4" />
                    {locale === "th" ? "โปรไฟล์ส่วนตัว" : "My Profile"}
                  </Link>
                  <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="btn-outline flex justify-center w-full py-2 gap-2 rounded-md !text-red-500 !border-red-200 hover:!bg-red-50">
                    <LogOut className="h-4 w-4" />
                    {locale === "th" ? "ออกจากระบบ" : "Logout"}
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-outline flex justify-center w-full py-2 gap-2 rounded-md">
                  <LogIn className="h-4 w-4" />
                  {locale === "th" ? "เข้าสู่ระบบเจ้าหน้าที่" : "Staff Login"}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

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
