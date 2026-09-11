const fs = require('fs');

let layout = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');

layout = layout.replace('<DropdownMenuPrimitive.Root>', '<div className="acct">\n              <DropdownMenuPrimitive.Root>');
layout = layout.replace('</DropdownMenuPrimitive.Root>', '</DropdownMenuPrimitive.Root>\n            </div>');

fs.writeFileSync('src/app/portal/client-layout.tsx', layout, 'utf8');
