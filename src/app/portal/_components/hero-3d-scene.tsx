"use client";

import { useState, useRef } from "react";
import { Sparkles, Zap, Star, GraduationCap } from "lucide-react";

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

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full [perspective:1400px] flex items-center justify-center cursor-pointer select-none"
    >
      {/* Outer 3D Container with Interactive Mouse Tilt */}
      <div
        className="relative w-full rounded-[2rem] overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] bg-[#f8f9fc] dark:bg-card transition-transform duration-300 ease-out"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Aspect Ratio Container for 16:9 Image */}
        <div className="relative w-full aspect-[16/9.5] overflow-hidden bg-slate-100 dark:bg-slate-900">
          {/* Main 3D Render Image (Campus Scene) */}
          <img
            src="/images/hero_3d_campus.jpg"
            alt="3D Campus Scene"
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out"
            style={{
              transform: isHovered ? "scale(1.04)" : "scale(1.01)",
            }}
          />

          {/* ═══════════════════════════════════════════════════════════════
              ANIMATION LAYER 1: Dappled Sunlight & Tree Shadows (Etail Atmosphere)
              ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply dark:mix-blend-overlay animate-dappled-light"
            style={{
              backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(0,0,0,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.3) 0%, transparent 40%)",
              backgroundSize: "120% 120%",
            }}
          />

          {/* ═══════════════════════════════════════════════════════════════
              ANIMATION LAYER 2: Conveyor Belt Moving Items (Etail 3D Signature)
              Items travel down the conveyor from top-left (x:0%, y:0%) to (x:46%, y:58%)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Item 1: Cardboard Box with Stamp */}
            <div
              className="absolute animate-conveyor-glide"
              style={{ animationDelay: "0s" }}
            >
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-[#d4a373] border border-[#bc8a5f] shadow-[0_8px_16px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center -rotate-12 group-hover:scale-110 transition-transform">
                {/* Tape seal */}
                <div className="w-full h-2 bg-[#b08968]/70 absolute top-1/2 -translate-y-1/2" />
                <span className="text-[8px] sm:text-[10px] font-black text-[#582f0e] uppercase tracking-wider relative z-10 bg-[#e6ccb2]/80 px-1 rounded">
                  {locale === "th" ? "FMS" : "ETAIL"}
                </span>
                {/* 3D Box Shadow beneath */}
                <div className="absolute -bottom-2 w-10 h-2 bg-black/30 rounded-full blur-[2px]" />
              </div>
            </div>

            {/* Item 2: Stack of Colorful Hardcover Books */}
            <div
              className="absolute animate-conveyor-glide"
              style={{ animationDelay: "2.2s" }}
            >
              <div className="relative w-11 h-9 sm:w-14 sm:h-12 flex flex-col items-center justify-center -rotate-12">
                {/* Top Book (Primary/Theme Color) */}
                <div className="w-10 sm:w-13 h-3 sm:h-3.5 rounded-sm bg-primary border-t border-white/40 shadow-xs flex items-center justify-between px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  <div className="w-4 h-0.5 bg-white/40 rounded-full" />
                </div>
                {/* Middle Book (Amber) */}
                <div className="w-11 sm:w-14 h-3 sm:h-3.5 rounded-sm bg-amber-500 border-t border-white/40 shadow-xs -mt-0.5" />
                {/* Bottom Book (Emerald) */}
                <div className="w-12 sm:w-15 h-3.5 sm:h-4 rounded-sm bg-emerald-600 border-t border-white/40 shadow-md -mt-0.5" />
                {/* Book stack shadow */}
                <div className="absolute -bottom-1.5 w-12 h-2.5 bg-black/35 rounded-full blur-[2px]" />
              </div>
            </div>

            {/* Item 3: Diploma Scroll with Golden Ribbon */}
            <div
              className="absolute animate-conveyor-glide"
              style={{ animationDelay: "4.4s" }}
            >
              <div className="relative w-12 h-6 sm:w-16 sm:h-8 rounded-full bg-[#fefae0] border border-[#e9edc9] shadow-[0_6px_12px_rgba(0,0,0,0.25)] flex items-center justify-center -rotate-12">
                {/* Ribbon wrap */}
                <div className="w-2.5 sm:w-3.5 h-full bg-primary/90 rounded-xs flex items-center justify-center shadow-xs">
                  <div className="w-1 h-1 rounded-full bg-amber-300" />
                </div>
                {/* Seal hanging */}
                <div className="absolute -bottom-1.5 w-3 h-3 rounded-full bg-amber-400 border border-amber-500 shadow-xs" />
                {/* Scroll shadow */}
                <div className="absolute -bottom-2 w-12 h-2 bg-black/30 rounded-full blur-[2px]" />
              </div>
            </div>

            {/* Item 4: 3D Graduation Mortarboard Cap */}
            <div
              className="absolute animate-conveyor-glide"
              style={{ animationDelay: "6.6s" }}
            >
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center -rotate-12">
                {/* Cap diamond */}
                <div className="w-8 sm:w-11 h-8 sm:h-11 bg-slate-900 border border-slate-700 rounded-sm shadow-xl rotate-45 flex items-center justify-center">
                  {/* Button in center */}
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-xs" />
                </div>
                {/* Tassel */}
                <div className="absolute top-1/2 right-1 w-4 h-0.5 bg-amber-400 origin-left animate-tassel-swing" />
                {/* Cap shadow */}
                <div className="absolute -bottom-2 w-11 h-2 bg-black/35 rounded-full blur-[2px]" />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ANIMATION LAYER 3: 3D Rotating Golden Medal (Bottom-Right)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="absolute bottom-[6%] right-[5%] sm:right-[7%] z-20 pointer-events-none flex flex-col items-center">
            {/* Rotating 3D Golden Coin */}
            <div className="relative [perspective:600px] animate-coin-float">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 p-1 shadow-[0_12px_24px_rgba(217,119,6,0.4)] border-2 border-yellow-200 animate-coin-rotate flex items-center justify-center">
                {/* Inner Bezel */}
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-600/60 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-inner">
                  <GraduationCap className="w-7 h-7 sm:w-10 sm:h-10 text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
                </div>
                {/* Metallic Gleam Sweep */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-gleam pointer-events-none" />
              </div>
              {/* Ribbon tails */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-2.5 h-5 bg-amber-500 rounded-b-xs rotate-12 shadow-xs" />
                <div className="w-2.5 h-5 bg-amber-600 rounded-b-xs -rotate-12 shadow-xs" />
              </div>
            </div>
            {/* Medal Label */}
            <span className="mt-4 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[9px] font-bold shadow-xs">
              TOP QUALITY
            </span>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ANIMATION LAYER 4: Floating Graduation Caps above Academia Roof
              ═══════════════════════════════════════════════════════════════ */}
          <div className="absolute top-[16%] right-[23%] z-20 pointer-events-none">
            {/* Floating Cap 1 */}
            <div className="animate-cap-bob-1 relative">
              <div className="w-7 h-7 sm:w-9 sm:h-9 bg-slate-900 border border-slate-700 rounded-xs shadow-lg rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-ping" />
            </div>
          </div>

          <div className="absolute top-[12%] right-[32%] z-20 pointer-events-none">
            {/* Floating Cap 2 */}
            <div className="animate-cap-bob-2 relative">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary border border-primary-foreground/30 rounded-xs shadow-lg rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ANIMATION LAYER 5: Warm Breathing Window Light
              ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute top-[52%] right-[40%] w-12 h-18 rounded-t-full pointer-events-none animate-window-warmth"
            style={{
              background: "radial-gradient(ellipse at center, rgba(254, 215, 170, 0.5) 0%, rgba(251, 146, 60, 0.25) 50%, transparent 80%)",
            }}
          />

          {/* ═══════════════════════════════════════════════════════════════
              ANIMATION LAYER 6: Specular Glare following Mouse
              ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 380px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.45), transparent 80%)`,
              opacity: glare.opacity,
            }}
          />

          {/* Light Shimmer Sweep across the whole 3D scene */}
          <div className="absolute inset-0 pointer-events-none animate-shimmer" />

          {/* Floating Campus Badge (Top-Left inside scene) */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 px-3 py-1.5 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md border border-slate-200/80 dark:border-border/60 shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
              {orgName} 3D Live Campus
            </span>
          </div>

          {/* Bottom Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Live Status Bar */}
        <div className="px-6 py-3 bg-white/95 dark:bg-card/95 border-t border-slate-100 dark:border-border/40 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {locale === "th" ? "โมเดล 3 มิติ อินเตอร์แอคทีฟ (Etail Motion Design)" : "Interactive 3D Simulation (Etail Motion Design)"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            60 FPS Animated
          </span>
        </div>
      </div>

      {/* Floating Satellite 3D Badge 1 (Top-Right): Slow Hover Bob */}
      <div className="absolute -top-4 -right-2 sm:-right-4 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-card/95 border border-primary/25 shadow-xl shadow-slate-900/10 backdrop-blur-xl animate-float-slow z-30 flex items-center gap-2.5 pointer-events-none">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {locale === "th" ? "ระบบสายพาน 3D ทำงานสด" : "3D Animated Belt"}
          </div>
          <div className="text-[10px] text-muted-foreground font-medium">
            {locale === "th" ? "การศึกษาครบวงจร" : "Continuous Learning"}
          </div>
        </div>
      </div>

      {/* Floating Satellite 3D Badge 2 (Bottom-Left): Reverse Hover Bob */}
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
