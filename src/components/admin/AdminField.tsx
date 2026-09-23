import type { ReactNode } from "react";

type AdminFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
};

export default function AdminField({ label, htmlFor, hint, children }: AdminFieldProps) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">{label}</span>
      {children}
      {hint ? <span className="text-xs text-faint">{hint}</span> : null}
    </label>
  );
}

export const adminInputClassName =
  "border-b border-border bg-transparent px-3 py-3 text-foreground outline-none transition-colors focus:border-brand";

export const adminTextareaClassName =
  "min-h-32 resize-y border border-border bg-transparent px-3 py-3 text-foreground outline-none transition-colors focus:border-brand";

export const adminSelectClassName =
  "border-b border-border bg-transparent px-3 py-3 text-foreground outline-none transition-colors focus:border-brand";
