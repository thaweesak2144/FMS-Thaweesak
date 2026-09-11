"use client";

import Link from "next/link";
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
} from "lucide-react";
import { HeroSearchBar } from "./hero-search-bar";

interface AssistHeroProps {
  orgName: string;
  locale: string;
}

export function AssistHero({ orgName, locale }: AssistHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] mx-4 sm:mx-8 border border-border/60 bg-gradient-to-b from-background via-background/95 to-muted/20 dark:from-card/40 dark:to-background shadow-2xl min-h-[620px] lg:min-h-[680px] flex items-center">
      {/* Background Ambient Aura Glows (Theme-Reactive via bg-primary) */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-primary/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute top-1/2 -right-24 w-[36rem] h-[36rem] bg-primary/20 rounded-full blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />

      <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Social proof, Hero Display Title, Copy, and CTAs */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Social Proof Capsule Badge */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-background/80 dark:bg-card/80 border border-border/80 shadow-xs backdrop-blur-md">
            {/* User Avatar Collage */}
            <div className="flex -space-x-2 select-none shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face"
                alt="User"
                className="w-6 h-6 rounded-full border-2 border-background object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                alt="User"
                className="w-6 h-6 rounded-full border-2 border-background object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
                alt="User"
                className="w-6 h-6 rounded-full border-2 border-background object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
                alt="User"
                className="w-6 h-6 rounded-full border-2 border-background object-cover"
              />
            </div>
            <span className="text-xs text-foreground/80">
              {locale === "th" ? (
                <>
                  เข้าถึงบริการโดย <b className="font-bold text-foreground">นิสิต คณาจารย์ & บุคลากร</b>
                </>
              ) : (
                <>
                  Trusted by <b className="font-bold text-foreground">Students, Faculty & Staff</b>
                </>
              )}
            </span>
          </div>

          {/* Main Display Title (Assist Hero Typography) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.10]">
            {locale === "th" ? (
              <>
                ศูนย์รวมบริการดิจิทัล <br />
                <span className="text-primary font-black">
                  {orgName}
                </span>
              </>
            ) : (
              <>
                Your All in One <br />
                <span className="text-primary font-black">
                  {orgName} Portal
                </span>
              </>
            )}
          </h1>

          {/* Body Paragraph */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg font-normal">
            {locale === "th"
              ? "เชื่อมต่อทุกมิติการศึกษา ค้นหาข้อมูลหลักสูตร ทำเนียบคณาจารย์ งานวิจัย ข่าวสาร และบริการคำร้องออนไลน์ สะดวก รวดเร็ว ตลอด 24 ชั่วโมง"
              : "Comprehensive academic curricula, verified faculty directories, university news, and digital student services in one modern portal."}
          </p>

          {/* Action Button Container */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {/* Primary Action Button */}
            <Link
              href="/portal/curriculum"
              className="group pl-6 pr-2.5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 transition-all flex items-center gap-3.5 w-fit"
            >
              <span>{locale === "th" ? "สำรวจระบบบริการ" : "Explore Portal"}</span>
              <span className="w-8 h-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            {/* Secondary Link Button */}
            <Link
              href="/login"
              className="group flex items-center gap-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors py-2 px-4 rounded-2xl border border-border/80 hover:border-primary/40 bg-background/60 hover:bg-muted/80 backdrop-blur-sm shadow-xs"
            >
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span>{locale === "th" ? "สำหรับเจ้าหน้าที่" : "Staff Console"}</span>
            </Link>
          </div>

          {/* Interactive Search Bar & Chips */}
          <div className="pt-2 space-y-3">
            <HeroSearchBar
              orgName={orgName}
              placeholder={locale === "th" ? "ค้นหาหลักสูตร, บุคลากร, ข่าวสาร..." : "Search courses, staff, news..."}
            />

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <Link
                href="/portal/curriculum"
                className="px-3 py-1.5 rounded-full bg-muted/70 hover:bg-primary hover:text-primary-foreground text-muted-foreground hover:text-primary-foreground font-medium transition-all flex items-center gap-1.5 border border-border/60 shadow-xs"
              >
                <BookOpen className="h-3.5 w-3.5" />
                {locale === "th" ? "หลักสูตรทั้งหมด" : "Academic Programs"}
              </Link>
              <Link
                href="/portal/personnel"
                className="px-3 py-1.5 rounded-full bg-muted/70 hover:bg-primary hover:text-primary-foreground text-muted-foreground hover:text-primary-foreground font-medium transition-all flex items-center gap-1.5 border border-border/60 shadow-xs"
              >
                <Users className="h-3.5 w-3.5" />
                {locale === "th" ? "ทำเนียบคณาจารย์" : "Faculty Directory"}
              </Link>
            </div>
          </div>

          {/* Mini Trust Metrics */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-4">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>{locale === "th" ? "รวดเร็ว ทันใจ" : "Fast & Real-time"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>{locale === "th" ? "ปลอดภัยมาตรฐานสากล" : "Enterprise Security"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{locale === "th" ? "บริการออนไลน์ 24/7" : "24/7 Digital Access"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Robot Companion Video & Floating Liquid-Glass Tags */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end py-6 lg:py-10">
          {/* Decorative Background Concentric Orbital Rings */}
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] sm:w-[600px] h-[540px] sm:h-[600px] -z-10 opacity-35 pointer-events-none text-primary"
            viewBox="0 0 600 600"
            fill="none"
          >
            <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="300" cy="300" r="210" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="300" cy="300" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          {/* Main Visual: Authentic Assist Hero Robot Video Frame */}
          <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-[28px] overflow-hidden shadow-2xl border border-white/70 dark:border-border/70 bg-white dark:bg-card group">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/1781511492557-Assist_hero.webp"
              className="w-full h-full object-cover object-center select-none block"
              style={{ filter: "brightness(1.02) contrast(1.04)" }}
            >
              <source src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_robo_video.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Dynamic Floating Liquid-Glass Badge 1: Top Right */}
          <Link
            href="/portal/personnel"
            className="absolute -top-3 sm:top-2 -right-2 sm:-right-6 bg-background/85 dark:bg-card/85 backdrop-blur-xl border border-border/80 dark:border-border/60 rounded-2xl px-4 py-3 shadow-xl shadow-primary/10 flex items-center gap-3 animate-hero-float-1 hover:scale-105 transition-all z-20"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/30 shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-bold text-xs text-foreground">
                {locale === "th" ? "บริการคำร้องออนไลน์" : "Online Petitions"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {locale === "th" ? "สะดวก รวดเร็ว ใน 1 คลิก" : "Instant 1-click tracking"}
              </span>
            </div>
          </Link>

          {/* Dynamic Floating Liquid-Glass Badge 2: Center Left */}
          <Link
            href="/portal/personnel"
            className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-8 bg-background/85 dark:bg-card/85 backdrop-blur-xl border border-border/80 dark:border-border/60 rounded-2xl px-4 py-3 shadow-xl shadow-emerald-500/10 flex items-center gap-3 animate-hero-float-2 hover:scale-105 transition-all z-20"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-bold text-xs text-foreground">
                {locale === "th" ? "ทำเนียบคณาจารย์" : "Faculty Directory"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {locale === "th" ? "บุคลากรผู้เชี่ยวชาญ" : "Verified Experts"}
              </span>
            </div>
          </Link>

          {/* Dynamic Floating Liquid-Glass Badge 3: Bottom Right */}
          <Link
            href="/portal/curriculum"
            className="absolute -bottom-3 sm:bottom-4 -right-2 sm:-right-4 bg-background/85 dark:bg-card/85 backdrop-blur-xl border border-border/80 dark:border-border/60 rounded-2xl px-4 py-3 shadow-xl shadow-purple-500/10 flex items-center gap-3 animate-hero-float-3 hover:scale-105 transition-all z-20"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30 shrink-0">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-bold text-xs text-foreground">
                {locale === "th" ? "หลักสูตรการศึกษา" : "Academic Programs"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {locale === "th" ? "ปริญญาตรี - เอก" : "Undergrad & Graduate"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
