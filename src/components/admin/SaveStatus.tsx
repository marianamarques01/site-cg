type SaveStatusProps = {
  message?: string;
  pending?: boolean;
};

export default function SaveStatus({ message, pending }: SaveStatusProps) {
  if (!message || pending) return null;

  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand"
    >
      <span aria-hidden>✓</span>
      Salvo com sucesso
    </span>
  );
}
