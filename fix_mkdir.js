const fs = require('fs');

let act = fs.readFileSync('src/features/identity/_internal/actions/settings.actions.ts', 'utf8');
act = act.replace(
  'const filepath = join(process.cwd(), "public/uploads", filename);',
  `const uploadDir = join(process.cwd(), "public/uploads");
    require("fs").mkdirSync(uploadDir, { recursive: true });
    const filepath = join(uploadDir, filename);`
);

fs.writeFileSync('src/features/identity/_internal/actions/settings.actions.ts', act, 'utf8');
