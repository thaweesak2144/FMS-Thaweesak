"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Building2, Clock, BookOpen, Banknote, CheckCircle2, LayoutList } from "lucide-react";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import type { CurriculumDto, CurriculumPlanDto } from "@/features/curriculum";

interface Props {
  curriculum: CurriculumDto;
  plans: CurriculumPlanDto[];
}

export function PortalCurriculumDetailClient({ curriculum, plans }: Props) {
  const t = useT();
  const locale = useLocale();

  const name = locale === "th" ? curriculum.nameTh : curriculum.nameEn;
  const deptName = locale === "th" ? curriculum.departmentNameTh : curriculum.departmentNameEn;
  const philosophy = locale === "th" ? curriculum.philosophyTh : curriculum.philosophyEn;
  const careers = locale === "th" ? curriculum.careerProspectsTh : curriculum.careerProspectsEn;

  // Group plans by year, then by semester
  const plansByYear = plans.reduce((acc, plan) => {
    if (!acc[plan.academicYear]) acc[plan.academicYear] = {};
    if (!acc[plan.academicYear][plan.semester]) acc[plan.academicYear][plan.semester] = [];
    acc[plan.academicYear][plan.semester].push(plan);
    return acc;
  }, {} as Record<number, Record<number, CurriculumPlanDto[]>>);

  const years = Object.keys(plansByYear).map(Number).sort((a, b) => a - b);
  
  const [activeYear, setActiveYear] = useState<number | null>(years[0] || null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        href="/portal/curriculum"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("portal.curriculum.backToList")}
      </Link>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
            <GraduationCap className="h-4 w-4" />
            {t(`curriculum.level.${curriculum.degreeLevel}`)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
            <Building2 className="h-4 w-4" />
            {deptName}
          </span>
        </div>
        
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {name}
          </h1>
          <p className="text-lg text-muted-foreground mt-2 font-mono">
            {t("curriculum.code")}: {curriculum.code}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
           <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
             <Clock className="h-6 w-6 text-primary mb-2" />
             <div className="text-xs font-bold text-muted-foreground uppercase">{t("curriculum.studyPeriod")}</div>
             <div className="text-lg font-bold">{curriculum.studyPeriodYears} {t("portal.curriculum.yearsUnit")}</div>
           </div>
           <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
             <BookOpen className="h-6 w-6 text-primary mb-2" />
             <div className="text-xs font-bold text-muted-foreground uppercase">{t("curriculum.totalCredits")}</div>
             <div className="text-lg font-bold">{curriculum.totalCredits} {t("portal.curriculum.creditsUnit")}</div>
           </div>
           <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
             <Banknote className="h-6 w-6 text-primary mb-2" />
             <div className="text-xs font-bold text-muted-foreground uppercase">{t("curriculum.tuitionFee")}</div>
             <div className="text-lg font-bold">{curriculum.tuitionFee ? curriculum.tuitionFee.toLocaleString() : "-"}</div>
           </div>
           <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
             <CheckCircle2 className="h-6 w-6 text-emerald-500 mb-2" />
             <div className="text-xs font-bold text-muted-foreground uppercase">{t("curriculum.year")}</div>
             <div className="text-lg font-bold">พ.ศ. {curriculum.curriculumYear}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          {philosophy && (
             <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
               <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                 <GraduationCap className="h-5 w-5 text-primary" />
                 {t("curriculum.philosophyTh")}
               </h3>
               <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                 {philosophy}
               </p>
             </div>
          )}
          {careers && (
             <div className="bg-card rounded-2xl p-6 border shadow-sm">
               <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                 <Building2 className="h-5 w-5 text-primary" />
                 {t("curriculum.careerProspectsTh")}
               </h3>
               <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                 {careers}
               </p>
             </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 pb-2 border-b">
            <LayoutList className="h-6 w-6 text-primary" />
            {t("curriculum.plan.title")}
          </h2>

          {years.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-foreground">
                {t("curriculum.plan.noCourses")}
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setActiveYear(activeYear === y ? null : y)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      activeYear === y 
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t("curriculum.plan.year")} {y}
                  </button>
                ))}
              </div>

              {activeYear && plansByYear[activeYear] && (
                <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  {Object.keys(plansByYear[activeYear]).map(Number).sort((a,b)=>a-b).map((semester) => (
                    <div key={semester} className="bg-card rounded-xl border shadow-sm overflow-hidden">
                       <div className="bg-muted/50 px-4 py-3 border-b flex justify-between items-center">
                         <h4 className="font-bold text-sm">
                           {t("curriculum.plan.semester")} {semester}
                         </h4>
                         <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                           {plansByYear[activeYear][semester].reduce((acc, p) => acc + p.credits, 0)} {t("curriculum.plan.credits")}
                         </span>
                       </div>
                       <div className="divide-y">
                         {plansByYear[activeYear][semester].map((course) => (
                           <div key={course.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors">
                             <div className="flex items-start sm:items-center gap-3">
                               <div className="w-20 font-mono text-sm font-semibold text-muted-foreground shrink-0">
                                 {course.courseCode}
                               </div>
                               <div>
                                 <div className="font-semibold text-sm">
                                   {locale === "th" ? course.courseNameTh : course.courseNameEn}
                                 </div>
                                 <div className="text-xs text-muted-foreground mt-0.5">
                                   {course.courseType}
                                 </div>
                               </div>
                             </div>
                             <div className="text-sm font-bold shrink-0 self-end sm:self-auto bg-muted px-2 py-1 rounded">
                               {course.credits} <span className="text-xs font-medium text-muted-foreground">หน่วยกิต</span>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
