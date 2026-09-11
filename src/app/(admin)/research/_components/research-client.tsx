"use client";

import { useState, useTransition } from "react";
import { Plus, Settings2, Trash2, Microscope, BookOpen } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, StatusPill, LiyonDialog, LiyonDialogHeader, LiyonDialogFooter, LiyonField } from "@/shared/components/liyon";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  createPublicationAction,
  deletePublicationAction
} from "@/features/research/actions";
import type { ResearchProjectDto, PublicationDto } from "@/features/research/server";

export function ResearchClient({ 
  initialProjects, 
  initialPublications,
  canWrite,
  canManage 
}: { 
  initialProjects: ResearchProjectDto[];
  initialPublications: PublicationDto[];
  canWrite: boolean;
  canManage: boolean;
}) {
  const t = useT();
  const [activeTab, setActiveTab] = useState<"projects" | "publications">("projects");
  const [isPending, startTransition] = useTransition();

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ResearchProjectDto | null>(null);

  const [pubModalOpen, setPubModalOpen] = useState(false);

  // Project Form
  const [titleTh, setTitleTh] = useState("");
  const [researchType, setResearchType] = useState("BASIC");
  const [status, setStatus] = useState("PROPOSED");
  const [budget, setBudget] = useState(0);

  // Pub Form
  const [pubTitle, setPubTitle] = useState("");
  const [pubType, setPubType] = useState("JOURNAL");
  const [pubYear, setPubYear] = useState(new Date().getFullYear());

  const openCreateProject = () => {
    setEditingProject(null);
    setTitleTh("");
    setResearchType("BASIC");
    setStatus("PROPOSED");
    setBudget(0);
    setProjectModalOpen(true);
  };

  const openEditProject = (item: ResearchProjectDto) => {
    setEditingProject(item);
    setTitleTh(item.titleTh);
    setResearchType(item.researchType);
    setStatus(item.status);
    setBudget(item.budget ? Number(item.budget) : 0);
    setProjectModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!titleTh) {
      toast.error(t("common.required"));
      return;
    }
    const payload = {
      titleTh,
      researchType: researchType as any,
      budget,
      status: status as any,
      keywords: [],
    };

    startTransition(async () => {
      if (editingProject) {
        const res = await updateProjectAction({ ...payload, id: editingProject.id });
        if (res.ok) {
          toast.success(t("common.saved"));
          setProjectModalOpen(false);
          window.location.reload();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      } else {
        const res = await createProjectAction(payload);
        if (res.ok) {
          toast.success(t("common.saved"));
          setProjectModalOpen(false);
          window.location.reload();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      }
    });
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const res = await deleteProjectAction(id);
      if (res.ok) {
        toast.success(t("common.deleted"));
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const openCreatePub = () => {
    setPubTitle("");
    setPubType("JOURNAL");
    setPubYear(new Date().getFullYear());
    setPubModalOpen(true);
  };

  const handleSavePub = () => {
    if (!pubTitle) return toast.error(t("common.required"));
    
    startTransition(async () => {
      const res = await createPublicationAction({
        title: pubTitle,
        authors: ["Me"],
        publicationType: pubType as any,
        publishedYear: pubYear,
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        setPubModalOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleDeletePub = (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const res = await deletePublicationAction(id);
      if (res.ok) {
        toast.success(t("common.deleted"));
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const getStatusTone = (s: string) => {
    switch (s) {
      case "APPROVED": case "COMPLETED": return "ok";
      case "CANCELLED": return "bad";
      case "PROPOSED": return "warn";
      default: return "info";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("research.title")}</h1>
          <p className="text-muted-foreground">{t("research.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {canWrite && activeTab === "projects" && (
            <Button onClick={openCreateProject} className="gap-2">
              <Plus className="h-4 w-4" />
              Propose Project
            </Button>
          )}
          {canWrite && activeTab === "publications" && (
            <Button onClick={openCreatePub} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Publication
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b">
        <button 
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "projects" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("projects")}
        >
          {t("research.projects")}
        </button>
        <button 
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "publications" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("publications")}
        >
          {t("research.publications")}
        </button>
      </div>

      {activeTab === "projects" && (
        <div className="bg-card border rounded-xl shadow-sm">
          <DataTable
            state={initialProjects.length === 0 ? "empty" : "data"}
            rows={initialProjects}
            getRowId={(d: ResearchProjectDto) => d.id}
            headHeading={t("research.projects")}
            empty={{ icon: <Microscope className="h-8 w-8" />, title: t("common.noData") }}
            error={{ icon: <Microscope className="h-8 w-8" />, title: t("common.error") }}
            columns={[
              {
                key: "title",
                header: t("research.project.titleTh"),
                render: (d: ResearchProjectDto) => <div className="font-medium text-sm max-w-md truncate">{d.titleTh}</div>
              },
              {
                key: "type",
                header: t("research.project.researchType"),
                render: (d: any) => <div className="text-sm">{d.researchType}</div>
              },
              {
                key: "principal",
                header: t("research.project.principal"),
                render: (d: any) => <div className="text-sm">{d.principal ? `${d.principal.firstNameTh} ${d.principal.lastNameTh}` : "-"}</div>
              },
              {
                key: "budget",
                header: t("research.project.budget"),
                render: (d: any) => <div className="text-sm">{d.budget ? Number(d.budget).toLocaleString() : "-"}</div>
              },
              {
                key: "status",
                header: t("research.project.status"),
                render: (d: any) => (
                  <StatusPill tone={getStatusTone(d.status) as any}>
                    {t(`research.status.${d.status}` as any) || d.status}
                  </StatusPill>
                )
              },
              {
                key: "actions",
                header: "",
                render: (d: any) => (
                  <div className="flex items-center justify-end gap-2">
                    {(canWrite || canManage) && (
                      <Button variant="ghost" size="sm" onClick={() => openEditProject(d)}>
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                    {canManage && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(d.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                )
              }
            ]}
          />
        </div>
      )}

      {activeTab === "publications" && (
        <div className="bg-card border rounded-xl shadow-sm">
          <DataTable
            state={initialPublications.length === 0 ? "empty" : "data"}
            rows={initialPublications}
            getRowId={(d: PublicationDto) => d.id}
            headHeading={t("research.publications")}
            empty={{ icon: <BookOpen className="h-8 w-8" />, title: t("common.noData") }}
            error={{ icon: <BookOpen className="h-8 w-8" />, title: t("common.error") }}
            columns={[
              {
                key: "title",
                header: t("research.publication.title"),
                render: (d: PublicationDto) => <div className="font-medium text-sm max-w-md truncate">{d.title}</div>
              },
              {
                key: "type",
                header: t("research.publication.type"),
                render: (d: any) => <div className="text-sm">{d.publicationType}</div>
              },
              {
                key: "year",
                header: t("research.publication.year"),
                render: (d: any) => <div className="text-sm">{d.publishedYear}</div>
              },
              {
                key: "actions",
                header: "",
                render: (d: any) => (
                  <div className="flex items-center justify-end gap-2">
                    {canManage && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePub(d.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                )
              }
            ]}
          />
        </div>
      )}

      {/* Project Modal */}
      <LiyonDialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
        <LiyonDialogHeader title={editingProject ? "Edit Project" : "Propose Project"} />
        <div className="p-6 space-y-4">
          <LiyonField label={t("research.project.titleTh")}>
            <input 
              value={titleTh} 
              onChange={(e) => setTitleTh(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label={t("research.project.researchType")}>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={researchType}
              onChange={(e) => setResearchType(e.target.value)}
            >
              <option value="BASIC">BASIC</option>
              <option value="APPLIED">APPLIED</option>
              <option value="INNOVATION">INNOVATION</option>
            </select>
          </LiyonField>
          <LiyonField label={t("research.project.budget")}>
            <input 
              type="number"
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          {editingProject && canManage && (
            <LiyonField label={t("research.project.status")}>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PROPOSED">PROPOSED</option>
                <option value="APPROVED">APPROVED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </LiyonField>
          )}
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setProjectModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveProject} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Pub Modal */}
      <LiyonDialog open={pubModalOpen} onOpenChange={setPubModalOpen}>
        <LiyonDialogHeader title="Add Publication" />
        <div className="p-6 space-y-4">
          <LiyonField label={t("research.publication.title")}>
            <input 
              value={pubTitle} 
              onChange={(e) => setPubTitle(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label={t("research.publication.type")}>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={pubType}
              onChange={(e) => setPubType(e.target.value)}
            >
              <option value="JOURNAL">JOURNAL</option>
              <option value="CONFERENCE">CONFERENCE</option>
              <option value="BOOK_CHAPTER">BOOK_CHAPTER</option>
              <option value="PATENT">PATENT</option>
            </select>
          </LiyonField>
          <LiyonField label={t("research.publication.year")}>
            <input 
              type="number"
              value={pubYear} 
              onChange={(e) => setPubYear(Number(e.target.value))} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setPubModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSavePub} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
