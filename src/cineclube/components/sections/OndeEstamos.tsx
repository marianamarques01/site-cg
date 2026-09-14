"use client";

import { motion } from "framer-motion";
import { site, mapsEmbedUrl, mapsDirectionsUrl } from "@/cineclube/data/site";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";

/**
 * ONDE ESTAMOS — o mapa como um recorte colado no zine:
 * moldura de papel, fita adesiva, filtro duotone sobre o embed do Google Maps
 * (o filtro sai no hover para leitura), e um cartão-postal com o endereço.
 */
export function OndeEstamos() {
  return (
    <section id="onde" className="relative overflow-hidden bg-melies-grape py-24 md:py-32">
      <div className="texture-paper absolute inset-0 opacity-25 mix-blend-multiply" aria-hidden />

      {/* selo giratório decorativo */}
      <div aria-hidden className="absolute right-8 top-10 hidden animate-spin-slow md:block">
        <svg viewBox="0 0 120 120" className="h-28 w-28 text-melies-peach/60">
          <defs>
            <path id="circ" d="M60 12 a48 48 0 1 1 -0.01 0" fill="none" />
          </defs>
          <text fontSize="12.5" fill="currentColor" fontFamily="var(--font-melies-typewriter), monospace" letterSpacing="2">
            <textPath href="#circ">✦ universidade fumec ✦ bh ✦ mg ✦</textPath>
          </text>
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <SectionTitle kicker="ato dois" title="Onde estamos" tilt={-2} />

          {/* cartão-postal com o endereço */}
          <motion.address
            initial={{ opacity: 0, y: 40, rotate: 4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="relative mt-10 block max-w-sm bg-melies-cream p-6 not-italic text-melies-ink shadow-poster"
          >
            <span className="tape -top-3 right-8 rotate-12" aria-hidden />
            <p className="font-melies-typewriter text-[10px] uppercase tracking-[0.3em] text-melies-purple">
              remetente: a lua ✦
            </p>
            <p className="mt-3 font-melies-display text-2xl uppercase leading-tight">{site.university}</p>
            <p className="mt-2 leading-relaxed">
              {site.building}
              <br />
              {site.address}
            </p>
            <p className="mt-4 border-t border-dashed border-melies-ink/30 pt-3 font-melies-typewriter text-xs text-melies-ink/60">
              As sessões acontecem na Sala Google, no prédio da FACE. Chegue 15
              minutos antes: os melhores lugares (e a pipoca) acabam rápido.
            </p>
          </motion.address>

          <motion.a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ rotate: -2, scale: 1.05 }}
            className="mt-8 inline-flex rotate-1 items-center gap-3 bg-melies-peach px-7 py-4 font-melies-typewriter text-sm font-bold uppercase tracking-widest text-melies-ink shadow-poster"
          >
            → como chegar
          </motion.a>
        </div>

        {/* mapa emoldurado */}
        <motion.div
          initial={{ opacity: 0, x: 80, rotate: 4 }}
          whileInView={{ opacity: 1, x: 0, rotate: 1.5 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          className="group relative bg-melies-cream p-3 pb-12 shadow-poster"
        >
          <span className="tape -left-6 top-10 rotate-[80deg]" aria-hidden />
          <span className="tape -right-6 bottom-24 rotate-[95deg]" aria-hidden />

          <div className="relative aspect-[4/3] overflow-hidden">
            <iframe
              src={mapsEmbedUrl}
              title={`Mapa: ${site.university}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.7] sepia-[0.35] transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0"
            />
            {/* vinheta por cima do mapa (não bloqueia interação) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-multiply"
              style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(97,69,130,0.5))" }}
            />
          </div>
          <p className="absolute bottom-4 left-0 w-full text-center font-melies-typewriter text-xs text-melies-ink/70">
            x marca o tesouro — passe o mouse para clarear ✦
          </p>
        </motion.div>
      </div>
    </section>
  );
}
