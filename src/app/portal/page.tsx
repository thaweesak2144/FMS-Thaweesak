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
import { Hero3DScene } from "./_components/hero-3d-scene";

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

          {/* Right Column: 3D Interactive Animated Scene (Etail Dribbble Style) */}
          <div className="lg:col-span-6 flex items-center justify-center pt-4 lg:pt-0">
            <Hero3DScene orgName={orgName} locale={locale} />
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
