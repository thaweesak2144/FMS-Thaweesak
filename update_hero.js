const fs = require('fs');

let page = fs.readFileSync('src/app/portal/page.tsx', 'utf8');

// Replace the Hero section and add the metrics bar
const heroRegex = /{\/\* 3D Etail Animated Hero Section \*\/}[\s\S]*?{\/\* Feature Modules Grid \*\/}/;

const newHeroSection = `{/* 3D Etail Animated Hero Section */}
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

          {/* Right Column: 3D Isometric Scene (Etail Style High-Fidelity 3D Render) */}
          <div className="lg:col-span-6 relative [perspective:1200px] flex items-center justify-center pt-4 lg:pt-0">
            {/* Main 3D Card Display */}
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/15 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-card/90 dark:to-card/60 transition-all duration-700 hover:scale-[1.02] group">
              {/* Studio Backdrop with the 3D Render */}
              <div className="relative w-full aspect-[16/11] overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-200/50 dark:from-slate-900/60 dark:to-slate-950/80">
                <img
                  src="/images/hero_3d_campus.jpg"
                  alt="3D Campus Scene"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Ambient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Bottom Live Status Bar */}
              <div className="px-6 py-3.5 bg-white/95 dark:bg-card/95 border-t border-slate-100 dark:border-border/40 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {locale === "th" ? "ศูนย์กลางข้อมูลและบริการดิจิทัล 24 ชม." : "24/7 Digital Services Hub"}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart Campus
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

      {/* Feature Modules Grid */}`;

page = page.replace(heroRegex, newHeroSection);

fs.writeFileSync('src/app/portal/page.tsx', page, 'utf8');
console.log('Hero section updated successfully');
