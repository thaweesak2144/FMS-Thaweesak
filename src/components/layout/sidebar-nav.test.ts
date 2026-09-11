import { describe, it, expect } from "vitest";
import { sidebarGroups, getActiveNavChain, visibleGroups } from "./sidebar-nav";

const viewer = { roles: [], permissions: ["users:read"], isSuperAdmin: false };
const admin = { roles: [], permissions: ["users:read", "users:manage", "roles:manage", "settings:manage"], isSuperAdmin: false };

describe("sidebar-nav", () => {
  it("เนเธ”เธเธเธญเธฃเนเธ”เนเธกเนเธ•เนเธญเธเธกเธตเธชเธดเธ—เธเธดเน", () => {
    expect(visibleGroups(viewer).some((g) => g.items.some((i) => i.href === "/dashboard"))).toBe(true);
  });
  it("viewer เนเธกเนเน€เธซเนเธเธเธ—เธเธฒเธ—เนเธฅเธฐเธ•เธฑเนเธเธเนเธฒ", () => {
    const hrefs = visibleGroups(viewer).flatMap((g) => g.items.flatMap((i) => [i.href, ...(i.children ?? []).map((c) => c.href)]));
    expect(hrefs).toContain("/users");
    expect(hrefs).not.toContain("/users/roles");
    expect(hrefs).not.toContain("/settings");
  });
  it("admin เน€เธซเนเธเธเธฃเธ เนเธฅเธฐเธเธฅเธธเนเธกเธ—เธตเนเนเธกเนเธกเธตเธฃเธฒเธขเธเธฒเธฃเน€เธซเธฅเธทเธญเธ–เธนเธเธ•เธฑเธ”", () => {
    const groups = visibleGroups(admin);
    expect(groups.flatMap((g) => g.items.map((i) => i.href))).toEqual(expect.arrayContaining(["/dashboard", "/users", "/settings"]));
    expect(groups.every((g) => g.items.length > 0)).toBe(true);
  });
  it("getActiveNavChain เน€เธฅเธทเธญเธ href เธ—เธตเนเธ•เธฃเธเธ—เธตเนเธชเธธเธ”", () => {
    expect(getActiveNavChain("/users/roles").map((c) => c.href)).toEqual(["/users", "/users/roles"]);
    expect(getActiveNavChain("/settings").map((c) => c.href)).toEqual(["/settings"]);
    expect(getActiveNavChain("/nowhere")).toEqual([]);
  });
  it("เนเธเธฃเธเน€เธกเธเธนเธกเธต 3 เธเธฅเธธเนเธก", () => expect(sidebarGroups).toHaveLength(12));
});
