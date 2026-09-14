"use client";

import ThemeToggle from "@/components/ui/ThemeToggle";
import VisualModeToggle from "@/components/ui/VisualModeToggle";

export default function AdminDisplayControls() {
  return (
    <div
      className="flex items-center gap-0.5 rounded border border-border bg-surface/40 px-0.5"
      aria-label="Preferências de exibição"
    >
      <VisualModeToggle />
      <ThemeToggle />
    </div>
  );
}
