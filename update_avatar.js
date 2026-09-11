const fs = require('fs');

let layout = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');

// 1. Add imports
layout = layout.replace(
  'import { useT, useLocale } from "@/shared/lib/i18n/client";',
  `import { useT, useLocale } from "@/shared/lib/i18n/client";\nimport { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";\nimport { signOut } from "next-auth/react";\nimport { User, LogOut } from "lucide-react";`
);

// 2. Add initials computation before return
layout = layout.replace(
  'const navLinks = [',
  `const initials = (user?.name ?? "?").trim().charAt(0).toUpperCase() || "?";\n\n  const navLinks = [`
);

// 3. Replace the Admin Console button with avatar menu
const btnPrimaryBlock = `{status === "authenticated" && user ? (
              <Link href="/dashboard" className="btn-primary text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all">
                <LayoutDashboard className="h-3.5 w-3.5" />
                {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
              </Link>
            )`;

const avatarBlock = `{status === "authenticated" && user ? (
              <DropdownMenuPrimitive.Root>
                <DropdownMenuPrimitive.Trigger asChild>
                  <button type="button" className="icon-btn hover:bg-muted" style={{ border: 'none', background: 'none' }}>
                    <span className="who inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-medium text-xs overflow-hidden" aria-hidden="true">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        initials
                      )}
                    </span>
                  </button>
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuPrimitive.Portal>
                  <DropdownMenuPrimitive.Content className="menu-list" align="end" sideOffset={12}>
                    <div className="h px-3 py-2 border-b mb-1">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    <DropdownMenuPrimitive.Item asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-sm outline-none">
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        {locale === "th" ? "แดชบอร์ดหลังบ้าน" : "Admin Console"}
                      </Link>
                    </DropdownMenuPrimitive.Item>
                    <DropdownMenuPrimitive.Item asChild>
                      <Link href="/me" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-sm outline-none">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {locale === "th" ? "โปรไฟล์ส่วนตัว" : "My Profile"}
                      </Link>
                    </DropdownMenuPrimitive.Item>
                    <div className="my-1 border-t" aria-hidden="true" />
                    <DropdownMenuPrimitive.Item asChild>
                      <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded-sm outline-none text-red-500 hover:text-red-600">
                        <LogOut className="h-4 w-4" />
                        {locale === "th" ? "ออกจากระบบ" : "Logout"}
                      </button>
                    </DropdownMenuPrimitive.Item>
                  </DropdownMenuPrimitive.Content>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenuPrimitive.Root>
            )`;

layout = layout.replace(btnPrimaryBlock, avatarBlock);

fs.writeFileSync('src/app/portal/client-layout.tsx', layout, 'utf8');
