"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { DUR, EASE_MECH } from "@/lib/motion";

type PrimaryButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  cursorLabel?: string;
  transitionType?: "nav-forward" | "nav-back";
  /** CSS color for the radial fill on hover. Defaults to brand blue. */
  fillColor?: string;
  disabled?: boolean;
};

/**
 * The site's primary CTA — radial fill from the pointer entry point.
 * Used on the home closing section, course pages and contact form.
 */
export default function PrimaryButton({
  children,
  href,
  type = "button",
  className,
  cursorLabel,
  transitionType = "nav-forward",
  fillColor = "var(--color-brand)",
  disabled,
}: PrimaryButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [lit, setLit] = useState(false);

  const trackOrigin = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setOrigin({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    });
  };

  const onEnter = (clientX: number, clientY: number) => {
    trackOrigin(clientX, clientY);
    setLit(true);
  };

  const classes = clsx(
    "group relative isolate inline-flex items-center gap-3 overflow-hidden bg-foreground px-7 py-4 text-sm font-medium text-void",
    disabled && "pointer-events-none opacity-50",
    className,
  );

  const body = (
    <>
      <motion.span
        aria-hidden="true"
        className="absolute -z-10 aspect-square w-[240%] rounded-full"
        style={{
          left: `${origin.x}%`,
          top: `${origin.y}%`,
          x: "-50%",
          y: "-50%",
          background: fillColor,
        }}
        initial={false}
        animate={{ scale: lit && !reduceMotion && !disabled ? 1 : 0 }}
        transition={{ duration: 0.38, ease: EASE_MECH }}
      />
      {children}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ x: lit ? 4 : 0 }}
        transition={{ duration: DUR.mech, ease: EASE_MECH }}
      >
        →
      </motion.span>
    </>
  );

  const handlers = {
    onPointerEnter: (e: React.PointerEvent) => onEnter(e.clientX, e.clientY),
    onPointerLeave: (e: React.PointerEvent) => {
      trackOrigin(e.clientX, e.clientY);
      setLit(false);
    },
    onFocus: () => {
      setOrigin({ x: 0, y: 50 });
      setLit(true);
    },
    onBlur: () => setLit(false),
  };

  if (href) {
    const external = href.startsWith("http");
    return (
      <Link
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        transitionTypes={external ? undefined : [transitionType]}
        data-cursor-label={cursorLabel}
        className={classes}
        {...handlers}
      >
        {body}
      </Link>
    );
  }

  return (
    <button ref={ref} type={type} disabled={disabled} className={classes} {...handlers}>
      {body}
    </button>
  );
}
