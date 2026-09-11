const fs = require('fs');

let layout = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');

const mobilePrimaryBlock = `{status === "authenticated" && user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary flex justify-center w-full py-2 gap-2 rounded-md">
                  <LayoutDashboard className="h-4 w-4" />
                  {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                </Link>
              )`;

const mobileAuthBlock = `{status === "authenticated" && user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2 border-b border-muted">
                    <div className="font-semibold text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary flex justify-center w-full py-2 gap-2 rounded-md mt-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                  </Link>
                  <Link href="/me" onClick={() => setMobileMenuOpen(false)} className="btn-outline flex justify-center w-full py-2 gap-2 rounded-md">
                    <User className="h-4 w-4" />
                    {locale === "th" ? "โปรไฟล์ส่วนตัว" : "My Profile"}
                  </Link>
                  <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="btn-outline flex justify-center w-full py-2 gap-2 rounded-md !text-red-500 !border-red-200 hover:!bg-red-50">
                    <LogOut className="h-4 w-4" />
                    {locale === "th" ? "ออกจากระบบ" : "Logout"}
                  </button>
                </div>
              )`;

layout = layout.replace(mobilePrimaryBlock, mobileAuthBlock);

fs.writeFileSync('src/app/portal/client-layout.tsx', layout, 'utf8');
