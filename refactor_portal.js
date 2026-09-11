const fs = require('fs');
let content = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');

// Replace header block
content = content.replace(/<header className="sticky top-0 z-40 w-full border-b bg-background\/85 backdrop-blur-md">[\s\S]*?<\/header>/, 
`<header className="nav glass">
        <div className="nav-in">
          {/* Brand Logo */}
          <Link href="/portal" className="brand group flex items-center">
            {logoUrl ? <img src={logoUrl} alt="Logo" style={{ height: "2rem", width: "2rem", objectFit: "contain", marginRight: "10px" }} className="group-hover:scale-105 transition-transform" /> : <i className="group-hover:scale-105 transition-transform"><GraduationCap className="h-5 w-5" /></i>}
            <div className="flex flex-col ml-1">
              <span className="font-bold text-base tracking-tight leading-none group-hover:text-primary transition-colors">{t("app.name")}</span>
              <span className="text-xs text-muted-foreground mt-0.5 font-normal">{t("app.tagline")}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/portal" && pathname.startsWith(link.href));
              return (
                <li key={link.href} className={active ? "on" : ""}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              );
            })}
          </ul>

          {/* Actions: Lang Switcher & Login / Admin Console */}
          <div className="right hidden sm:flex">
            <LanguageSwitcher />
            {status === "authenticated" && user ? (
              <Link href="/dashboard" className="btn-primary text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all">
                <LayoutDashboard className="h-3.5 w-3.5" />
                {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
              </Link>
            ) : (
              <Link href="/login" className="btn-outline text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all">
                <LogIn className="h-3.5 w-3.5" />
                {locale === "th" ? "เข้าสู่ระบบเจ้าหน้าที่" : "Staff Login"}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden ml-auto">
            <LanguageSwitcher />
            <button type="button" className="icon-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b bg-background px-4 pt-2 pb-4 space-y-2 absolute top-[64px] w-full shadow-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2">
              {status === "authenticated" && user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary flex justify-center w-full py-2 gap-2 rounded-md">
                  <LayoutDashboard className="h-4 w-4" />
                  {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-outline flex justify-center w-full py-2 gap-2 rounded-md">
                  <LogIn className="h-4 w-4" />
                  {locale === "th" ? "เข้าสู่ระบบเจ้าหน้าที่" : "Staff Login"}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>`);

fs.writeFileSync('src/app/portal/client-layout.tsx', content, 'utf8');
