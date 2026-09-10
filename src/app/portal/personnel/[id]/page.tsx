import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Sparkles,
  User,
  Calendar,
} from "lucide-react";
import { getT, getLocale } from "@/i18n/server";
import { Button } from "@/components/ui/button";
import {
  getDefaultTenantId,
  getPersonnelById,
} from "@/features/personnel/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PersonnelDetailPage({ params }: Props) {
  const { id } = await params;
  const tenantId = await getDefaultTenantId();
  const personnel = await getPersonnelById(tenantId, id);

  if (!personnel || !personnel.isActive) {
    notFound();
  }

  const t = await getT();
  const locale = await getLocale();

  const fullName = locale === "th"
    ? `${personnel.academicRank ? personnel.academicRank + " " : ""}${personnel.titleTh} ${personnel.firstNameTh} ${personnel.lastNameTh}`
    : `${personnel.titleEn} ${personnel.firstNameEn} ${personnel.lastNameEn}`;
  const position = locale === "th" ? personnel.positionTh : personnel.positionEn;
  const deptName = locale === "th" ? personnel.departmentNameTh : personnel.departmentNameEn;
  const bio = locale === "th" ? (personnel.bioTh || personnel.bioEn) : (personnel.bioEn || personnel.bioTh);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link href="/portal/personnel">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            {t("portal.personnel.backToList")}
          </Button>
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="h-36 w-36 sm:h-44 sm:w-44 rounded-2xl bg-muted overflow-hidden border shadow-sm flex-shrink-0 flex items-center justify-center">
            {personnel.photoUrl ? (
              <img
                src={personnel.photoUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-20 w-20 text-muted-foreground/30" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 flex-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                <Building2 className="h-3.5 w-3.5" />
                {deptName}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {fullName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-medium mt-1">
                {position}
              </p>
            </div>

            {/* Contact details */}
            <div className="flex flex-wrap gap-4 pt-2 border-t text-sm">
              <a
                href={`mailto:${personnel.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>{personnel.email}</span>
              </a>
              {personnel.phone && (
                <a
                  href={`tel:${personnel.phone}`}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{personnel.phone}</span>
                </a>
              )}
            </div>

            {/* Expertise Tags */}
            {personnel.expertiseTags && personnel.expertiseTags.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>{t("personnel.expertise")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {personnel.expertiseTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio / About */}
      {bio && (
        <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {locale === "th" ? "เกี่ยวกับและประวัติการทำงาน" : "Biography & Background"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {bio}
          </p>
        </div>
      )}

      {/* Education History */}
      {personnel.educations && personnel.educations.length > 0 && (
        <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {t("personnel.educations")}
            </h2>
          </div>

          <div className="divide-y">
            {personnel.educations.map((edu) => (
              <div key={edu.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    {edu.degree} — {edu.major}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {edu.institution}
                  </div>
                </div>
                {edu.graduationYear && (
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md w-fit">
                    <Calendar className="h-3 w-3" />
                    <span>{edu.graduationYear}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
