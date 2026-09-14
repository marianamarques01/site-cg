"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type ScrollRailProps = {
  children: ReactNode[];
  /** Applied to each item wrapper. */
  itemClassName?: string;
  onActiveChange?: (index: number) => void;
  /** Rendered above the rail, inside the pinned viewport. */
  header?: ReactNode;
  /** Pinned desktop layout: start keeps header + rail tight at the top. */
  pinnedAlign?: "center" | "start";
};

/**
 * A horizontal rail driven by vertical scroll.
 *
 * This is not scroll hijacking: the speed is still entirely the reader's and
 * nothing is animated on a timer — the page's own scroll position is simply
 * mapped onto a different axis. It replaces an `overflow-x: auto` strip that
 * only moved if you knew to drag it sideways, which meant plenty of people
 * never reached the third game.
 *
 * Touch and reduced-motion keep the native scroller: there, dragging sideways
 * is the expected gesture and pinning would only get in the way.
 */
export default function ScrollRail(props: ScrollRailProps) {
  const reduceMotion = useReducedMotion();
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const decide = () => {
      setPinned(window.matchMedia("(min-width: 768px)").matches && !reduceMotion);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, [reduceMotion]);

  // The pinned rail is a separate component so its `useScroll` target is
  // attached from its very first render — a ref that only appears in one
  // branch leaves the scroll subscription pointing at nothing.
  return pinned ? <PinnedRail {...props} /> : <NativeRail {...props} />;
}

function NativeRail({ children, itemClassName, header }: ScrollRailProps) {
  return (
    <>
      {header}
      <div
        data-cursor="drag"
        className="scrollbar-none flex gap-5 overflow-x-auto pb-4 pl-[var(--gutter)] pr-[var(--gutter)] [scroll-padding-left:var(--gutter)] snap-x snap-mandatory sm:gap-8"
        style={{ scrollbarWidth: "none" }}
      >
        {children.map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${itemClassName ?? ""}`}>
            {child}
          </div>
        ))}
        <div className="w-px shrink-0 snap-start" aria-hidden="true" />
      </div>
    </>
  );
}

function PinnedRail({
  children,
  itemClassName,
  onActiveChange,
  header,
  pinnedAlign = "center",
}: ScrollRailProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ travel: 0, stride: 0, width: 0, viewport: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -metrics.travel]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => {
      const items = Array.from(rail.children) as HTMLElement[];
      if (items.length === 0) return;
      const width = items[0].offsetWidth;
      const stride =
        items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : width;
      setMetrics({
        travel: Math.max(0, rail.scrollWidth - window.innerWidth * 0.82),
        stride,
        width,
        viewport: window.innerWidth,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [children.length]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!onActiveChange || metrics.travel === 0) return;
    const index = Math.round(p * (children.length - 1));
    onActiveChange(Math.min(children.length - 1, Math.max(0, index)));
  });

  // Enough runway that each card gets roughly two thirds of a screen of
  // scroll to itself, and no more.
  const trackVh = 72 + children.length * 38;

  return (
    <div ref={sectionRef} style={{ height: `${trackVh}vh` }}>
      <div
        className={
          pinnedAlign === "start"
            ? "sticky top-0 flex h-screen flex-col justify-start overflow-hidden pt-[calc(var(--header-h)+1.25rem)]"
            : "sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
        }
      >
        {header}
        <motion.div
          ref={railRef}
          className={`flex w-max items-start gap-8 pl-[var(--gutter)] pr-[var(--gutter)]${header ? " mt-8 md:mt-10" : ""}`}
          style={{ x }}
        >
          {children.map((child, i) => (
            <RailItem key={i} index={i} metrics={metrics} x={x} className={itemClassName}>
              {child}
            </RailItem>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function RailItem({
  children,
  index,
  metrics,
  x,
  className,
}: {
  children: ReactNode;
  index: number;
  metrics: { stride: number; width: number; viewport: number };
  x: MotionValue<number>;
  className?: string;
}) {
  // Staging is a function of where the card actually is, not of hover — so it
  // reads the same on a touchscreen as it does under a mouse.
  const distance = useTransform(x, (value) => {
    if (!metrics.viewport || !metrics.stride) return 0;
    const centre = index * metrics.stride + metrics.width / 2 + value;
    return Math.min(1, Math.abs(centre - metrics.viewport / 2) / (metrics.viewport / 2));
  });

  // Scale and opacity only. A per-card `filter: saturate()` would read a
  // little richer and would also put four filtered layers through
  // re-rasterization on every scroll frame, which is not a trade this page
  // can afford twice.
  const scale = useTransform(distance, [0, 1], [1, 0.94]);
  const opacity = useTransform(distance, [0, 1], [1, 0.55]);

  return (
    <motion.div className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
}
