"use client";

import { useState, type ReactNode } from "react";

type InlinePreviewPanelProps = {
  children: ReactNode;
};

export default function InlinePreviewPanel({ children }: InlinePreviewPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-muted transition-colors hover:text-foreground"
      >
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
          Preview inline
        </span>
        <span>{open ? "Ocultar ▲" : "Mostrar ▼"}</span>
      </button>

      {open ? (
        <div className="max-h-[min(70vh,720px)] overflow-y-auto border-t border-border bg-background p-6 sm:p-8">
          <div className="pointer-events-none mx-auto max-w-3xl scale-[0.98] origin-top opacity-95">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
