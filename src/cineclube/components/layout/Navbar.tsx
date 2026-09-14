"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

/** Âncoras das seções da página única. */
const links: { href: string; label: string }[] = [
  { href: "#sobre", label: "Sobre" },
  { href: "#equipe", label: "Quem somos" },
  { href: "#onde", label: "Onde" },
  { href: "#lojinha", label: "Lojinha" },
  { href: "#faq", label: "FAQ" },
  { href: "#contato", label: "Contato" },
];

/**
 * Navegação fixa: uma "etiqueta" pendurada no topo com a lua mascote.
 * No mobile abre um menu de tela cheia com os links em tipografia de cartaz.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Lua âncora para o topo */}
        <a
          href="#topo"
          className="group inline-flex h-10 w-10 shrink-0 items-center justify-center gap-0 overflow-y-visible rounded-full bg-melies-ink/70 backdrop-blur-md transition-[width,padding,gap,transform] duration-300 ease-out hover:w-fit hover:justify-start hover:gap-1.5 hover:pl-1.5 hover:pr-2 hover:-rotate-3 focus-visible:w-fit focus-visible:justify-start focus-visible:gap-1.5 focus-visible:pl-1.5 focus-visible:pr-2 focus-visible:-rotate-3"
          aria-label="Voltar ao topo"
        >
          <Image
            src="/cineclube/brand/mascot.png"
            alt=""
            width={34}
            height={37}
            className="relative z-10 h-[34px] w-[34px] shrink-0 transition-transform duration-500 group-hover:rotate-[360deg] group-focus-visible:rotate-[360deg]"
          />
          <span className="flex max-w-0 overflow-x-hidden overflow-y-visible opacity-0 transition-[max-width,opacity] duration-300 ease-out group-hover:max-w-[5.5rem] group-hover:opacity-100 group-focus-visible:max-w-[5.5rem] group-focus-visible:opacity-100 md:group-hover:max-w-[6.5rem] md:group-focus-visible:max-w-[6.5rem]">
            <Image
              src="/cineclube/brand/logo-branca.png"
              alt=""
              width={200}
              height={90}
              aria-hidden
              className="h-16 w-auto shrink-0 object-contain md:h-20"
            />
          </span>
        </a>

        {/* Links desktop — ocultos enquanto não houver âncoras ativas */}
        {links.length > 0 && (
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-1 rounded-full bg-melies-ink/70 px-3 py-2 backdrop-blur-md lg:flex"
          >
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1 font-melies-typewriter text-xs uppercase tracking-wider text-melies-cream/80 transition-all hover:-rotate-2 hover:bg-melies-purple hover:text-melies-cream"
                style={{ rotate: `${(i % 3) - 1}deg` }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#membro"
              className="ml-1 rounded-full bg-melies-peach px-4 py-1.5 font-melies-typewriter text-xs uppercase tracking-wider text-melies-ink transition-transform hover:rotate-2 hover:scale-105"
            >
              Seja membro ✦
            </a>
          </nav>
        )}

        {/* Botão hambúrguer (mobile) */}
        {links.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="rounded-full bg-melies-peach px-4 py-2 font-melies-typewriter text-xs uppercase tracking-widest text-melies-ink lg:hidden"
          >
            {open ? "Fechar ✕" : "Menu ✦"}
          </button>
        )}
      </div>

      {/* Menu mobile em tela cheia, com links tortos como cartaz */}
      <AnimatePresence>
        {open && links.length > 0 && (
          <motion.nav
            aria-label="Navegação móvel"
            initial={{ clipPath: "circle(0% at 92% 5%)" }}
            animate={{ clipPath: "circle(140% at 92% 5%)" }}
            exit={{ clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="texture-paper fixed inset-0 -z-10 flex flex-col items-center justify-center gap-1 bg-melies-purple"
          >
            {[...links, { href: "#membro", label: "Seja membro ✦" }].map(
              (link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: (i % 3) - 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="font-melies-display text-3xl uppercase text-melies-cream transition-colors hover:text-melies-peach"
                >
                  {link.label}
                </motion.a>
              )
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
