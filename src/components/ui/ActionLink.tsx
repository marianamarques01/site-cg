"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { DUR, EASE_MECH } from "@/lib/motion";

type ActionLinkProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  arrow?: boolean;
  /** For use inside a parent link/card that already tracks its own hover. */
  active?: boolean;
  cursorLabel?: string;
  /** Which way this link moves through the hierarchy. */
  transitionType?: "nav-forward" | "nav-back";
};

// The line wipes out to the right, then redraws from the left. The swap
// happens across 4% of the duration, while the rule is fully clipped.
const REDRAW = [
  "inset(0% 0% 0% 0%)",
  "inset(0% 0% 0% 100%)",
  "inset(0% 100% 0% 0%)",
  "inset(0% 0% 0% 0%)",
];
const REST = "inset(0% 0% 0% 0%)";

/**
 * The site's one ignition gesture.
 *
 * There used to be four competing link treatments — a scaling underline in the
 * header, a border that changed colour in three other components, a nudging
 * arrow, and a text colour swap. One gesture applied everywhere is the
 * difference between having hover states and having a system.
 *
 * Hover and keyboard focus produce exactly the same thing, deliberately.
 */
export default function ActionLink({
  children,
  href,
  className,
  arrow = true,
  active,
  cursorLabel,
  transitionType = "nav-forward",
}: ActionLinkProps) {
  const [self, setSelf] = useState(false);
  const lit = typeof active === "boolean" ? active : self;

  const body = (
    <>
      <span className="relative">
        {children}
        <motion.span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-px w-full bg-current"
          initial={false}
          animate={{ clipPath: lit ? REDRAW : REST }}
          transition={
            lit
              ? { duration: DUR.mechSlow, times: [0, 0.46, 0.5, 1], ease: EASE_MECH }
              : { duration: DUR.mech, ease: EASE_MECH }
          }
        />
      </span>
      {arrow && (
        <motion.span
          aria-hidden="true"
          className="shrink-0"
          initial={false}
          animate={{ x: lit ? 4 : 0 }}
          transition={{ duration: DUR.mech, ease: EASE_MECH }}
        >
          →
        </motion.span>
      )}
    </>
  );

  const classes = clsx(
    "group/action inline-flex w-fit shrink-0 items-center gap-3 pb-1 text-sm font-medium transition-colors duration-300",
    lit ? "text-brand" : "text-foreground",
    className,
  );

  if (!href) {
    return (
      <span className={classes} data-action-link="">
        {body}
      </span>
    );
  }

  return (
    <Link
      href={href}
      transitionTypes={[transitionType]}
      className={classes}
      data-cursor-label={cursorLabel}
      onPointerEnter={() => setSelf(true)}
      onPointerLeave={() => setSelf(false)}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) setSelf(true);
      }}
      onBlur={() => setSelf(false)}
    >
      {body}
    </Link>
  );
}
