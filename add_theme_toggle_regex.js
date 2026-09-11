const fs = require('fs');

let layout = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');

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
  /<div className="right hidden sm:flex">\s*<LanguageSwitcher \/>/,
  `<div className="right hidden sm:flex">\n            ${themeBtn}\n            <LanguageSwitcher />`
);

layout = layout.replace(
  /<div className="flex items-center gap-2 md:hidden ml-auto">\s*<LanguageSwitcher \/>/,
  `<div className="flex items-center gap-2 md:hidden ml-auto">\n            ${themeBtn}\n            <LanguageSwitcher />`
);

fs.writeFileSync('src/app/portal/client-layout.tsx', layout, 'utf8');
