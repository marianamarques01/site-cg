"use client";

type DeleteRowButtonProps = {
  id: string;
  title: string;
  action: (formData: FormData) => void | Promise<void>;
};

export default function DeleteRowButton({ id, title, action }: DeleteRowButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Excluir “${title}”? Essa ação não pode ser desfeita.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-red-400 hover:underline">
        Excluir
      </button>
    </form>
  );
}
