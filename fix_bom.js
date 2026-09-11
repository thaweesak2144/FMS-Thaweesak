const fs = require('fs');
const files = [
  'src/app/(admin)/client-layout.tsx',
  'src/shared/components/liyon/admin-shell.tsx',
  'src/features/identity/_internal/services/tenant.service.ts',
  'src/features/identity/server.ts',
  'src/app/portal/client-layout.tsx',
  'src/app/(admin)/settings/_components/settings-form.tsx'
];

files.forEach(file => {
  try {
    let buf = fs.readFileSync(file);
    // Remove BOM if present (EF BB BF)
    if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
      buf = buf.subarray(3);
    }
    // Also, when reading with PowerShell and Set-Content, sometimes it corrupts Thai if read without -Encoding UTF8
    fs.writeFileSync(file, buf);
  } catch(e) {
    console.error('Failed', file, e);
  }
});
