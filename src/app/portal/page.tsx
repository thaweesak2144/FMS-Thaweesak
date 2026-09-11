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
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";
import { getT, getLocale } from "@/i18n/server";
import { Button } from "@/components/ui/button";
import { resolveTenantSettings } from "@/features/identity/server";

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
    <div className="space-y-20 py-6 sm:py-10">
      {/* 3D Animated Hero Section (Etail Dribbble Style) */}
      <section className="relative overflow-hidden rounded-[2.5rem] mx-4 sm:mx-8 border border-border/60 bg-gradient-to-b from-card/90 via-card/40 to-background shadow-2xl backdrop-blur-xl">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 -right-24 w-[30rem] h-[30rem] bg-primary/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-14 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Live Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <GraduationCap className="h-4 w-4" />
              <span className="font-bold">{orgName}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80 font-medium">Digital Campus Experience</span>
            </div>

            {/* Main Headline with Gradient Text */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              {locale === "th" ? (
                <>
                  เชื่อมต่อทุกมิติการศึกษา <br />
                  สู่ <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">อนาคตดิจิทัล</span> ไร้ขีดจำกัด
                </>
              ) : (
                <>
                  Empowering Education <br />
                  Through <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Digital Innovation</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {locale === "th"
                ? "ศูนย์กลางการเรียนรู้ บริการการศึกษา และสารสนเทศอัจฉริยะสำหรับคณาจารย์ นิสิตนักศึกษา และประชาชน เพื่อก้าวสู่ความเป็นเลิศระดับสากล"
                : "A comprehensive modern platform delivering seamless academic, research, and institutional services for students, faculty, and the public."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link href="/portal/personnel">
                <Button size="lg" className="rounded-full px-8 h-12 gap-2 text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all">
                  <Users className="h-4 w-4" />
                  {t("portal.nav.personnel")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="rounded-full px-7 h-12 text-sm font-semibold border-border/80 hover:bg-muted/80 backdrop-blur-md transition-all">
                  <LayoutDashboard className="h-4 w-4 mr-2 text-primary" />
                  {locale === "th" ? "เข้าสู่ระบบหลังบ้าน" : "Staff Console"}
                </Button>
              </Link>
            </div>

            {/* Metrics Counter Bar */}
            <div className="pt-6 border-t border-border/40 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">10+</div>
                <div className="text-xs text-muted-foreground mt-0.5">{locale === "th" ? "หลักสูตรมาตรฐาน" : "Programs"}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">1,500+</div>
                <div className="text-xs text-muted-foreground mt-0.5">{locale === "th" ? "นิสิต & บุคลากร" : "Community"}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">99.8%</div>
                <div className="text-xs text-muted-foreground mt-0.5">{locale === "th" ? "ความพึงพอใจ" : "Satisfaction"}</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Animated Perspective Showcase */}
          <div className="lg:col-span-5 relative [perspective:1200px] flex items-center justify-center lg:justify-end pt-4 lg:pt-0">
            {/* Main 3D Card Showcase */}
            <div className="relative w-full max-w-[440px] rounded-2xl border border-border/70 bg-card/90 shadow-2xl backdrop-blur-xl p-5 [transform:rotateY(-8deg)_rotateX(6deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-all duration-700 ease-out group">
              {/* Card Glow Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/15 via-transparent to-primary/10 pointer-events-none" />

              {/* Browser Mockup Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border/40">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="px-2.5 py-0.5 rounded-md bg-muted/60 text-[10px] font-mono text-muted-foreground flex items-center gap-1.5 border border-border/30">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  portal.faculty.edu
                </div>
                <div className="w-6" />
              </div>

              {/* Interactive Card Body */}
              <div className="pt-4 space-y-3.5">
                {/* Real-time Status Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-muted/40 border border-primary/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{locale === "th" ? "บริการออนไลน์แบบเรียลไทม์" : "Active Services"}</div>
                        <div className="text-[10px] text-muted-foreground">{locale === "th" ? "พร้อมให้บริการ 24 ชม." : "Online 24/7"}</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      99.9% Uptime
                    </span>
                  </div>

                  {/* Activity Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] font-medium">
                      <span>{locale === "th" ? "ระบบบริการดิจิทัล" : "Digital Platform Activity"}</span>
                      <span className="text-primary font-bold">94%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: "94%" }} />
                    </div>
                  </div>
                </div>

                {/* Sub-cards Grid inside mockup */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl border border-border/50 bg-background/60 backdrop-blur-sm hover:border-primary/40 transition-colors">
                    <BookOpen className="h-4 w-4 text-primary mb-1" />
                    <div className="text-xs font-bold">{locale === "th" ? "หลักสูตรทันสมัย" : "Curriculums"}</div>
                    <div className="text-[10px] text-muted-foreground">{locale === "th" ? "มาตรฐานสากล" : "Accredited"}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-border/50 bg-background/60 backdrop-blur-sm hover:border-primary/40 transition-colors">
                    <Award className="h-4 w-4 text-primary mb-1" />
                    <div className="text-xs font-bold">{locale === "th" ? "คณาจารย์เชี่ยวชาญ" : "Faculty Staff"}</div>
                    <div className="text-[10px] text-muted-foreground">{locale === "th" ? "ทำเนียบบุคลากร" : "Full Directory"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Satellite 3D Card 1 (Top-Right) */}
            <div className="absolute -top-5 -right-3 sm:-right-5 p-3 rounded-2xl border border-primary/30 bg-card/95 shadow-xl backdrop-blur-xl animate-float-slow hidden sm:flex items-center gap-2.5 max-w-[210px] z-20">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground leading-tight">{locale === "th" ? "นวัตกรรม 3D & AI" : "3D & AI Driven"}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{locale === "th" ? "ขับเคลื่อนการศึกษา" : "Smart Campus"}</div>
              </div>
            </div>

            {/* Floating Satellite 3D Card 2 (Bottom-Left) */}
            <div className="absolute -bottom-6 -left-3 sm:-left-6 p-3 rounded-2xl border border-border/70 bg-card/95 shadow-xl backdrop-blur-xl animate-float-reverse hidden sm:flex items-center gap-3 z-20">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">A</div>
                <div className="w-7 h-7 rounded-full border-2 border-background bg-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">B</div>
                <div className="w-7 h-7 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">+5k</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <Star className="h-3 w-3 fill-amber-500" />
                  <span className="font-bold text-foreground text-xs">4.9</span>
                  <span className="text-[10px] text-muted-foreground">/5.0</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-medium">{locale === "th" ? "ความพึงพอใจการบริการ" : "Student Rating"}</div>
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
