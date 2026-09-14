type SavedNoticeProps = {
  show?: boolean;
  message?: string;
};

export default function SavedNotice({
  show,
  message = "Alterações salvas com sucesso.",
}: SavedNoticeProps) {
  if (!show) return null;

  return (
    <p className="border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand">{message}</p>
  );
}
