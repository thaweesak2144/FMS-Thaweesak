const fs = require('fs');

// 1. Add conveyor belt CSS animations (enhanced)
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Add more conveyor-related animations if not present
if (!css.includes('conveyorFloat')) {
  css = css.replace(
    '.animate-conveyor {\n  animation: conveyorMove 12s linear infinite;\n}',
    `.animate-conveyor {
  animation: conveyorMove 12s linear infinite;
}

/* ═══ Conveyor Belt Items Float Up ═══ */
@keyframes conveyorFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

.animate-conveyor-item {
  animation: conveyorFloat 2s ease-in-out infinite;
}

.animate-conveyor-item-delay-1 {
  animation: conveyorFloat 2s ease-in-out 0.4s infinite;
}

.animate-conveyor-item-delay-2 {
  animation: conveyorFloat 2s ease-in-out 0.8s infinite;
}

.animate-conveyor-item-delay-3 {
  animation: conveyorFloat 2s ease-in-out 1.2s infinite;
}

.animate-conveyor-item-delay-4 {
  animation: conveyorFloat 2s ease-in-out 1.6s infinite;
}

/* Conveyor Belt Roller Spin */
@keyframes rollerSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-roller {
  animation: rollerSpin 1.5s linear infinite;
}

/* Conveyor Belt Surface Scroll */
@keyframes beltScroll {
  0% { background-position: 0 0; }
  100% { background-position: -60px 0; }
}

.animate-belt-scroll {
  animation: beltScroll 1s linear infinite;
}`
  );
  fs.writeFileSync('src/app/globals.css', css, 'utf8');
}

// 2. Update portal page.tsx — add overlay conveyor belt on the 3D image
let page = fs.readFileSync('src/app/portal/page.tsx', 'utf8');

const oldImageSection = `              {/* Studio Backdrop with the 3D Render */}
              <div className="relative w-full aspect-[16/11] overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-200/50 dark:from-slate-900/60 dark:to-slate-950/80">
                <img
                  src="/images/hero_3d_campus.jpg"
                  alt="3D Campus Scene"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Ambient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>`;

const newImageSection = `              {/* Studio Backdrop with the 3D Render */}
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
              </div>`;

if (page.includes('Studio Backdrop with the 3D Render')) {
  page = page.replace(oldImageSection, newImageSection);
  fs.writeFileSync('src/app/portal/page.tsx', page, 'utf8');
  console.log('Conveyor belt animation added successfully!');
} else {
  console.error('Target section not found, check the string match.');
}
