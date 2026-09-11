"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  ArrowRight,
  FileText,
  Sparkles,
  Play,
  Pause,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AssistHeroProps {
  orgName: string;
  locale: string;
}

const MASCOT_POSES = [
  { id: 1, titleTh: "ยินดีต้อนรับสู่ระบบ", titleEn: "Welcome to Campus", tag: "Student" },
  { id: 2, titleTh: "พร้อมเริ่มต้นเรียนรู้ ✌️", titleEn: "Ready to Learn ✌️", tag: "Energy" },
  { id: 3, titleTh: "มั่นใจ ปลอดภัย 100%", titleEn: "Confident & Secure", tag: "Trusted" },
  { id: 4, titleTh: "ค้นคว้าความรู้ 📖", titleEn: "Explore Knowledge 📖", tag: "Academic" },
  { id: 5, titleTh: "สวัสดีครับ 👋", titleEn: "Hello & Greetings 👋", tag: "Friendly" },
  { id: 6, titleTh: "แนะนำบริการดิจิทัล 👉", titleEn: "Discover Services 👉", tag: "Guide" },
  { id: 7, titleTh: "ระบบยอดเยี่ยม 👍", titleEn: "Top Quality 👍", tag: "Quality" },
  { id: 8, titleTh: "ให้คำปรึกษาตลอด 24 ชม. 🤔", titleEn: "Smart Guidance 🤔", tag: "Advising" },
  { id: 9, titleTh: "นวัตกรรมดิจิทัล 💻", titleEn: "Digital Learning 💻", tag: "Tech" },
  { id: 10, titleTh: "สำเร็จไปด้วยกัน 💪", titleEn: "Success Together 💪", tag: "Goal" },
  { id: 11, titleTh: "มุ่งมั่นสู่อนาคต 🎒", titleEn: "Future Ready 🎒", tag: "Vision" },
  { id: 12, titleTh: "ก้าวไปข้างหน้า 🚶", titleEn: "Step Forward 🚶", tag: "Progress" },
  { id: 13, titleTh: "สวัสดีครับ ยินดีต้อนรับ 🙏", titleEn: "Sawasdee - Thai Greeting 🙏", tag: "Respect" },
  { id: 14, titleTh: "ยินดีต้อนรับทุกคนครับ 🤗", titleEn: "Open Welcome to All 🤗", tag: "Community" },
];

export function AssistHero({ orgName, locale }: AssistHeroProps) {
  const isTh = locale === "th";
  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Preload all 14 pose images on mount for zero-flicker transitions
  useEffect(() => {
    if (typeof window !== "undefined") {
      MASCOT_POSES.forEach((p) => {
        const img = new Image();
        img.src = `/images/mascot/pose-${p.id}.png`;
      });
    }
  }, []);

  // Sequential animation cycle (switch pose every 2.4s)
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      setCurrentPoseIdx((prev) => (prev + 1) % MASCOT_POSES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered]);

  const activePose = MASCOT_POSES[currentPoseIdx];

  const handleNext = () => {
    setCurrentPoseIdx((prev) => (prev + 1) % MASCOT_POSES.length);
  };

  const handlePrev = () => {
    setCurrentPoseIdx((prev) => (prev - 1 + MASCOT_POSES.length) % MASCOT_POSES.length);
  };

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

        {/* RIGHT COLUMN: 3D Animated Mascot Character (Cycling through all 14 poses) */}
        <div
          className="lg:col-span-7 relative flex items-center justify-center py-6 lg:py-0 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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
            className="relative w-full max-w-[460px] h-[520px] rounded-[32px] overflow-hidden border border-white/60 dark:border-border/60 backdrop-blur-xl flex flex-col items-center justify-between p-6 shadow-2xl transition-all duration-300 hover:shadow-primary/10"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--brand-light, #38bdf8) 12%, var(--glass-strong)), color-mix(in srgb, var(--brand) 6%, var(--glass)))",
              boxShadow:
                "0 25px 50px -12px color-mix(in srgb, var(--brand) 25%, transparent), inset 0 1px 2px rgba(255,255,255,0.8)",
            }}
          >
            {/* Top Stage Header: Current Pose Bubble & Control Button */}
            <div className="w-full flex items-center justify-between z-10">
              {/* Dynamic Action Pill */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border shadow-xs transition-all duration-300"
                style={{
                  background: "color-mix(in srgb, var(--glass-strong) 85%, transparent)",
                  borderColor: "color-mix(in srgb, var(--brand) 30%, var(--glass-border))",
                }}
              >
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="text-xs font-semibold text-foreground tracking-tight">
                  {isTh ? activePose.titleTh : activePose.titleEn}
                </span>
              </div>

              {/* Controls: Prev, Play/Pause, Next */}
              <div className="flex items-center gap-1 bg-background/60 backdrop-blur-md border border-border/50 rounded-full px-2 py-1 shadow-xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  title="Previous Pose"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? "Pause Animation" : "Play Animation"}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-primary" />}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  title="Next Pose"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Central Mascot Figure with Floating Animation & Clickable Pose Switch */}
            <div
              className="relative flex-1 w-full flex items-center justify-center cursor-pointer group my-1"
              onClick={handleNext}
              title="Click to change pose"
            >
              {/* Ground Shadow & Light Pedestal */}
              <div
                className="absolute bottom-2 w-48 h-8 rounded-full blur-md opacity-40 dark:opacity-60 transition-transform group-hover:scale-110"
                style={{
                  background:
                    "radial-gradient(ellipse at center, color-mix(in srgb, var(--brand) 80%, black), transparent 70%)",
                }}
              />
              <div
                className="absolute bottom-1 w-56 h-3 rounded-full border opacity-50 dark:opacity-40"
                style={{
                  borderColor: "var(--brand)",
                  background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--brand) 30%, transparent), transparent)",
                }}
              />

              {/* Mascot Pose Image with Smooth Crossfade */}
              {MASCOT_POSES.map((pose, idx) => {
                const isCurrent = idx === currentPoseIdx;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={pose.id}
                    src={`/images/mascot/pose-${pose.id}.png`}
                    alt={isTh ? pose.titleTh : pose.titleEn}
                    className={`absolute inset-0 m-auto max-h-[390px] w-auto object-contain transition-all duration-500 ease-out pointer-events-none drop-shadow-xl ${
                      isCurrent
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-2"
                    }`}
                    style={{
                      filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.15))",
                    }}
                  />
                );
              })}
            </div>

            {/* Bottom 14-Pose Progress Indicators */}
            <div className="w-full flex items-center justify-center gap-1.5 z-10 pt-2">
              {MASCOT_POSES.map((pose, idx) => {
                const isActive = idx === currentPoseIdx;
                return (
                  <button
                    key={pose.id}
                    type="button"
                    onClick={() => setCurrentPoseIdx(idx)}
                    title={`${idx + 1}. ${isTh ? pose.titleTh : pose.titleEn}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-6 bg-primary shadow-xs"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                  />
                );
              })}
            </div>
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
