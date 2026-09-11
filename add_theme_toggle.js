const fs = require('fs');

let layout = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');

// 1. Add import
layout = layout.replace(
  'import { useState } from "react";',
  'import { useState } from "react";\nimport { useTheme } from "next-themes";'
);

// 2. Add useTheme hook
layout = layout.replace(
  'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);',
  'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const { theme, setTheme } = useTheme();'
);

// 3. Add Theme toggle button before LanguageSwitcher in desktop
const themeBtn = `<button
              type="button"
              className="icon-btn"
              aria-label={t("nav.themeToggle") || "Toggle theme"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              )}
            </button>`;

layout = layout.replace(
  '<div className="right hidden sm:flex">\n            <LanguageSwitcher />',
  `<div className="right hidden sm:flex">\n            ${themeBtn}\n            <LanguageSwitcher />`
);

// 4. Add Theme toggle button before LanguageSwitcher in mobile
layout = layout.replace(
  '<div className="flex items-center gap-2 md:hidden ml-auto">\n            <LanguageSwitcher />',
  `<div className="flex items-center gap-2 md:hidden ml-auto">\n            ${themeBtn}\n            <LanguageSwitcher />`
);

fs.writeFileSync('src/app/portal/client-layout.tsx', layout, 'utf8');
