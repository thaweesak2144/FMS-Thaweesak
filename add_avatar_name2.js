const fs = require('fs');

let layout = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');

const regex = /<button type="button" className="icon-btn hover:bg-muted" style={{ border: 'none', background: 'none' }}>[\s\S]*?<\/button>/;

const newButton = `<button type="button">
                    <span className="who" aria-hidden="true">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        initials
                      )}
                    </span>
                    <span className="nm">{user.name}</span>
                    <svg className="chev" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>`;

layout = layout.replace(regex, newButton);

fs.writeFileSync('src/app/portal/client-layout.tsx', layout, 'utf8');
