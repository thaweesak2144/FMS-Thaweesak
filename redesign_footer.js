const fs = require('fs');

let layout = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');

const oldFooterRegex = /{\/\* Footer \*\/}\s*<footer className="border-t bg-muted\/30 py-10 mt-16">[\s\S]*?<\/footer>/;

const newFooter = `{/* Footer */}
      <footer>
        <div className="foot-in">
          <div>
            <Link href="/portal" className="brand flex items-center">
              {logoUrl ? <img src={logoUrl} alt="Logo" style={{ height: "2rem", width: "2rem", objectFit: "contain", marginRight: "10px" }} /> : <i><GraduationCap className="h-5 w-5" /></i>}
              <div className="flex flex-col ml-1">
                <span className="font-bold text-base tracking-tight leading-none">{t("app.name")}</span>
              </div>
            </Link>
            <p className="foot-tag">{t("app.tagline")}</p>
          </div>
          
          <div>
            <h4>{locale === "th" ? "เมนูหลัก" : "Main Menu"}</h4>
            <ul>
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{locale === "th" ? "สำหรับเจ้าหน้าที่" : "For Staff"}</h4>
            <ul>
              <li>
                <Link href="/login">
                  {locale === "th" ? "เข้าสู่ระบบ (Admin Console)" : "Staff Login (Admin Console)"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="foot-bottom">
          <div className="foot-bottom-in">
            <span>© {new Date().getFullYear()} {t("app.name")}. All rights reserved.</span>
          </div>
        </div>
      </footer>`;

layout = layout.replace(oldFooterRegex, newFooter);

fs.writeFileSync('src/app/portal/client-layout.tsx', layout, 'utf8');
