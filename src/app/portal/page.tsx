import Link from "next/link";
import {
  GraduationCap,
  Users,
  BookOpen,
  Newspaper,
  Award,
  FileText,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";
import { getT, getLocale } from "@/i18n/server";
import { resolveTenantSettings } from "@/features/identity/server";
import { HeroSearchBar } from "./_components/hero-search-bar";

export default async function PortalHomePage() {
  const t = await getT();
  const locale = await getLocale();
  const settings = await resolveTenantSettings();
  const orgName = (locale === "th" ? settings?.nameTh : settings?.nameEn) || settings?.nameTh || settings?.nameEn || t("app.name");

  const features = [
    {
      title: locale === "th" ? "คณาจารย์และบุคลากร" : "Faculty & Staff",
      desc: locale === "th" ? "ทำเนียบอาจารย์ผู้เชี่ยวชาญและเจ้าหน้าที่ประจำคณะ" : "Faculty members, researchers, and supportive staff directory",
      href: "/portal/personnel",
      icon: Users,
      badge: locale === "th" ? "พร้อมใช้งาน" : "Ready",
      active: true,
    },
    {
      title: locale === "th" ? "ข่าวสารประชาสัมพันธ์" : "News & PR",
      desc: locale === "th" ? "ติดตามข่าวสาร กิจกรรม และประกาศสำคัญของคณะ" : "Stay updated with faculty announcements and events",
      href: "/portal/news",
      icon: Newspaper,
      badge: locale === "th" ? "พร้อมใช้งาน" : "Ready",
      active: true,
    },
    {
      title: locale === "th" ? "หลักสูตรการศึกษา" : "Academic Programs",
      desc: locale === "th" ? "หลักสูตรระดับปริญญาตรี ปริญญาโท และปริญญาเอก" : "Undergraduate, Master, and Doctoral degree programs",
      href: "/portal/curriculum",
      icon: BookOpen,
      badge: locale === "th" ? "พร้อมใช้งาน" : "Ready",
      active: true,
    },
    {
      title: locale === "th" ? "รับสมัครนิสิตใหม่" : "Admissions",
      desc: locale === "th" ? "ข้อมูลการรับสมัคร รอบการสมัคร และผลการคัดเลือก" : "Admission rounds, criteria, and applicant results",
      href: "/portal/personnel",
      icon: Award,
      badge: locale === "th" ? "เร็วๆ นี้" : "Coming Soon",
      active: false,
    },
    {
      title: locale === "th" ? "งานวิจัยและนวัตกรรม" : "Research & Publications",
      desc: locale === "th" ? "ผลงานวิจัย บทความวิชาการ และโครงการวิจัยระดับสากล" : "Academic research projects, journals, and innovations",
      href: "/portal/personnel",
      icon: Sparkles,
      badge: locale === "th" ? "เร็วๆ นี้" : "Coming Soon",
      active: false,
    },
    {
      title: locale === "th" ? "บริการคำร้องออนไลน์" : "Student Services",
      desc: locale === "th" ? "ยื่นคำร้อง ติดตามสถานะ และบริการนักศึกษาแบบเบ็ดเสร็จ" : "Online petition submission and student request tracking",
      href: "/portal/personnel",
      icon: FileText,
      badge: locale === "th" ? "เร็วๆ นี้" : "Coming Soon",
      active: false,
    },
  ];

  return (
    <div className="space-y-16 py-4 sm:py-6">
      {/* 3D Etail Animated Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] mx-4 sm:mx-8 border border-slate-200/80 dark:border-border/60 bg-[#fbfbfd] dark:bg-card/40 shadow-2xl min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Ambient Studio Light Glows */}
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-primary/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/2 -right-32 w-[34rem] h-[34rem] bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

        {/* Content Container */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-12 sm:py-16 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Typography, Tagline, and Interactive Pill Search */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Live Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold backdrop-blur-md shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{orgName}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80 font-medium">Digital Campus 2026</span>
            </div>

            {/* Giant Bold Headline matching Etail reference */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.06]">
              {locale === "th" ? (
                <>
                  ก้าวสู่ <br />
                  <span className="text-primary">อนาคตใหม่</span> <br />
                  การศึกษาดิจิทัล!
                </>
              ) : (
                <>
                  Empower <br />
                  <span className="text-primary">Your Future</span> <br />
                  Digitally!
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md font-normal">
              {locale === "th"
                ? "เชื่อมต่อทุกมิติการเรียนรู้ ข้อมูลหลักสูตร บุคลากร และบริการคำร้องออนไลน์แบบครบวงจร สะดวก รวดเร็ว ตลอด 24 ชั่วโมง"
                : "Comprehensive academic management, research programs, staff directory, and online digital services all in one place."}
            </p>

            {/* Interactive Floating Pill Search Bar (matching Etail reference) */}
            <div className="pt-2 space-y-3">
              <HeroSearchBar
                orgName={orgName}
                placeholder={locale === "th" ? "ค้นหาหลักสูตร, บุคลากร, ข่าวสาร..." : "Search courses, staff, news..."}
              />
              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <Link
                  href="/portal/curriculum"
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-muted/70 hover:bg-primary hover:text-primary-foreground text-slate-600 dark:text-slate-300 font-medium transition-all flex items-center gap-1.5 border border-slate-200/60 dark:border-border/60 shadow-xs"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  {locale === "th" ? "หลักสูตรทั้งหมด" : "Academic Programs"}
                </Link>
                <Link
                  href="/portal/personnel"
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-muted/70 hover:bg-primary hover:text-primary-foreground text-slate-600 dark:text-slate-300 font-medium transition-all flex items-center gap-1.5 border border-slate-200/60 dark:border-border/60 shadow-xs"
                >
                  <Users className="h-3.5 w-3.5" />
                  {locale === "th" ? "ทำเนียบคณาจารย์" : "Faculty Directory"}
                </Link>
                <Link
                  href="/portal/news"
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-muted/70 hover:bg-primary hover:text-primary-foreground text-slate-600 dark:text-slate-300 font-medium transition-all flex items-center gap-1.5 border border-slate-200/60 dark:border-border/60 shadow-xs"
                >
                  <Newspaper className="h-3.5 w-3.5" />
                  {locale === "th" ? "ข่าวสารล่าสุด" : "Latest News"}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Isometric Scene (Etail Style High-Fidelity 3D Render) */}
          <div className="lg:col-span-6 relative [perspective:1200px] flex items-center justify-center pt-4 lg:pt-0">
            {/* Main 3D Card Display */}
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/15 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-card/90 dark:to-card/60 transition-all duration-700 hover:scale-[1.02] group">
              {/* Studio Backdrop with the 3D Render */}
              <div className="relative w-full aspect-[16/11] overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-200/50 dark:from-slate-900/60 dark:to-slate-950/80">
                <img
                  src="/images/hero_3d_campus.jpg"
                  alt="3D Campus Scene"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Ambient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                {/* ═══ Conveyor Belt Animation Overlay (Etail Style) ═══ */}
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                  {/* Belt Track Surface */}
                  <div
                    className="relative h-12 sm:h-14 w-full animate-belt-scroll"
                    style={{
                      background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.70) 100%)",
                      backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 30px)",
                      backgroundSize: "30px 100%",
                    }}
                  >
                    {/* Left Roller */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-700/80 border-2 border-primary/50 shadow-inner flex items-center justify-center">
                      <div className="animate-roller w-2 h-2 rounded-full border border-primary/60 border-t-primary" />
                    </div>
                    {/* Right Roller */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-700/80 border-2 border-primary/50 shadow-inner flex items-center justify-center">
                      <div className="animate-roller w-2 h-2 rounded-full border border-primary/60 border-t-primary" />
                    </div>

                    {/* Moving Items Container */}
                    <div className="absolute inset-0 overflow-hidden flex items-center px-8">
                      <div className="flex items-center gap-6 sm:gap-10 animate-conveyor whitespace-nowrap">
                        {/* ── Set 1 ── */}
                        <div className="flex items-center gap-2 animate-conveyor-item">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "หลักสูตร" : "Curriculum"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 animate-conveyor-item-delay-1">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "บุคลากร" : "Faculty"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 animate-conveyor-item-delay-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "คำร้อง" : "Petition"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 animate-conveyor-item-delay-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M4 12H2"/><path d="M4 18H2"/><path d="M4 6H2"/><path d="M8 11V7"/><path d="M8 13v2"/><path d="M12 7h6"/><path d="M12 11h6"/><path d="M12 15h6"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "ข่าวสาร" : "News"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 animate-conveyor-item-delay-4">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-violet-500/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "งานวิจัย" : "Research"}
                          </span>
                        </div>
                        {/* ── Separator ── */}
                        <div className="w-px h-8 bg-white/20 shrink-0 mx-2" />
                        {/* ── Set 2 (duplicate for seamless loop) ── */}
                        <div className="flex items-center gap-2 animate-conveyor-item">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "หลักสูตร" : "Curriculum"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 animate-conveyor-item-delay-1">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "บุคลากร" : "Faculty"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 animate-conveyor-item-delay-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "คำร้อง" : "Petition"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 animate-conveyor-item-delay-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M4 12H2"/><path d="M4 18H2"/><path d="M4 6H2"/><path d="M8 11V7"/><path d="M8 13v2"/><path d="M12 7h6"/><path d="M12 11h6"/><path d="M12 15h6"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "ข่าวสาร" : "News"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 animate-conveyor-item-delay-4">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-violet-500/80 backdrop-blur text-white flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white/90 leading-tight">
                            {locale === "th" ? "งานวิจัย" : "Research"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Belt top edge highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                  </div>
                </div>
              </div>

              {/* Bottom Live Status Bar */}
              <div className="px-6 py-3.5 bg-white/95 dark:bg-card/95 border-t border-slate-100 dark:border-border/40 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {locale === "th" ? "ศูนย์กลางข้อมูลและบริการดิจิทัล 24 ชม." : "24/7 Digital Services Hub"}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart Campus
                </span>
              </div>
            </div>

            {/* Floating Satellite 3D Badge 1 (Top-Right): 3D Animation Bob */}
            <div className="absolute -top-4 -right-2 sm:-right-4 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-card/95 border border-primary/25 shadow-xl shadow-slate-900/10 backdrop-blur-xl animate-float-slow z-30 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {locale === "th" ? "นวัตกรรม 3D & AI" : "3D Animated Hub"}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium">
                  {locale === "th" ? "ขับเคลื่อนการศึกษา" : "Smart Campus"}
                </div>
              </div>
            </div>

            {/* Floating Satellite 3D Badge 2 (Bottom-Left): Reverse Float Bob */}
            <div className="absolute -bottom-5 -left-2 sm:-left-5 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-card/95 border border-slate-200/80 dark:border-border/60 shadow-xl shadow-slate-900/10 backdrop-blur-xl animate-float-reverse z-30 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">A</div>
                <div className="w-7 h-7 rounded-full border-2 border-white bg-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">B</div>
                <div className="w-7 h-7 rounded-full border-2 border-white bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">+5k</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <Star className="h-3 w-3 fill-amber-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs">4.9</span>
                  <span className="text-[10px] text-muted-foreground">/5.0</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-medium">
                  {locale === "th" ? "ความพึงพอใจการบริการ" : "Student Satisfaction"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Highlights Bar (Etail Style Feature Metrics) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-slate-200/80 dark:border-border/60 bg-white/80 dark:bg-card/80 backdrop-blur-md p-5 shadow-lg shadow-black/5 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                {locale === "th" ? "มาตรฐานระดับองค์กร" : "Enterprise Security"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {locale === "th" ? "ระบบจัดการสิทธิ์และปกป้องข้อมูลตามมาตรฐานสากล" : "Role-based access control and high security standards"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-border/60 bg-white/80 dark:bg-card/80 backdrop-blur-md p-5 shadow-lg shadow-black/5 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                {locale === "th" ? "บริการดิจิทัล 24 ชม." : "24/7 Digital Services"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {locale === "th" ? "ยื่นคำร้อง ติดตามสถานะ และเข้าถึงข้อมูลได้ทุกที่ทุกเวลา" : "Anytime online petitions, requests and directories"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-border/60 bg-white/80 dark:bg-card/80 backdrop-blur-md p-5 shadow-lg shadow-black/5 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                {locale === "th" ? "นวัตกรรมเพื่อการเรียนรู้" : "Smart Academic Hub"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {locale === "th" ? "หลักสูตรทันสมัยและงานวิจัยที่ตอบโจทย์ยุคดิจิทัล" : "Modern curriculum and impactful academic research"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {locale === "th" ? "ระบบบริการและโมดูลทั้งหมดของคณะ" : "Faculty Services & Portals"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === "th"
              ? "เข้าถึงข้อมูลหลักสูตร งานวิจัย ข่าวสาร และคำร้องต่าง ๆ ได้อย่างสะดวก รวดเร็ว"
              : "Seamless access to faculty information, directories, news, and services."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        item.active
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t">
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
                  >
                    {locale === "th" ? "เข้าใช้งาน" : "Explore"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
