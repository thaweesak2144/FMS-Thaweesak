"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Mail, Building2, User, ArrowRight } from "lucide-react";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import type { PersonnelDto, DepartmentDto } from "@/features/personnel";

interface Props {
  personnelList: PersonnelDto[];
  departments: DepartmentDto[];
}

export function PortalPersonnelClient({ personnelList, departments }: Props) {
  const t = useT();
  const locale = useLocale();

  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = personnelList.filter((item) => {
    // Only active personnel are shown on portal
    if (!item.isActive) return false;

    if (selectedDept !== "ALL" && item.departmentId !== selectedDept) {
      return false;
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const nameTh = `${item.academicRank || ""} ${item.titleTh} ${item.firstNameTh} ${item.lastNameTh}`.toLowerCase();
      const nameEn = `${item.titleEn} ${item.firstNameEn} ${item.lastNameEn}`.toLowerCase();
      const pos = `${item.positionTh} ${item.positionEn}`.toLowerCase();
      const tags = (item.expertiseTags || []).join(" ").toLowerCase();

      return nameTh.includes(q) || nameEn.includes(q) || pos.includes(q) || tags.includes(q) || item.email.toLowerCase().includes(q);
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {t("portal.personnel.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("portal.personnel.subtitle")}
        </p>
      </div>

      {/* Search & Department Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "th" ? "ค้นหาชื่ออาจารย์, ความเชี่ยวชาญ, ตำแหน่ง หรืออีเมล..." : "Search name, expertise, position or email..."}
            className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Department Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedDept("ALL")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedDept === "ALL"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {t("portal.personnel.filterAll")} ({personnelList.filter(p => p.isActive).length})
          </button>
          {departments.map((dept) => {
            const count = personnelList.filter(p => p.isActive && p.departmentId === dept.id).length;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedDept === dept.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {locale === "th" ? dept.nameTh : dept.nameEn} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Personnel Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed">
          <User className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-semibold text-base text-foreground">
            {locale === "th" ? "ไม่พบข้อมูลบุคลากร" : "No personnel found"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {locale === "th" ? "ลองค้นหาด้วยคำสำคัญอื่น หรือเลือกภาควิชาทั้งหมด" : "Try different keywords or select all departments"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => {
            const fullName = locale === "th"
              ? `${item.academicRank ? item.academicRank + " " : ""}${item.titleTh} ${item.firstNameTh} ${item.lastNameTh}`
              : `${item.titleEn} ${item.firstNameEn} ${item.lastNameEn}`;
            const position = locale === "th" ? item.positionTh : item.positionEn;
            const deptName = locale === "th" ? item.departmentNameTh : item.departmentNameEn;

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Header */}
                  <div className="aspect-square w-full bg-muted relative overflow-hidden flex items-center justify-center">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/40">
                        <User className="h-20 w-20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-background/90 backdrop-blur shadow-sm">
                        {t(`personnel.type.${item.personnelType}`)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-[11px] font-medium text-primary flex items-center gap-1 mb-1">
                        <Building2 className="h-3 w-3" />
                        <span>{deptName}</span>
                      </div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                        {fullName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {position}
                      </p>
                    </div>

                    {/* Expertise Tags */}
                    {item.expertiseTags && item.expertiseTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.expertiseTags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.expertiseTags.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            +{item.expertiseTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <div className="border-t pt-3 flex items-center justify-between text-xs">
                    <a
                      href={`mailto:${item.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 truncate max-w-[170px]"
                      title={item.email}
                    >
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{item.email}</span>
                    </a>
                    <Link
                      href={`/portal/personnel/${item.id}`}
                      className="font-semibold text-primary inline-flex items-center gap-0.5 hover:underline flex-shrink-0"
                    >
                      {locale === "th" ? "ประวัติ" : "Profile"}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
