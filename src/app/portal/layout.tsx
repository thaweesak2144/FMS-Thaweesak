"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogIn, LayoutDashboard, UserCheck, BookOpen, Newspaper, FileText, FileCheck, Award, PackageCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useAppSession } from "@/hooks/use-session";
import { useT, useLocale } from "@/shared/lib/i18n/client";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useT();
  const locale = useLocale();
  const { user, status } = useAppSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/portal", label: locale === "th" ? "หน้าหลัก" : "Home" },
    { href: "/portal/news", label: t("portal.nav.news") },
    { href: "/portal/personnel", label: t("portal.nav.personnel") },
    { href: "/portal/curriculum", label: t("portal.nav.curriculum") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top Banner / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/portal" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight leading-none group-hover:text-primary transition-colors">
                {t("app.name")}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {t("app.tagline")}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/portal" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 border-b-2 ${
                    active
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Lang Switcher & Login / Admin Console */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />

            {status === "authenticated" && user ? (
              <Link href="/dashboard">
                <Button size="sm" variant="default" className="gap-2 text-xs">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline" className="gap-2 text-xs">
                  <LogIn className="h-3.5 w-3.5" />
                  {locale === "th" ? "เข้าสู่ระบบเจ้าหน้าที่" : "Staff Login"}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b bg-background px-4 pt-2 pb-4 space-y-2">
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
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    {locale === "th" ? "เข้าสู่ระบบเจ้าหน้าที่" : "Staff Login"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>© {new Date().getFullYear()} {t("app.name")}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/portal/personnel" className="hover:underline">
              {t("portal.nav.personnel")}
            </Link>
            <Link href="/login" className="hover:underline">
              {locale === "th" ? "เข้าสู่ระบบ" : "Login"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
