"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

/**
 * Holds the opening sequence so the splash and the Home stop talking past each
 * other.
 *
 *   splash   the splash owns the screen; the Home holds still
 *   peek     the camera is receding; peripheral Home elements enter the frame
 *   handoff  the composition is landing; the Home assembles in full
 *   home     the real header logo / hero headline take over; splash is gone
 */
export type IntroStage = "splash" | "peek" | "handoff" | "home";

const SPLASH_KEY = "fumec-splash-seen";

/** Nothing should be able to strand the page mid-intro. */
const FAILSAFE_MS = 5500;

type IntroState = {
  stage: IntroStage;
  splashEnabled: boolean;
  /** False on "/" until sessionStorage + reduced-motion are checked client-side. */
  resolved: boolean;
};

type IntroValue = {
  stage: IntroStage;
  /** Client hasn't decided splash yet — hold a void gate so Home never flashes. */
  introPending: boolean;
  /** Peripheral Hero elements may enter the frame (camera receding). */
  homePeek: boolean;
  /** The Home may start its own entrance (tiles, robot, copy). */
  homeReady: boolean;
  /** The real header logo / hero headline may become visible. */
  handoffDone: boolean;
  /** Whether the splash should mount at all — resolved client-side. */
  splashEnabled: boolean;
  beginHomePeek: () => void;
  beginHandoff: () => void;
  finishIntro: () => void;
  registerAnchor: (name: AnchorName, el: Element | null) => void;
  getAnchorRect: (name: AnchorName) => DOMRect | null;
};

export type AnchorName = "brand-mark" | "wordmark" | "eyebrow";

const IntroContext = createContext<IntroValue>({
  stage: "home",
  introPending: false,
  homePeek: true,
  homeReady: true,
  handoffDone: true,
  splashEnabled: false,
  beginHomePeek: () => {},
  beginHandoff: () => {},
  finishIntro: () => {},
  registerAnchor: () => {},
  getAnchorRect: () => null,
});

export function useIntro() {
  return useContext(IntroContext);
}

/**
 * Registers an element as a landing target for the splash morph. The splash
 * measures these rather than relying on shared-layout inference, so the
 * hand-off lands on the real pixel position or not at all.
 */
export function useIntroAnchor(name: AnchorName) {
  const { registerAnchor } = useIntro();
  return useCallback(
    (el: Element | null) => registerAnchor(name, el),
    [registerAnchor, name],
  );
}

export default function IntroProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [intro, setIntro] = useState<IntroState>(() => ({
    stage: isHome ? "splash" : "home",
    splashEnabled: false,
    resolved: !isHome,
  }));
  const { stage, splashEnabled, resolved } = intro;
  const introPending = isHome && !resolved;

  const setStage = useCallback(
    (next: IntroStage | ((current: IntroStage) => IntroStage)) =>
      setIntro((prev) => ({
        ...prev,
        stage: typeof next === "function" ? next(prev.stage) : next,
      })),
    [],
  );
  const anchors = useRef(new Map<AnchorName, Element>());
  const decided = useRef(false);

  useEffect(() => {
    if (decided.current) return;
    decided.current = true;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SPLASH_KEY) === "1";
    } catch {
      seen = false;
    }

    const shouldPlay = isHome && !seen && !reduceMotion;
    setIntro({
      stage: shouldPlay ? "splash" : "home",
      splashEnabled: shouldPlay,
      resolved: true,
    });
    if (!shouldPlay) return;

    const failsafe = setTimeout(() => setStage("home"), FAILSAFE_MS);
    return () => clearTimeout(failsafe);
  }, [isHome, reduceMotion, setStage]);

  const beginHomePeek = useCallback(
    () => setStage((s) => (s === "splash" ? "peek" : s)),
    [setStage],
  );

  const beginHandoff = useCallback(
    () => setStage((s) => (s === "splash" || s === "peek" ? "handoff" : s)),
    [setStage],
  );

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // storage unavailable — the splash simply replays next load
    }
    setStage("home");
  }, [setStage]);

  const registerAnchor = useCallback((name: AnchorName, el: Element | null) => {
    if (el) anchors.current.set(name, el);
    else anchors.current.delete(name);
  }, []);

  const getAnchorRect = useCallback((name: AnchorName) => {
    const el = anchors.current.get(name);
    return el ? el.getBoundingClientRect() : null;
  }, []);

  const value = useMemo<IntroValue>(
    () => ({
      stage,
      introPending,
      homePeek: stage !== "splash",
      homeReady: stage === "handoff" || stage === "home",
      handoffDone: stage === "home",
      splashEnabled,
      beginHomePeek,
      beginHandoff,
      finishIntro,
      registerAnchor,
      getAnchorRect,
    }),
    [
      stage,
      introPending,
      splashEnabled,
      beginHomePeek,
      beginHandoff,
      finishIntro,
      registerAnchor,
      getAnchorRect,
    ],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
