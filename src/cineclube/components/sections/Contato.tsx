"use client";

import { motion } from "framer-motion";
import { site, mapsDirectionsUrl } from "@/cineclube/data/site";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";

/** Canais de contato, renderizados como cartazes lambe-lambe colados. */
const channels = [
  {
    label: "instagram",
    value: site.instagram,
    href: site.instagramUrl,
    note: "bastidores, enquetes e os cartazes das sessões",
    bg: "bg-melies-peach text-melies-ink",
    rotate: -2,
  },
  {
    label: "email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "parcerias, dúvidas e sugestões de filme",
    bg: "bg-melies-cream text-melies-ink",
    rotate: 1.5,
  },
  {
    label: "whatsapp",
    value: site.whatsapp,
    href: site.whatsappUrl,
    note: "grupo dos membros — avisos de última hora",
    bg: "bg-melies-teal text-melies-cream",
    rotate: -1,
  },
  {
    label: "endereço",
    value: "Sala Google — FACE, FUMEC",
    href: mapsDirectionsUrl,
    note: site.address,
    bg: "bg-melies-navy text-melies-cream",
    rotate: 2,
  },
];

/**
 * CONTATO — um muro de lambe-lambe: cada canal é um cartaz colado torto,
 * que "descola" da parede no hover.
 */
export function Contato() {
  return (
    <section id="contato" className="relative overflow-hidden bg-melies-ink py-24 md:py-32">
      {/* muro: tijolos sugeridos com linhas sutis */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 38px, #FBF4E8 38px, #FBF4E8 40px), repeating-linear-gradient(90deg, transparent, transparent 78px, #FBF4E8 78px, #FBF4E8 80px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionTitle kicker="cola comigo" title="Contato" tilt={-1.5} />
        <p className="mt-4 font-melies-typewriter text-sm uppercase tracking-wider text-melies-cream/60">
          quatro jeitos de puxar assunto — escolha seu cartaz
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, i) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: channel.rotate }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 140, damping: 15 }}
              whileHover={{ rotate: 0, y: -10, scale: 1.04 }}
              className={`torn-edge group relative flex min-h-[220px] flex-col justify-between p-6 shadow-poster ${channel.bg}`}
            >
              <span className="stamp w-fit text-[10px] opacity-70">{channel.label}</span>
              <div>
                <p className="break-words font-melies-display text-xl uppercase leading-tight md:text-2xl">
                  {channel.value}
                </p>
                <p className="mt-2 font-melies-typewriter text-[11px] leading-snug opacity-70">
                  {channel.note}
                </p>
              </div>
              <span className="mt-3 inline-block font-melies-display text-lg transition-transform group-hover:translate-x-2" aria-hidden>
                →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
