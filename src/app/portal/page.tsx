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
            <div className="pt-2">
              <HeroSearchBar
                orgName={orgName}
                placeholder={locale === "th" ? "ค้นหาหลักสูตร, บุคลากร, ข่าวสาร..." : "Search courses, staff, news..."}
              />
            </div>
          </div>

          {/* Right Column: 3D Isometric Scene (Etail Style with Students & Campus) */}
          <div className="lg:col-span-6 relative [perspective:1200px] flex items-center justify-center pt-4 lg:pt-0">
            {/* Main 3D Card Display */}
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/15 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-card/90 dark:to-card/60 transition-all duration-700 hover:scale-[1.02] group animate-shimmer">
              {/* Studio Backdrop with Soft Lighting & Grid Lines */}
              <div className="relative w-full aspect-[16/11] overflow-hidden flex items-end justify-center bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-200/50 dark:from-slate-900/60 dark:to-slate-950/80 p-6">
                {/* 3D Isometric Floor Grid (Clay Style) */}
                <div 
                  className="absolute inset-x-0 bottom-0 h-48 opacity-30 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(to right, var(--brand) 1px, transparent 1px), linear-gradient(to bottom, var(--brand) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                    transform: "perspective(500px) rotateX(60deg)",
                    transformOrigin: "bottom center",
                  }}
                />

                {/* 3D Isometric Clay Building (Center-Right) */}
                <div className="absolute right-6 sm:right-10 bottom-8 z-10 flex flex-col items-center">
                  {/* Roof & Main Hall */}
                  <div className="relative w-36 sm:w-44 h-44 sm:h-52 rounded-2xl bg-white dark:bg-card border-2 border-slate-200 dark:border-border/80 shadow-2xl flex flex-col justify-between overflow-hidden">
                    {/* Architectural Accent Canopy */}
                    <div className="h-4 w-full bg-primary flex items-center justify-center">
                      <span className="text-[9px] font-bold text-primary-foreground tracking-wider uppercase">{orgName}</span>
                    </div>

                    {/* Window Arc Glass */}
                    <div className="mx-auto my-auto w-16 h-24 rounded-t-full border-2 border-primary/30 bg-gradient-to-b from-primary/15 to-transparent flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary opacity-80" />
                    </div>

                    {/* Entrance Door & Steps */}
                    <div className="w-full flex flex-col items-center">
                      <div className="w-12 h-10 rounded-t-md bg-slate-800 dark:bg-slate-900 border border-slate-700" />
                      <div className="w-20 h-2 bg-slate-300 dark:bg-slate-700 rounded-t-sm" />
                    </div>
                  </div>

                  {/* 3D Campus Bench in front of building */}
                  <div className="relative -mt-3 z-20 flex items-center justify-center">
                    <div className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md text-[10px] text-muted-foreground flex items-center gap-1">
                      <span>ม้านั่งพักผ่อนหน้าอาคาร</span>
                    </div>
                  </div>
                </div>

                {/* 3D Conveyor Belt (สายพานลำเลียงแห่งการเรียนรู้) */}
                <div className="absolute left-4 sm:left-8 bottom-3 sm:bottom-4 z-10 w-44 sm:w-56 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-inner overflow-hidden flex items-center">
                  <div className="flex gap-4 animate-conveyor whitespace-nowrap text-[9px] font-mono font-bold text-muted-foreground">
                    <span>• เส้นทางการเรียนรู้สู่ความสำเร็จ</span>
                    <span>• นวัตกรรมแห่งอนาคต</span>
                    <span>• เส้นทางการเรียนรู้สู่ความสำเร็จ</span>
                    <span>• นวัตกรรมแห่งอนาคต</span>
                  </div>
                </div>

                {/* 3D Student Boy in Uniform (Left side on the journey) */}
                <div className="absolute left-6 sm:left-10 bottom-6 z-20 w-32 sm:w-40 transition-transform duration-500 hover:scale-105">
                  <img
                    src="/images/3d/student-boy.png"
                    alt="นิสิตปัจจุบัน"
                    className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)] filter"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-card border border-slate-200 dark:border-border text-[10px] font-bold text-slate-800 dark:text-slate-200 shadow-md whitespace-nowrap">
                    นิสิตปัจจุบัน
                  </div>
                </div>

                {/* 3D Graduate Student in Gown (Center/Right near building) */}
                <div className="absolute left-32 sm:left-44 bottom-6 z-25 w-32 sm:w-40 transition-transform duration-500 hover:scale-105">
                  <img
                    src="/images/3d/graduate-boy.png"
                    alt="บัณฑิตเกียรตินิยม"
                    className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)] filter"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-md whitespace-nowrap flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    บัณฑิตสำเร็จการศึกษา
                  </div>
                </div>
              </div>

              {/* Bottom Live Status Bar */}
              <div className="px-6 py-3.5 bg-white/90 dark:bg-card/90 border-t border-slate-100 dark:border-border/40 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {locale === "th" ? "จำลองบรรยากาศการศึกษาและบัณฑิตแห่งอนาคต" : "Future-Ready Campus & Graduates"}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart Education
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
