"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import HeroBackground from "@/components/home/HeroBackground";
import { useIntro } from "@/components/ui/IntroProvider";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

/* --------------------------------------------------------------------------
   Not a screen in front of the Home — the Home's hero, shot close, pulling
   back. One continuous camera move: compose → pause → wordmark → zoom out →
   small FLIP corrections onto the real anchors in the last ~18%.
   -------------------------------------------------------------------------- */

const TOTAL_S = 2.25;
const SKIP_S = 0.48;

/** Progress gates (0–1). Mapped to ~2250ms total. */
const P = {
  composeStart: 0.067,
  composeEnd: 0.31,
  pauseEnd: 0.378,
  wordmarkEnd: 0.52,
  cameraStart: 0.511,
  cameraEnd: 0.9,
  homePeek: 0.58,
  measure: 0.72,
  handoff: 0.756,
  correctionStart: 0.78,
  correctionEnd: 0.96,
  finish: 0.956,
  overlayFade: 0.82,
} as const;

const DEPTH_MARK = 5;

type PathSpec = { d: string; enterFrom: number; stagger: number };

const PATHS: PathSpec[] = [
  {
    d: "M225.703 0.744127C227.106 0.558245 228.675 0.470957 230.093 0.401985C307.421 -3.35938 364.013 19.2362 420.832 69.8463C226.599 126.506 167.769 272.496 168.167 458.298C168.085 465.922 168.509 474.392 168.739 482.075C143.394 474.519 112.942 456.876 92.4968 440.415C41.3957 399.427 8.67282 339.792 1.53624 274.646C-5.82123 208.907 13.4492 142.959 55.0398 91.5434C98.4176 37.7344 157.569 7.99951 225.703 0.744127Z",
    enterFrom: -8,
    stagger: 0,
  },
  {
    d: "M380.155 301.233C417.593 299.055 450.079 305.71 485.08 318.2C480.261 334.31 473.829 349.892 465.881 364.71C433.287 425.41 380.86 465.979 315.404 485.708C282.484 495.062 251.172 496.733 217.327 493.155C231.625 395.528 270.04 309.11 380.155 301.233Z",
    enterFrom: 6,
    stagger: 0.035,
  },
  {
    d: "M459.535 142.025C460.723 141.76 469.575 141.431 471.346 141.342C485.716 167.152 493.74 207.512 495.011 236.821C463.564 228.182 410.688 227.568 378.368 233.667C313.97 245.817 265.726 278.503 228.612 331.795C222.364 341.165 217.084 351.009 212.147 361.117C238.584 229.47 325.378 152.738 459.535 142.025Z",
    enterFrom: -10,
    stagger: 0.07,
  },
];

type MotionPlan = {
  markCameraX: number;
  markCameraY: number;
  markCameraScale: number;
  markCorrX: number;
  markCorrY: number;
  markCorrScale: number;
  wordStartX: number;
  wordStartY: number;
  wordStartScale: number;
  wordBox: DOMRect;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function rangeProgress(p: number, start: number, end: number) {
  return clamp01((p - start) / (end - start));
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function mixMarkMotion(
  p: number,
  plan: MotionPlan | null,
): { x: number; y: number; scale: number; opacity: number } {
  if (!plan) {
    const compose = rangeProgress(p, P.composeStart, P.composeEnd);
    return { x: 0, y: 0, scale: 1.06 - compose * 0.06, opacity: compose > 0.05 ? 1 : 0 };
  }

  const cameraT = easeOutCubic(rangeProgress(p, P.cameraStart, P.cameraEnd));
  const corrT = easeOutCubic(rangeProgress(p, P.correctionStart, P.correctionEnd));
  const fadeOut = rangeProgress(p, P.overlayFade, 1);

  return {
    x: plan.markCameraX * cameraT + plan.markCorrX * corrT,
    y: plan.markCameraY * cameraT + plan.markCorrY * corrT,
    scale: plan.markCameraScale + plan.markCorrScale * corrT,
    opacity: 1 - fadeOut * 0.95,
  };
}

function mixWordMotion(
  p: number,
  plan: MotionPlan | null,
): { x: number; y: number; scale: number; reveal: number; opacity: number } {
  if (!plan) return { x: 0, y: 0, scale: 0.14, reveal: 0, opacity: 0 };

  const reveal = easeOutCubic(rangeProgress(p, P.pauseEnd, P.wordmarkEnd));
  const cameraT = easeOutCubic(rangeProgress(p, P.cameraStart, P.cameraEnd));
  const corrT = easeOutCubic(rangeProgress(p, P.correctionStart, P.correctionEnd));
  const fadeOut = rangeProgress(p, P.overlayFade, 1);

  const fromX = plan.wordStartX * (1 - cameraT);
  const fromY = plan.wordStartY * (1 - cameraT);
  const fromScale = plan.wordStartScale + (1 - plan.wordStartScale) * cameraT;

  return {
    x: fromX,
    y: fromY,
    scale: fromScale,
    reveal,
    opacity: reveal * (1 - fadeOut * 0.95) * (1 - corrT * 0.15),
  };
}

function MarkPath({
  path,
  progress,
}: {
  path: PathSpec;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) => {
    const t = rangeProgress(p, P.composeStart + path.stagger, P.composeEnd);
    return easeOutCubic(t);
  });
  const transform = useTransform(progress, (p) => {
    const t = rangeProgress(p, P.composeStart + path.stagger, P.composeEnd);
    const e = easeOutCubic(t);
    const rotate = path.enterFrom * (1 - e);
    const x = -14 * (1 - e);
    const scale = 1.06 - 0.06 * e;
    return `translateX(${x}px) rotate(${rotate}deg) scale(${scale})`;
  });

  return (
    <motion.path
      d={path.d}
      fill="var(--color-brand)"
      style={{
        transformBox: "view-box",
        transformOrigin: "248px 247.5px",
        opacity,
        transform,
        willChange: "transform, opacity",
      }}
    />
  );
}

export default function SplashScreen() {
  const { splashEnabled, beginHomePeek, beginHandoff, finishIntro, getAnchorRect } =
    useIntro();

  const [dismissed, setDismissed] = useState(false);
  const [plan, setPlan] = useState<MotionPlan | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const markBoxRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<MotionPlan | null>(null);
  const progress = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const pointerRafRef = useRef<number | null>(null);
  const pendingPointerRef = useRef({ x: 0, y: 0 });
  const flagsRef = useRef({
    wordMeasure: false,
    peek: false,
    measure: false,
    handoff: false,
    finish: false,
    unlock: false,
    dismiss: false,
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const parallaxStrength = useTransform(
    progress,
    [0, 0.35, 0.55, 0.78, 1],
    [0, 0, 1, 0.15, 0],
  );
  const bgReveal = useTransform(progress, [0, P.composeEnd, P.cameraStart, P.homePeek], [0.28, 0.48, 0.72, 1]);
  const markParallaxX = useTransform(
    [pointerX, parallaxStrength],
    ([x, s]) => (x as number) * DEPTH_MARK * (s as number),
  );
  const markParallaxY = useTransform(
    [pointerY, parallaxStrength],
    ([y, s]) => (y as number) * DEPTH_MARK * (s as number),
  );
  const bgParallaxX = useTransform(
    [pointerX, parallaxStrength],
    ([x, s]) => (x as number) * 3 * (s as number),
  );
  const bgParallaxY = useTransform(
    [pointerY, parallaxStrength],
    ([y, s]) => (y as number) * 2 * (s as number),
  );

  const cameraScale = useTransform(
    progress,
    [0, P.composeEnd, P.cameraStart, P.cameraEnd, 1],
    [1.14, 1.08, 1.04, 1, 1],
  );
  const overlayOpacity = useTransform(progress, [P.overlayFade, 1], [1, 0]);
  const openingDarkness = useTransform(
    progress,
    [0, P.composeEnd, P.cameraStart, P.overlayFade, 1],
    [0.92, 0.78, 0.42, 0.06, 0],
  );
  const wireframeOpacity = useTransform(progress, [0, P.composeStart, P.composeEnd], [0.42, 0.28, 0]);
  const kickerOpacity = useTransform(progress, [P.pauseEnd, P.wordmarkEnd, P.overlayFade, 1], [0, 0.7, 0.35, 0]);

  const markMotion = useTransform(progress, (p) => mixMarkMotion(p, planRef.current));
  const markXBase = useTransform(markMotion, (m) => m.x);
  const markYBase = useTransform(markMotion, (m) => m.y);
  const markScale = useTransform(markMotion, (m) => m.scale);
  const markOpacity = useTransform(markMotion, (m) => m.opacity);

  const wordMotion = useTransform(progress, (p) => mixWordMotion(p, planRef.current));
  const wordOpacity = useTransform(wordMotion, (w) => w.opacity);
  const wordX = useTransform(wordMotion, (w) => w.x);
  const wordY = useTransform(wordMotion, (w) => w.y);
  const wordScale = useTransform(wordMotion, (w) => w.scale);
  const wordRevealY = useTransform(wordMotion, (w) => `${(1 - w.reveal) * 112}%`);

  const markX = useTransform(
    [markXBase, markParallaxX],
    ([x, px]: number[]) => x + px,
  );
  const markY = useTransform(
    [markYBase, markParallaxY],
    ([y, py]: number[]) => y + py,
  );

  const buildPlan = (includeMark: boolean) => {
    const wordAnchor = getAnchorRect("wordmark");
    if (!wordAnchor || wordAnchor.width === 0) return;

    const wordStartY = window.innerHeight * 0.76;
    const wordStartScale = Math.min(0.16, 180 / Math.max(wordAnchor.width, 1));
    const wordStartX = window.innerWidth / 2 - (wordAnchor.left + wordAnchor.width / 2);
    const wordStartYOffset = wordStartY - (wordAnchor.top + wordAnchor.height / 2);

    const base: MotionPlan = {
      markCameraX: 0,
      markCameraY: 0,
      markCameraScale: 1,
      markCorrX: 0,
      markCorrY: 0,
      markCorrScale: 0,
      wordStartX,
      wordStartY: wordStartYOffset,
      wordStartScale,
      wordBox: wordAnchor,
    };

    if (includeMark) {
      const markAnchor = getAnchorRect("brand-mark");
      const markBox = markBoxRef.current?.getBoundingClientRect();
      if (!markAnchor || !markBox || markAnchor.width === 0) {
        planRef.current = base;
        setPlan(base);
        return;
      }

      const markFullX = markAnchor.left + markAnchor.width / 2 - (markBox.left + markBox.width / 2);
      const markFullY = markAnchor.top + markAnchor.height / 2 - (markBox.top + markBox.height / 2);
      const markFullScale = markAnchor.width / markBox.width;
      const cameraShare = 0.88;

      base.markCameraX = markFullX * cameraShare;
      base.markCameraY = markFullY * cameraShare;
      base.markCameraScale = 1 + (markFullScale - 1) * cameraShare;
      base.markCorrX = markFullX * (1 - cameraShare);
      base.markCorrY = markFullY * (1 - cameraShare);
      base.markCorrScale = (markFullScale - 1) * (1 - cameraShare);
    }

    planRef.current = base;
    setPlan(base);
  };

  const runTimeline = () => {
    controlsRef.current?.stop();
    controlsRef.current = animate(
      progress,
      [0, 0.31, 0.36, 0.52, 0.9, 1],
      {
        duration: TOTAL_S,
        times: [0, 0.22, 0.26, 0.4, 0.86, 1],
        ease: ["easeOut", "linear", "easeIn", "easeInOut", "easeOut", "easeOut"],
      },
    );
  };

  const skip = () => {
    if (progress.get() >= 0.995) return;
    controlsRef.current?.stop();

    const f = flagsRef.current;
    if (!f.wordMeasure) buildPlan(false);
    if (!f.measure) buildPlan(true);
    if (!f.unlock) {
      f.unlock = true;
      unlockScroll();
    }
    if (!f.peek) {
      f.peek = true;
      beginHomePeek();
    }
    if (!f.handoff) {
      f.handoff = true;
      beginHandoff();
    }

    overlayRef.current?.style.setProperty("pointer-events", "none");
    overlayRef.current?.style.setProperty("cursor", "default");
    controlsRef.current = animate(progress, 1, {
      duration: SKIP_S,
      ease: [0.65, 0.05, 0, 1],
      onComplete: () => {
        if (!f.finish) {
          f.finish = true;
          finishIntro();
        }
        if (!f.dismiss) {
          f.dismiss = true;
          setDismissed(true);
        }
      },
    });
  };

  useMotionValueEvent(progress, "change", (v) => {
    const f = flagsRef.current;

    if (v >= P.cameraStart && !f.unlock) {
      f.unlock = true;
      unlockScroll();
    }
    if (v >= P.pauseEnd && !f.wordMeasure) {
      f.wordMeasure = true;
      buildPlan(false);
    }
    if (v >= P.homePeek && !f.peek) {
      f.peek = true;
      beginHomePeek();
    }
    if (v >= P.measure && !f.measure) {
      f.measure = true;
      buildPlan(true);
    }
    if (v >= P.handoff && !f.handoff) {
      f.handoff = true;
      beginHandoff();
    }
    if (v >= P.finish && !f.finish) {
      f.finish = true;
      finishIntro();
    }
    if (v >= P.correctionStart && overlayRef.current) {
      overlayRef.current.style.pointerEvents = "none";
      overlayRef.current.style.cursor = "default";
    }
    if (v >= 0.995 && !f.dismiss) {
      f.dismiss = true;
      setDismissed(true);
    }
  });

  useEffect(() => {
    if (!splashEnabled) return;

    lockScroll();
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = "auto";
      overlayRef.current.style.cursor = "pointer";
    }
    flagsRef.current = {
      wordMeasure: false,
      peek: false,
      measure: false,
      handoff: false,
      finish: false,
      unlock: false,
      dismiss: false,
    };
    progress.set(0);
    planRef.current = null;
    setPlan(null);

    runTimeline();

    const onPointerMove = (event: PointerEvent) => {
      pendingPointerRef.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      };
      if (pointerRafRef.current != null) return;
      pointerRafRef.current = requestAnimationFrame(() => {
        pointerRafRef.current = null;
        const { x, y } = pendingPointerRef.current;
        pointerX.set(x);
        pointerY.set(y);
      });
    };

    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    let pointerBound = false;
    const bindPointer = () => {
      if (pointerBound) return;
      pointerBound = true;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    };
    const unbindPointer = () => {
      if (!pointerBound) return;
      pointerBound = false;
      window.removeEventListener("pointermove", onPointerMove);
      if (pointerRafRef.current != null) {
        cancelAnimationFrame(pointerRafRef.current);
        pointerRafRef.current = null;
      }
    };

    const onProgress = (v: number) => {
      if (v >= P.composeEnd) bindPointer();
      else unbindPointer();
    };
    onProgress(progress.get());
    const unsubProgress = progress.on("change", onProgress);

    return () => {
      unsubProgress();
      unbindPointer();
      controlsRef.current?.stop();
      if (pointerRafRef.current != null) {
        cancelAnimationFrame(pointerRafRef.current);
        pointerRafRef.current = null;
      }
      unlockScroll();
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splashEnabled]);

  if (!splashEnabled || dismissed || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        key="splash"
        aria-hidden="true"
        onClick={skip}
        className="fixed inset-0 z-[200] isolate overflow-hidden [contain:strict]"
        style={{
          pointerEvents: "auto",
          cursor: "pointer",
          backgroundColor: "var(--color-void)",
          opacity: overlayOpacity,
          willChange: "opacity",
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            scale: cameraScale,
            transformOrigin: "50% 46%",
            willChange: "transform",
          }}
        >
          {/* Same field as the Hero — the splash is that scene, shot close. */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: bgReveal, x: bgParallaxX, y: bgParallaxY }}
          >
            <HeroBackground ready minimal />
          </motion.div>

          {/* Underexposed close-up; lifts as the camera recedes into the hero. */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: openingDarkness,
              background: `radial-gradient(
                ellipse 90% 80% at 50% 44%,
                color-mix(in srgb, var(--color-depth) 92%, transparent) 0%,
                color-mix(in srgb, var(--color-void) 55%, transparent) 52%,
                transparent 100%
              )`,
            }}
          />

          <motion.svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute h-[38vmin] w-[38vmin] max-h-[340px] max-w-[340px] text-faint"
            style={{ opacity: wireframeOpacity }}
            aria-hidden="true"
          >
            <line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" strokeWidth="0.35" opacity="0.55" />
            <line x1="8" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="0.35" opacity="0.55" />
            <circle cx="50" cy="50" r="1" fill="currentColor" opacity="0.7" />
          </motion.svg>

          <div
            ref={markBoxRef}
            className="splash-mark-wrap pointer-events-none absolute left-1/2 top-[46%] h-[32vmin] w-[32vmin] max-h-[280px] max-w-[280px] -translate-x-1/2 -translate-y-1/2"
          >
            <motion.svg
              viewBox="0 0 496 495"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              style={{
                x: markX,
                y: markY,
                scale: markScale,
                opacity: markOpacity,
                willChange: "transform, opacity",
              }}
            >
              {PATHS.map((path, i) => (
                <MarkPath key={i} path={path} progress={progress} />
              ))}
            </motion.svg>
          </div>

          {plan && (
            <motion.div
              className="pointer-events-none fixed"
              style={{
                left: plan.wordBox.left,
                top: plan.wordBox.top,
                width: plan.wordBox.width,
                height: plan.wordBox.height,
                opacity: wordOpacity,
              }}
            >
              <motion.div
                className="h-full w-full origin-center"
                style={{ x: wordX, y: wordY, scale: wordScale }}
              >
                <div className="h-full w-full overflow-hidden">
                  <motion.span
                    className="block whitespace-nowrap text-center font-display font-black leading-[0.85] text-foreground"
                    style={{
                      fontSize: "clamp(2.75rem, 14.5vw, 13.5rem)",
                      y: wordRevealY,
                    }}
                  >
                    FUMEC CRIATIVA
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          )}

          <motion.p
            className="pointer-events-none absolute bottom-[13%] text-center text-[10px] font-medium uppercase tracking-[0.3em] text-muted sm:text-xs"
            style={{ opacity: kickerOpacity }}
          >
            Computação Gráfica · Design de Games
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
