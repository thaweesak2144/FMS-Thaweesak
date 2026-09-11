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
      {/* 3D Etail Style Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] mx-4 sm:mx-8 border border-border/60 bg-[#f8f9fa] dark:bg-card/40 shadow-2xl min-h-[580px] lg:min-h-[660px] flex items-center">
        {/* 3D Background Image */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover pointer-events-none"
          style={{
            backgroundImage: "url('/images/hero_3d_campus.jpg')",
            backgroundPosition: "right 15% center",
          }}
        />
        {/* Soft Vignette / Gradient Overlay to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/85 to-transparent/10 dark:from-background dark:via-background/90 dark:to-transparent/30 pointer-events-none" />

        {/* Ambient Theme Glow on bottom left */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Content Container */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-20 py-16 sm:py-24 max-w-7xl w-full">
          <div className="max-w-xl space-y-6 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{orgName}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80 font-medium">Digital Campus 2026</span>
            </div>

            {/* Giant Bold Headline matching Etail reference */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.06]">
              {locale === "th" ? (
                <>
                  ก้าวสู่ <br />
                  <span className="text-primary">อนาคตใหม่</span> <br />
                  การศึกษาดิจิทัล
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
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              {locale === "th"
                ? "เชื่อมต่อทุกมิติการเรียนรู้ ข้อมูลหลักสูตร บุคลากร และบริการคำร้องออนไลน์แบบครบวงจร สะดวก รวดเร็ว ตลอด 24 ชั่วโมง"
                : "Comprehensive academic management, research programs, staff directory, and online digital services all in one place."}
            </p>

            {/* Bottom Floating Pill Input Search Bar (matching Etail reference) */}
            <div className="pt-2">
              <HeroSearchBar
                orgName={orgName}
                placeholder={locale === "th" ? "ค้นหาหลักสูตร, บุคลากร, ข่าวสาร..." : "Search courses, staff, news..."}
              />
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
