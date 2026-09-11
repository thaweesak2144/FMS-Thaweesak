"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users,
  ArrowRight,
  FileText,
  Play,
  GraduationCap,
} from "lucide-react";

interface AssistHeroProps {
  orgName: string;
  locale: string;
}

// 8 poses from the new high-quality sprite sheet (2 rows × 4 cols)
const MASCOT_POSES = [
  { id: 1, titleTh: "ยินดีต้อนรับสู่ระบบ", titleEn: "Welcome to Academic Hub" },
  { id: 2, titleTh: "พร้อมเรียนรู้ 👍", titleEn: "Ready to Learn 👍" },
  { id: 3, titleTh: "สู้ๆ นะครับ ✌️", titleEn: "Keep it up ✌️" },
  { id: 4, titleTh: "แนะนำบริการดิจิทัล 👆", titleEn: "Discover Services 👆" },
  { id: 5, titleTh: "คิดหนักแต่มีคำตอบ 🤔", titleEn: "Smart Thinking 🤔" },
  { id: 6, titleTh: "สำเร็จไปด้วยกัน 💪", titleEn: "Success Together 💪" },
  { id: 7, titleTh: "ก้าวไปข้างหน้า 🚶", titleEn: "Moving Forward 🚶" },
  { id: 8, titleTh: "สวัสดีครับ ยินดีให้บริการ 🙏", titleEn: "Sawasdee - Greeting 🙏" },
];

export function AssistHero({ orgName, locale }: AssistHeroProps) {
  const isTh = locale === "th";
  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);

  // Preload all 8 pose images on mount for instant zero-flicker transitions
  useEffect(() => {
    if (typeof window !== "undefined") {
      MASCOT_POSES.forEach((p) => {
        const img = new Image();
        img.src = `/images/mascot/pose-${p.id}.png?v=4`;
      });
    }
  }, []);

  // Continuous automatic animation cycle through all 8 poses sequentially
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPoseIdx((prev) => (prev + 1) % MASCOT_POSES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden w-full px-4 sm:px-8 lg:px-16 pt-12 pb-16 lg:py-20 flex items-center">
      {/* Ambient background aura spotlight */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[15%] left-[8%] w-[480px] h-[480px] rounded-full blur-[120px] opacity-25 dark:opacity-20 animate-pulse"
          style={{ background: "var(--brand)" }}
        />
        <div
          className="absolute bottom-[10%] right-[10%] w-[420px] h-[420px] rounded-full blur-[110px] opacity-20 dark:opacity-15"
          style={{ background: "var(--brand-light, var(--brand))" }}
        />
      </div>

      <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT COLUMN: Copy, Social Proof & CTAs */}
        <div className="lg:col-span-5 flex flex-col justify-center items-start text-left max-w-[620px]">
          {/* Social Proof Capsule */}
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/15 shadow-xs mb-6 backdrop-blur-sm">
            <div className="flex -space-x-2 select-none">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
              ].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span className="text-[12px] text-muted-foreground font-normal">
              {isTh ? (
                <>
                  เข้าถึงโดย <strong className="text-foreground font-semibold">นักศึกษาและบุคลากร</strong> ทั่วประเทศ
                </>
              ) : (
                <>
                  Trusted by <strong className="text-foreground font-semibold">10,000+ users</strong> worldwide
                </>
              )}
            </span>
          </div>

          {/* Main Display Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight leading-[1.08] text-foreground mb-5">
            {isTh ? (
              <>
                ศูนย์กลางการศึกษา <br />
                <span className="text-primary">{orgName}</span> <br />
                เพื่ออนาคตดิจิทัล
              </>
            ) : (
              <>
                Empower Future <br />
                <span className="text-primary">{orgName}</span> <br />
                Smart Digital Hub
              </>
            )}
          </h1>

          {/* Body Paragraph */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[500px] mb-8">
            {isTh
              ? "เชื่อมต่อทุกมิติการเรียนรู้ ข้อมูลหลักสูตร คณาจารย์ งานวิจัย และบริการคำร้องออนไลน์แบบครบวงจร สะดวก รวดเร็ว ตลอด 24 ชั่วโมง"
              : "Ask questions, explore academic programs, access faculty directories, and streamline student digital services with ease."}
          </p>

          {/* Button Container */}
          <div className="flex flex-wrap items-center gap-5">
            {/* Primary Action Button */}
            <Link href="/portal/personnel">
              <button
                type="button"
                className="group flex items-center gap-4 pl-6 pr-2 py-2.5 rounded-[16px] text-sm font-bold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "var(--brand)",
                  boxShadow:
                    "inset 0px 3px 3px 0px rgba(255,255,255,0.3), 0 10px 25px -5px color-mix(in srgb, var(--brand) 40%, transparent)",
                }}
              >
                <span>{isTh ? "ค้นหาทำเนียบบุคลากร" : "Explore Directory"}</span>
                <span className="w-8 h-8 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center text-white transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </Link>

            {/* Secondary Link Button */}
            <Link href="/login" className="flex items-center gap-2.5 group py-2">
              <span className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-all duration-200 group-hover:bg-primary/20 group-hover:scale-105">
                <Play className="h-3.5 w-3.5 fill-primary text-primary ml-0.5" />
              </span>
              <span className="text-sm font-semibold text-primary group-hover:underline transition-colors">
                {isTh ? "เข้าสู่ระบบจัดการหลังบ้าน" : "Staff Console"}
              </span>
            </Link>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-border/60 w-full max-w-[480px]">
            <div>
              <div className="text-2xl font-black tracking-tight text-foreground">10+</div>
              <div className="text-xs text-muted-foreground mt-0.5">{isTh ? "โมดูลบริการ" : "Service Modules"}</div>
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-foreground">24/7</div>
              <div className="text-xs text-muted-foreground mt-0.5">{isTh ? "บริการตลอดเวลา" : "Always Available"}</div>
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-foreground">100%</div>
              <div className="text-xs text-muted-foreground mt-0.5">{isTh ? "ดิจิทัลออนไลน์" : "Online Digital"}</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Mascot Character with Continuous Automatic Pose Switching (No bottom buttons) */}
        <div className="lg:col-span-7 relative flex items-center justify-center py-6 lg:py-0 select-none">
          {/* Decorative Orbital Concentric Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div
              className="w-[520px] h-[520px] rounded-full border border-dashed opacity-25 dark:opacity-20 animate-spin"
              style={{ borderColor: "var(--brand)", animationDuration: "60s" }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full border border-dashed opacity-20 dark:opacity-15"
              style={{ borderColor: "var(--brand-light, var(--brand))" }}
            />
          </div>

          {/* Centered Character Stage Box */}
          <div
            className="relative w-full max-w-[460px] h-[530px] rounded-[32px] overflow-hidden border border-white/60 dark:border-border/60 backdrop-blur-xl flex flex-col items-center justify-between p-6 shadow-2xl transition-all duration-300"
            style={{
              background:
                "radial-gradient(ellipse at 50% 25%, color-mix(in srgb, var(--brand-light, #38bdf8) 14%, var(--glass-strong)), color-mix(in srgb, var(--brand) 6%, var(--glass)))",
              boxShadow:
                "0 25px 50px -12px color-mix(in srgb, var(--brand) 25%, transparent), inset 0 1px 2px rgba(255,255,255,0.8)",
            }}
          >


            {/* Central Mascot Figure with Seamless Crossfade Pose Transitions */}
            <div className="relative flex-1 w-full flex items-center justify-center my-1 overflow-visible">
              {/* Ground Shadow & Light Pedestal */}
              <div
                className="absolute bottom-1 w-48 h-8 rounded-full blur-md opacity-40 dark:opacity-60 transition-all duration-700"
                style={{
                  background:
                    "radial-gradient(ellipse at center, color-mix(in srgb, var(--brand) 80%, black), transparent 70%)",
                }}
              />
              <div
                className="absolute bottom-0 w-56 h-3 rounded-full border opacity-50 dark:opacity-40 transition-all duration-700"
                style={{
                  borderColor: "var(--brand)",
                  background:
                    "radial-gradient(ellipse at center, color-mix(in srgb, var(--brand) 35%, transparent), transparent)",
                }}
              />

              {/* 8 High-Res Character Poses with Smooth Crossfade */}
              {MASCOT_POSES.map((pose, idx) => {
                const isCurrent = idx === currentPoseIdx;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={pose.id}
                    src={`/images/mascot/pose-${pose.id}.png?v=4`}
                    alt={isTh ? pose.titleTh : pose.titleEn}
                    className={`absolute inset-0 m-auto max-h-[440px] w-auto object-contain transition-all duration-500 ease-out pointer-events-none ${
                      isCurrent
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-98 translate-y-1.5"
                    }`}
                    style={{
                      imageRendering: "crisp-edges",
                      filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.18))",
                    }}
                  />
                );
              })}
            </div>

            {/* No bottom buttons - Clean space */}
            <div className="h-1" />
          </div>

          {/* ═══════════ Dynamic Floating Badges (Liquid-Glass with sine-wave float) ═══════════ */}

          {/* Badge 1: Top Right - Online Request */}
          <div
            className="absolute top-[8%] -right-2 sm:-right-6 lg:-right-4 px-4 py-3 rounded-[20px] flex items-center gap-3 backdrop-blur-[20px] border shadow-xl animate-hero-float-1 pointer-events-auto transition-transform hover:scale-105"
            style={{
              background: "color-mix(in srgb, var(--glass-strong) 85%, transparent)",
              borderColor: "color-mix(in srgb, var(--brand) 30%, var(--glass-border))",
              boxShadow:
                "0 12px 32px -4px color-mix(in srgb, var(--brand) 25%, transparent), inset 0 2px 4px rgba(255,255,255,0.6)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md"
              style={{ background: "linear-gradient(135deg, var(--brand-light, #38bdf8), var(--brand))" }}
            >
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[13px] font-bold text-foreground">
                {isTh ? "คำร้องออนไลน์" : "Online Petition"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {isTh ? "ยื่นและติดตามสถานะ" : "Fast & Traceable"}
              </span>
            </div>
          </div>

          {/* Badge 2: Center Left - Faculty Directory */}
          <div
            className="absolute top-[48%] -left-3 sm:-left-8 lg:-left-6 px-4 py-3 rounded-[20px] flex items-center gap-3 backdrop-blur-[20px] border shadow-xl animate-hero-float-2 pointer-events-auto transition-transform hover:scale-105"
            style={{
              background: "color-mix(in srgb, var(--glass-strong) 85%, transparent)",
              borderColor: "rgba(16, 185, 129, 0.35)",
              boxShadow: "0 12px 32px -4px rgba(16, 185, 129, 0.2), inset 0 2px 4px rgba(255,255,255,0.6)",
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 text-white shadow-md">
              <Users className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[13px] font-bold text-foreground">
                {isTh ? "ทำเนียบคณาจารย์" : "Faculty Directory"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {isTh ? "ค้นหาบุคลากรครบครัน" : "100+ Professors & Staff"}
              </span>
            </div>
          </div>

          {/* Badge 3: Bottom Right - Academic Curriculum */}
          <div
            className="absolute bottom-[6%] -right-2 sm:-right-6 lg:-right-4 px-4 py-3 rounded-[20px] flex items-center gap-3 backdrop-blur-[20px] border shadow-xl animate-hero-float-3 pointer-events-auto transition-transform hover:scale-105"
            style={{
              background: "color-mix(in srgb, var(--glass-strong) 85%, transparent)",
              borderColor: "rgba(147, 51, 234, 0.35)",
              boxShadow: "0 12px 32px -4px rgba(147, 51, 234, 0.2), inset 0 2px 4px rgba(255,255,255,0.6)",
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 text-white shadow-md">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[13px] font-bold text-foreground">
                {isTh ? "หลักสูตรการศึกษา" : "Academic Programs"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {isTh ? "ปริญญาตรี-โท-เอก" : "Bachelor, Master, PhD"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
