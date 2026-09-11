const fs = require('fs');

let shell = fs.readFileSync('src/shared/components/liyon/admin-shell.tsx', 'utf8');

// 1. Revert the text replacement
shell = shell.replace(
  '{brandLogo ? <img src={brandLogo} alt={brandName} style={{ height: "2rem", objectFit: "contain" }} /> : <b>{brandName}</b>}',
  '<b>{brandName}</b>'
);

// 2. Replace the icon
const oldIcon = `<i>\r\n            <svg viewBox="0 0 24 24" aria-hidden="true">\r\n              <path d="M22 10 12 5 2 10l10 5 10-5Z" />\r\n              <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />\r\n            </svg>\r\n          </i>`;

const newIcon = `{brandLogo ? <img src={brandLogo} alt={brandName} style={{ height: "2rem", objectFit: "contain" }} /> : <i>\r\n            <svg viewBox="0 0 24 24" aria-hidden="true">\r\n              <path d="M22 10 12 5 2 10l10 5 10-5Z" />\r\n              <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />\r\n            </svg>\r\n          </i>}`;

// Because of CRLF or LF differences, let's use a regex to match the icon precisely regardless of line endings
const iconRegex = /<i>\s*<svg viewBox="0 0 24 24" aria-hidden="true">\s*<path d="M22 10 12 5 2 10l10 5 10-5Z" \/>\s*<path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" \/>\s*<\/svg>\s*<\/i>/;

const match = shell.match(iconRegex);
if (match) {
  shell = shell.replace(iconRegex, `{brandLogo ? <img src={brandLogo} alt={brandName} style={{ height: "2.5rem", width: "2.5rem", objectFit: "contain" }} /> : ${match[0]}}`);
} else {
  console.error("Icon regex not found!");
}

fs.writeFileSync('src/shared/components/liyon/admin-shell.tsx', shell, 'utf8');
