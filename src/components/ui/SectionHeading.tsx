"use client";

import RevealPass from "@/components/ui/RevealPass";
import MaskedLines from "@/components/ui/MaskedLines";
import ActionLink from "@/components/ui/ActionLink";

type SectionHeadingProps = {
  kicker: string;
  /** One string per visual line — the break is a design decision, not the browser's. */
  titleLines: string[];
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "right";
};

export default function SectionHeading({
  kicker,
  titleLines,
  description,
  href,
  linkLabel,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-6 ${align === "right" ? "items-start md:items-end md:text-right" : ""}`}
    >
      <RevealPass from="left">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
          {kicker}
        </span>
      </RevealPass>

      <div
        className={`grid gap-6 md:grid-cols-[1fr_min(28rem,38%)] md:items-end md:gap-x-12 lg:gap-x-16 ${
          align === "right" ? "md:grid-cols-[min(28rem,38%)_1fr] md:justify-items-end" : ""
        }`}
      >
        {/* Headings are uncovered, never faded. */}
        <MaskedLines
          as="h2"
          lines={titleLines}
          className="font-display text-[13vw] leading-[0.88] text-foreground sm:text-[8vw] md:text-[5.5vw] lg:text-[4.5vw]"
        />

        {(description || href) && (
          <RevealPass
            delay={0.1}
            className={`flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:flex-col md:items-start ${
              align === "right" ? "md:items-end md:text-right" : ""
            }`}
          >
            {description && (
              <p className="max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base md:max-w-none">
                {description}
              </p>
            )}
            {href && linkLabel && <ActionLink href={href}>{linkLabel}</ActionLink>}
          </RevealPass>
        )}
      </div>
    </div>
  );
}
