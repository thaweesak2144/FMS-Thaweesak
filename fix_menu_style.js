const fs = require('fs');
let layout = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');
layout = layout.replace(
  '<DropdownMenuPrimitive.Content className="menu-list" align="end" sideOffset={12}>',
  '<DropdownMenuPrimitive.Content className="menu-list" align="end" sideOffset={12} style={{ position: "static" }}>'
);
fs.writeFileSync('src/app/portal/client-layout.tsx', layout, 'utf8');
