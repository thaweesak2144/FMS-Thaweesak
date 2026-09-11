"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Zap, Star, Award, BookOpen, GraduationCap } from "lucide-react";

export function Hero3DScene({
  orgName,
  locale,
}: {
  orgName: string;
  locale: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-10 to 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full [perspective:1400px] flex items-center justify-center cursor-pointer select-none"
    >
      {/* Outer 3D Card Shell with Interactive Tilt */}
      <div
        className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] bg-white dark:bg-card/90 transition-transform duration-200 ease-out"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Aspect Container for Image */}
        <div className="relative w-full aspect-[16/10.5] overflow-hidden bg-slate-100 dark:bg-slate-900">
          {/* Main 3D Render Image with Subtle Cinematic Breathing */}
          <img
            src="/images/hero_3d_campus.jpg"
            alt="3D Campus"
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-105"
            style={{
              transform: isHovered ? "scale(1.03)" : "scale(1)",
            }}
          />

          {/* Interactive Specular Glare following Cursor */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4), transparent 80%)`,
              opacity: glare.opacity,
            }}
          />

          {/* Shimmer Light Sweep across the scene */}
          <div className="absolute inset-0 pointer-events-none animate-shimmer" />

          {/* ═══ Animated Hotspot 1: Conveyor Belt Flow (Diagonal Particle Path) ═══ */}
          <div className="absolute top-[8%] left-[2%] w-[48%] h-[68%] pointer-events-none overflow-hidden">
            {/* SVG Animated Dash Line tracing the conveyor belt */}
            <svg className="w-full h-full" viewBox="0 0 200 150" fill="none">
              <path
                d="M 10 15 L 180 140"
                stroke="url(#conveyorGlow)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                className="animate-conveyor-dash"
                strokeLinecap="round"
                opacity="0.75"
              />
              <defs>
                <linearGradient id="conveyorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="var(--brand)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Traveling Dot 1 */}
            <div
              className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--brand)] animate-travel-dot"
              style={{ animationDelay: "0s" }}
            />
            {/* Glowing Traveling Dot 2 */}
            <div
              className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--brand)] animate-travel-dot"
              style={{ animationDelay: "1.4s" }}
            />
            {/* Glowing Traveling Dot 3 */}
            <div
              className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--brand)] animate-travel-dot"
              style={{ animationDelay: "2.8s" }}
            />
          </div>

          {/* ═══ Animated Hotspot 2: Building Window Warm Light Pulse ═══ */}
          <div
            className="absolute top-[52%] right-[41%] w-10 h-16 rounded-t-full pointer-events-none animate-window-glow"
            style={{
              background: "radial-gradient(ellipse at center, rgba(254, 215, 170, 0.4) 0%, rgba(251, 146, 60, 0.15) 60%, transparent 80%)",
            }}
          />

          {/* ═══ Animated Hotspot 3: Academia Sign Floating Glow ═══ */}
          <div className="absolute top-[21%] right-[22%] pointer-events-none">
            <div className="relative">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary/80 shadow-[0_0_10px_var(--brand)]" />
              </span>
            </div>
          </div>

          {/* ═══ Animated Hotspot 4: Golden Medal Star Shine (Bottom-Right) ═══ */}
          <div className="absolute bottom-[8%] right-[8%] pointer-events-none">
            <div className="relative w-8 h-8 flex items-center justify-center animate-spin-slow">
              <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            </div>
          </div>

          {/* Floating Live Tag over the 3D Building */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-md border border-slate-200/80 dark:border-border/60 shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {orgName} 3D Campus
            </span>
          </div>

          {/* Subtle Ambient Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Bottom Live Status Bar */}
        <div className="px-6 py-3 bg-white/95 dark:bg-card/95 border-t border-slate-100 dark:border-border/40 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {locale === "th" ? "จำลองบรรยากาศการศึกษาดิจิทัล 3 มิติ" : "Interactive 3D Digital Campus Simulation"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Live Render
          </span>
        </div>
      </div>

      {/* Floating Satellite 3D Badge 1 (Top-Right): Floating Animation */}
      <div className="absolute -top-4 -right-2 sm:-right-4 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-card/95 border border-primary/25 shadow-xl shadow-slate-900/10 backdrop-blur-xl animate-float-slow z-30 flex items-center gap-2.5 pointer-events-none">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {locale === "th" ? "นวัตกรรม 3D Interactive" : "3D Animated Hub"}
          </div>
          <div className="text-[10px] text-muted-foreground font-medium">
            {locale === "th" ? "ระบบการศึกษาแห่งอนาคต" : "Smart Future Campus"}
          </div>
        </div>
      </div>

      {/* Floating Satellite 3D Badge 2 (Bottom-Left): Reverse Floating Animation */}
      <div className="absolute -bottom-5 -left-2 sm:-left-5 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-card/95 border border-slate-200/80 dark:border-border/60 shadow-xl shadow-slate-900/10 backdrop-blur-xl animate-float-reverse z-30 flex items-center gap-3 pointer-events-none">
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
  );
}
