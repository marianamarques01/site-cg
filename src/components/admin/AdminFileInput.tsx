"use client";

import { useState, type ChangeEvent, type Ref } from "react";

type AdminFileInputProps = {
  id: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function AdminFileInput({
  id,
  name,
  accept = "image/*",
  multiple = false,
  required,
  inputRef,
  onChange,
}: AdminFileInputProps) {
  const [summary, setSummary] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setSummary(
      files.length === 0 ? "" : files.length === 1 ? files[0].name : `${files.length} imagens escolhidas`,
    );
    onChange?.(event);
  }

  return (
    <span className="flex cursor-pointer items-center gap-3 border border-dashed border-border px-3 py-3 transition-colors focus-within:border-brand hover:border-brand">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        required={required}
        onChange={handleChange}
        className="sr-only"
      />
      <span className="shrink-0 border border-border px-3 py-1.5 text-sm text-foreground">
        {multiple ? "Escolher imagens" : "Escolher imagem"}
      </span>
      <span className="min-w-0 truncate text-sm text-muted">
        {summary || (multiple ? "Nenhuma imagem escolhida ainda" : "Nenhuma imagem escolhida ainda")}
      </span>
    </span>
  );
}
