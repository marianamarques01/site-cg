"use client";

import clsx from "clsx";
import { useVisualMode } from "@/components/ui/VisualModeProvider";

type VisualModeToggleProps = {
  className?: string;
};

export default function VisualModeToggle({ className }: VisualModeToggleProps) {
  const { visualMode, toggleVisualMode } = useVisualMode();
  const isMinimal = visualMode === "minimal";

  return (
    <button
      type="button"
      onClick={toggleVisualMode}
      className={clsx(
        "relative z-50 flex h-11 items-center gap-2 px-1 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-brand sm:px-2",
        className,
      )}
      aria-label={
        isMinimal
          ? "Ativar versão cinematográfica completa"
          : "Ativar versão minimalista"
      }
      title={isMinimal ? "Modo cinema" : "Modo minimal"}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "flex h-7 w-7 items-center justify-center border transition-colors",
          isMinimal ? "border-border text-brand" : "border-brand/50 text-brand",
        )}
      >
        {isMinimal ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path
              d="M4 8h16M4 12h10M4 16h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path
              d="M12 3l2.4 6.8H21l-5.5 4 2.1 6.7L12 16.4 6.4 20.5l2.1-6.7L3 9.8h6.6L12 3z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="hidden lg:inline">{isMinimal ? "Cinema" : "Minimal"}</span>
    </button>
  );
}
