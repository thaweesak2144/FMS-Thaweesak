"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, Clock, Building2 } from "lucide-react";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { Button } from "@/components/ui/button";
import type { CurriculumDto } from "@/features/curriculum";

interface Props {
  curriculums: CurriculumDto[];
}

export function PortalCurriculumClient({ curriculums }: Props) {
  const t = useT();
  const locale = useLocale();

  const activeCurriculums = curriculums.filter((c) => c.isActive);

  // Collect unique degree levels available
  const availableLevels = Array.from(new Set(activeCurriculums.map((c) => c.degreeLevel)));
  
  // Default to BACHELOR if exists, else first available
  const [selectedLevel, setSelectedLevel] = useState<string>(
    availableLevels.includes("BACHELOR") ? "BACHELOR" : availableLevels[0] || ""
  );

  const filtered = activeCurriculums.filter((c) => c.degreeLevel === selectedLevel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {t("portal.curriculum.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("portal.curriculum.subtitle")}
        </p>
      </div>

      {availableLevels.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {availableLevels.map((lvl) => (
             <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedLevel === lvl
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {t(`curriculum.level.${lvl}`)}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-semibold text-base text-foreground">
             {t("portal.curriculum.noCurriculum")}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const name = locale === "th" ? item.nameTh : item.nameEn;
            const deptName = locale === "th" ? item.departmentNameTh : item.departmentNameEn;
            
            return (
              <div
                key={item.id}
                className="group relative bg-card rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      <GraduationCap className="h-3 w-3" />
                      {t(`curriculum.level.${item.degreeLevel}`)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {deptName}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors leading-snug">
                      {name}
                    </h3>
                    <p className="text-sm font-mono text-muted-foreground mt-1">
                      {t("curriculum.code")}: {item.code}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t("curriculum.studyPeriod")}
                      </div>
                      <div className="text-sm font-semibold">
                        {item.studyPeriodYears} {t("portal.curriculum.yearsUnit")}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {t("curriculum.totalCredits")}
                      </div>
                      <div className="text-sm font-semibold">
                        {item.totalCredits} {t("portal.curriculum.creditsUnit")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                   <Link href={`/portal/curriculum/${item.id}`} className="block w-full">
                     <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
                       {t("portal.curriculum.viewDetails")}
                       <ArrowRight className="h-4 w-4 ml-2" />
                     </Button>
                   </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
