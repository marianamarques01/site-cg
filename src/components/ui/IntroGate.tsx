"use client";

import { useIntro } from "@/components/ui/IntroProvider";

/**
 * Blocks the Home from flashing before the splash decision runs.
 * Must unmount through React — never remove this node from the DOM
 * imperatively or client navigations crash with NotFoundError.
 */
export default function IntroGate() {
  const { introPending } = useIntro();
  if (!introPending) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-void"
      aria-hidden="true"
      suppressHydrationWarning
    />
  );
}
