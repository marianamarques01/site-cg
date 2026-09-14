import { ViewTransition, type ReactNode } from "react";

/**
 * Directional page transitions.
 *
 * Must wrap the content of each `page.tsx` individually — layouts persist
 * across navigations, so enter/exit never fire from there.
 *
 * `default: "none"` keeps browser back/forward, `router.refresh()` and
 * Suspense reveals out of the directional slide; only links that declare a
 * `transitionTypes` get one.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
