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
import HeroWordmark from "@/components/home/HeroWordmark";
import { useIntro } from "@/components/ui/IntroProvider";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

/* --------------------------------------------------------------------------
   Compose mark → reveal copy → hold → dissolve. No camera morph to Home.
   -------------------------------------------------------------------------- */

/** Total timeline — hold composition → dissolve → curtain lift (no black beat). */
const TOTAL_S = 4;

const SEC = {
  composeEnd: 0.9,
  pauseEnd: 1.0,
  wordmarkEnd: 1.35,
  /** +1s hold with mark + copy fully visible before dissolve. */
  fadeStart: 2.5,
  contentFadeEnd: 3.3,
  /** Black hold removed (−1s vs prior 0.65s beat). */
  revealStart: 3.3,
} as const;

const P = {
  composeStart: 0,
  composeEnd: SEC.composeEnd / TOTAL_S,
  pauseEnd: SEC.pauseEnd / TOTAL_S,
  wordmarkEnd: SEC.wordmarkEnd / TOTAL_S,
  fadeStart: SEC.fadeStart / TOTAL_S,
  contentFadeEnd: SEC.contentFadeEnd / TOTAL_S,
  blackHoldEnd: SEC.revealStart / TOTAL_S,
  revealStart: SEC.revealStart / TOTAL_S,
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

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function rangeProgress(p: number, start: number, end: number) {
  return clamp01((p - start) / (end - start));
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function MarkPath({
  path,
  progress,
}: {
  path: PathSpec;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) => {
    const t = easeOut(rangeProgress(p, P.composeStart + path.stagger, P.composeEnd));
    return t;
  });
  const transform = useTransform(progress, (p) => {
    const t = easeOut(rangeProgress(p, P.composeStart + path.stagger, P.composeEnd));
    const rotate = path.enterFrom * (1 - t);
    const x = -14 * (1 - t);
    const scale = 1.06 - 0.06 * t;
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
      }}
    />
  );
}

export default function SplashScreen() {
  const { splashEnabled, finishIntro } = useIntro();

  const [dismissed, setDismissed] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const pointerRafRef = useRef<number | null>(null);
  const pendingPointerRef = useRef({ x: 0, y: 0 });
  const flagsRef = useRef({ finish: false, unlock: false, dismiss: false });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const parallaxStrength = useTransform(
    progress,
    [0, P.composeEnd, P.fadeStart, P.contentFadeEnd],
    [0, 0.5, 0.15, 0],
  );
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

  /** Black curtain — stays opaque through hold, lifts only at the end. */
  const curtainOpacity = useTransform(progress, [P.revealStart, 1], [1, 0]);
  const openingDarkness = useTransform(
    progress,
    [0, P.composeEnd, P.wordmarkEnd, P.fadeStart, P.contentFadeEnd],
    [0.06, 0.28, 0.42, 0.42, 0.42],
  );
  const wireframeOpacity = useTransform(progress, [0, P.composeStart, P.composeEnd], [0.38, 0.24, 0]);

  const markCompose = useTransform(progress, (p) =>
    easeOut(rangeProgress(p, P.composeStart, P.composeEnd)),
  );
  const markScale = useTransform(markCompose, (t) => 1.06 - t * 0.06);
  const markOpacity = useTransform(progress, (p) => {
    const compose = easeOut(rangeProgress(p, P.composeStart, P.composeEnd));
    const fadeOut = easeOut(rangeProgress(p, P.fadeStart, P.contentFadeEnd));
    return compose * (1 - fadeOut);
  });

  const copyReveal = useTransform(progress, (p) =>
    easeOut(rangeProgress(p, P.pauseEnd, P.wordmarkEnd)),
  );
  const copyOpacity = useTransform(progress, (p) => {
    const reveal = easeOut(rangeProgress(p, P.pauseEnd, P.wordmarkEnd));
    const fadeOut = easeOut(rangeProgress(p, P.fadeStart, P.contentFadeEnd));
    return reveal * (1 - fadeOut);
  });
  const sceneOpacity = useTransform(progress, (p) => {
    const fadeOut = easeOut(rangeProgress(p, P.fadeStart, P.contentFadeEnd));
    return 1 - fadeOut;
  });
  const wordRevealY = useTransform(copyReveal, (r) => `${(1 - r) * 112}%`);

  const markX = useTransform([markParallaxX], ([px]: number[]) => px);
  const markY = useTransform([markParallaxY], ([py]: number[]) => py);

  const runTimeline = () => {
    controlsRef.current?.stop();
    controlsRef.current = animate(progress, 1, {
      duration: TOTAL_S,
      ease: "linear",
    });
  };

  const finishSplash = () => {
    const f = flagsRef.current;
    if (!f.unlock) {
      f.unlock = true;
      unlockScroll();
    }
    if (!f.finish) {
      f.finish = true;
      finishIntro();
    }
  };

  const skip = () => {
    if (progress.get() >= 0.995) return;
    controlsRef.current?.stop();
    finishSplash();
    overlayRef.current?.style.setProperty("pointer-events", "none");
    overlayRef.current?.style.setProperty("cursor", "default");
    controlsRef.current = animate(progress, 1, {
      duration: 0.45,
      ease: [0.65, 0.05, 0, 1],
      onComplete: () => {
        if (!flagsRef.current.dismiss) {
          flagsRef.current.dismiss = true;
          setDismissed(true);
        }
      },
    });
  };

  useMotionValueEvent(progress, "change", (v) => {
    const f = flagsRef.current;

    if (v >= P.revealStart && !f.finish) {
      finishSplash();
    }
    if (v >= P.fadeStart && overlayRef.current) {
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
    flagsRef.current = { finish: false, unlock: false, dismiss: false };
    progress.set(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(runTimeline);
    });

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
        className="fixed inset-0 z-[200] isolate overflow-hidden"
        style={{
          pointerEvents: "auto",
          cursor: "pointer",
          backgroundColor: "var(--color-void)",
          opacity: curtainOpacity,
        }}
      >
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-[var(--gutter)]"
          style={{ opacity: sceneOpacity }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ x: bgParallaxX, y: bgParallaxY }}
          >
            <HeroBackground ready minimal static />
          </motion.div>

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

          <div className="relative flex w-full max-w-[100vw] flex-col items-center">
            <motion.div
              className="pointer-events-none h-[32vmin] w-[32vmin] max-h-[280px] max-w-[280px] shrink-0"
              style={{
                x: markX,
                y: markY,
                scale: markScale,
                opacity: markOpacity,
              }}
            >
              <motion.svg
                viewBox="0 0 496 495"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                {PATHS.map((path, i) => (
                  <MarkPath key={i} path={path} progress={progress} />
                ))}
              </motion.svg>
            </motion.div>

            <motion.div
              className="mt-[clamp(1.75rem,6vh,3rem)] flex w-full flex-col items-center gap-4 sm:gap-6"
              style={{ opacity: copyOpacity }}
            >
              <motion.p
                className="text-center text-[0.65rem] font-medium uppercase tracking-[0.18em] text-foreground/55 sm:text-sm sm:tracking-[0.2em]"
                style={{ opacity: copyReveal }}
              >
                Computação Gráfica · Design de Games
              </motion.p>

              <div className="hero-wordmark w-full max-w-none overflow-visible">
                <div className="hero-wordmark-reveal">
                  <motion.div style={{ y: wordRevealY }}>
                    <HeroWordmark splashMode className="text-center" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
