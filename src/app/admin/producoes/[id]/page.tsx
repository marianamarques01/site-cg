import AdminShell from "@/components/admin/AdminShell";
import SavedNotice from "@/components/admin/SavedNotice";
import SubmissionReviewBanner from "@/components/admin/SubmissionReviewBanner";
import ProjectForm from "@/components/admin/ProjectForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { findMediaUrl } from "@/lib/admin/helpers";
import { listMedia } from "@/lib/admin/media";
import { getProjectGalleryMediaIds } from "@/lib/admin/gallery";
import { getAdminProjectById } from "@/lib/admin/projects";
import { deleteProjectAction, updateProjectAction } from "@/app/admin/producoes/actions";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminEditProjectPage({ params, searchParams }: PageProps) {
  await requireEditorPage();
  const { id } = await params;
  const { saved, error } = await searchParams;
  const [project, mediaItems, galleryInitialIds] = await Promise.all([
    getAdminProjectById(id),
    listMedia(),
    getProjectGalleryMediaIds(id),
  ]);
  if (!project) notFound();

  return (
    <AdminShell title="Editar produção" description={project.title}>
      <SavedNotice show={Boolean(saved)} />
      {error === "motivo" ? (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Informe o motivo da rejeição.
        </p>
      ) : null}
      <SubmissionReviewBanner project={project} />
      <ProjectForm
        project={project}
        mediaItems={mediaItems}
        currentCoverUrl={findMediaUrl(mediaItems, project.cover_image_id)}
        galleryInitialIds={galleryInitialIds}
        action={updateProjectAction}
        deleteAction={deleteProjectAction}
      />
    </AdminShell>
  );
}
