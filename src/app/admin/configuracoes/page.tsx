import AdminShell from "@/components/admin/AdminShell";
import SavedNotice from "@/components/admin/SavedNotice";
import SettingsForm from "@/components/admin/SettingsForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { ensureSettingsExist } from "@/app/admin/configuracoes/actions";
import { updateSettingsAction } from "@/app/admin/configuracoes/actions";

type PageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  await requireEditorPage();
  const { saved } = await searchParams;
  const settings = await ensureSettingsExist();

  return (
    <AdminShell title="Configurações" description="Contato, CTA e marquee da home.">
      <SavedNotice show={Boolean(saved)} />
      <SettingsForm settings={settings} action={updateSettingsAction} />
    </AdminShell>
  );
}
