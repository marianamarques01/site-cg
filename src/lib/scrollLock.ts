/**
 * Single owner for `body.overflow`.
 *
 * The splash and the mobile menu both used to set it directly, so closing the
 * menu while the splash was still running unlocked the page underneath it.
 * Locks are counted: the style only comes back when the last holder releases.
 */

let locks = 0;
let previousOverflow: string | null = null;

export function lockScroll() {
  if (typeof document === "undefined") return;
  if (locks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  locks += 1;
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  if (locks === 0) return;
  locks -= 1;
  if (locks === 0) {
    document.body.style.overflow = previousOverflow ?? "";
    previousOverflow = null;
  }
}
