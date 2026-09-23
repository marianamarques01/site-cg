"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import clsx from "clsx";
import Logo from "@/components/ui/Logo";
import ExternalLinkIcon from "@/components/ui/ExternalLinkIcon";
import GridIcon from "@/components/ui/GridIcon";
import Container from "@/components/ui/Container";
import { useIntro, useIntroAnchor } from "@/components/ui/IntroProvider";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { DUR, EASE_EDITORIAL, EASE_MECH, HERO_HOME_ENTRANCE_DELAY, STAGGER } from "@/lib/motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/producoes", label: "Projetos" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Sobre" },
];

const BENTO_LINKS = [
  ...NAV_LINKS,
  { href: "/cursos/computacao-grafica", label: "Computação Gráfica" },
  { href: "/cursos/design-de-games", label: "Design de Games" },
];

const FUMEC_SITE_URL = "https://www.fumec.br";

export default function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { homePeek, handoffDone, splashEnabled, introPending } = useIntro();
  const brandAnchor = useIntroAnchor("brand-mark");

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<"mobile" | "bento">("mobile");
  const [lastPathname, setLastPathname] = useState(pathname);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(!menuOpen && y > previous && y > 200);
  });

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll();
    return () => unlockScroll();
  }, [menuOpen]);

  const openMenu = (mode: "mobile" | "bento") => {
    setMenuMode(mode);
    setMenuOpen(true);
  };

  const toggleMenu = (mode: "mobile" | "bento") => {
    if (menuOpen && menuMode === mode) {
      setMenuOpen(false);
    } else {
      openMenu(mode);
    }
  };

  return (
    <motion.header
      style={{ viewTransitionName: "site-header" }}
      animate={{ y: hidden && !reduceMotion ? "-100%" : "0%" }}
      transition={{ duration: DUR.mechSlow, ease: EASE_MECH }}
      className={clsx(
        "site-header fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color] duration-500",
        scrolled
          ? "border-b border-foreground/[0.06] bg-void/75 backdrop-blur-sm"
          : "border-b border-foreground/[0.04] bg-transparent",
      )}
    >
      <Container className="relative flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="group flex shrink-0 items-center text-foreground"
          aria-label="FUMEC Criativa — página inicial"
        >
          <motion.span
            ref={brandAnchor}
            className="block h-8 w-8 shrink-0"
            initial={{ opacity: splashEnabled ? 0 : 1 }}
            animate={{
              opacity: introPending
                ? 0
                : handoffDone
                  ? 1
                  : homePeek
                    ? 0.32
                    : splashEnabled
                      ? 0
                      : 1,
            }}
            transition={{
              duration: splashEnabled && handoffDone ? DUR.editorial : 0.15,
              delay: splashEnabled && handoffDone ? HERO_HOME_ENTRANCE_DELAY : 0,
              ease: splashEnabled && handoffDone ? EASE_EDITORIAL : EASE_MECH,
            }}
          >
            <Logo
              variant="brand"
              className="h-full w-full transition-transform duration-500 group-hover:rotate-[18deg]"
            />
          </motion.span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex lg:gap-9">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                transitionTypes={[link.href === "/" ? "nav-back" : "nav-forward"]}
                className={clsx(
                  "nav-link group relative py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] transition-[color,opacity,transform] duration-300",
                  "hover:-translate-y-px hover:opacity-100 focus-visible:-translate-y-px focus-visible:opacity-100",
                  isActive
                    ? "text-foreground opacity-100"
                    : "text-muted opacity-70 hover:text-foreground",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={clsx(
                    "absolute -bottom-1.5 left-1/2 h-px -translate-x-1/2 bg-magenta transition-all duration-300",
                    isActive ? "w-3 opacity-100" : "w-0 opacity-0 group-hover:w-2.5 group-hover:opacity-70 group-focus-visible:w-2.5 group-focus-visible:opacity-70",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <a
            href={FUMEC_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-foreground/15 px-2 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:border-magenta/50 hover:text-foreground max-[380px]:px-2 sm:px-3"
            aria-label="Visitar site FUMEC.br"
          >
            <span className="max-[380px]:sr-only">FUMEC.br</span>
            <span aria-hidden="true" className="text-magenta max-[380px]:text-sm">
              ↗
            </span>
          </a>

          {/* Desktop bento menu — mockup grid icon */}
          <button
            type="button"
            onClick={() => toggleMenu("bento")}
            className={clsx(
              "relative z-50 hidden h-10 w-10 items-center justify-center text-foreground transition-colors md:flex",
              menuOpen && menuMode === "bento" ? "text-magenta" : "hover:text-magenta",
            )}
            aria-label={menuOpen && menuMode === "bento" ? "Fechar menu" : "Abrir menu rápido"}
            aria-expanded={menuOpen && menuMode === "bento"}
          >
            <GridIcon />
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => toggleMenu("mobile")}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            aria-label={menuOpen && menuMode === "mobile" ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen && menuMode === "mobile"}
          >
            <motion.span
              className="h-px w-6 origin-center bg-foreground"
              animate={
                menuOpen && menuMode === "mobile"
                  ? { rotate: 45, y: 6 }
                  : { rotate: 0, y: 0 }
              }
              transition={{
                duration: DUR.mech,
                delay: menuOpen && menuMode === "mobile" ? 0.08 : 0,
                ease: EASE_MECH,
              }}
            />
            <motion.span
              className="h-px w-6 origin-center bg-foreground"
              animate={
                menuOpen && menuMode === "mobile"
                  ? { scaleX: 0, opacity: 0 }
                  : { scaleX: 1, opacity: 1 }
              }
              transition={{ duration: DUR.mech, ease: EASE_MECH }}
            />
            <motion.span
              className="h-px w-6 origin-center bg-foreground"
              animate={
                menuOpen && menuMode === "mobile"
                  ? { rotate: -45, y: -6 }
                  : { rotate: 0, y: 0 }
              }
              transition={{
                duration: DUR.mech,
                delay: menuOpen && menuMode === "mobile" ? 0.08 : 0,
                ease: EASE_MECH,
              }}
            />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && menuMode === "mobile" && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 3.5rem) 2.75rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3.5rem) 2.75rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3.5rem) 2.75rem)" }}
            transition={{ duration: DUR.mechSlow, ease: EASE_MECH }}
            className="fixed inset-0 z-40 bg-void/98 backdrop-blur-md md:hidden"
          >
            <nav className="flex h-full flex-col justify-center gap-2 px-[var(--gutter)]">
              {NAV_LINKS.map((link, i) => (
                <span key={link.href} className="block overflow-hidden py-1">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{
                      delay: 0.1 + i * STAGGER * 0.85,
                      duration: DUR.editorial,
                      ease: EASE_EDITORIAL,
                    }}
                  >
                    <Link
                      href={link.href}
                      transitionTypes={[link.href === "/" ? "nav-back" : "nav-forward"]}
                      className="block py-2 font-display text-4xl tracking-tight text-foreground"
                    >
                      {link.label}
                    </Link>
                  </motion.span>
                </span>
              ))}
              <span className="block overflow-hidden py-1">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "110%" }}
                  transition={{
                    delay: 0.1 + NAV_LINKS.length * STAGGER * 0.85,
                    duration: DUR.editorial,
                    ease: EASE_EDITORIAL,
                  }}
                >
                  <a
                    href={FUMEC_SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-2 font-display text-4xl tracking-tight text-foreground"
                  >
                    FUMEC.br
                    <ExternalLinkIcon className="text-magenta" />
                  </a>
                </motion.span>
              </span>
            </nav>
          </motion.div>
        )}

        {menuOpen && menuMode === "bento" && (
          <motion.div
            key="bento-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DUR.mechSlow, ease: EASE_MECH }}
            className="fixed inset-x-0 top-[var(--header-offset)] z-40 hidden border-b border-border bg-void/95 px-[var(--gutter)] py-8 backdrop-blur-md md:block"
          >
            <nav
              className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3"
              aria-label="Menu rápido"
            >
              {BENTO_LINKS.map((link, i) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(link.href);
                return (
                  <motion.span
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{
                      delay: i * STAGGER * 0.6,
                      duration: DUR.mech,
                      ease: EASE_MECH,
                    }}
                  >
                    <Link
                      href={link.href}
                      transitionTypes={[link.href === "/" ? "nav-back" : "nav-forward"]}
                      className={clsx(
                        "group flex min-h-[4.5rem] flex-col justify-end border p-4 transition-colors",
                        isActive
                          ? "border-magenta bg-magenta/10 text-foreground"
                          : "border-border text-muted hover:border-magenta/50 hover:text-foreground",
                      )}
                    >
                      <span className="font-display text-lg uppercase leading-tight tracking-tight">
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-2 text-xs text-magenta opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ↗
                      </span>
                    </Link>
                  </motion.span>
                );
              })}
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{
                  delay: BENTO_LINKS.length * STAGGER * 0.6,
                  duration: DUR.mech,
                  ease: EASE_MECH,
                }}
              >
                <a
                  href={FUMEC_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[4.5rem] flex-col justify-end border border-border p-4 text-muted transition-colors hover:border-magenta/50 hover:text-foreground"
                >
                  <span className="font-display text-lg uppercase leading-tight tracking-tight">
                    FUMEC.br
                  </span>
                  <span aria-hidden="true" className="mt-2 text-xs text-magenta">
                    ↗
                  </span>
                </a>
              </motion.span>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for bento menu */}
      <AnimatePresence>
        {menuOpen && menuMode === "bento" && (
          <motion.button
            type="button"
            key="bento-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.mech }}
            className="fixed inset-0 z-30 hidden bg-black/40 md:block"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
