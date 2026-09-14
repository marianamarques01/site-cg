"use client";

import { motion } from "framer-motion";
import { products } from "@/cineclube/data/products";
import type { Product } from "@/cineclube/types";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";
import { formatPrice } from "@/cineclube/lib/utils";

/**
 * Ilustração do produto em SVG flat, na cor definida em /data/products.ts.
 * Troque por fotos reais mantendo a moldura de "embalagem".
 */
function ProductArt({ product }: { product: Product }) {
  const c = product.color;
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
      <rect width="200" height="160" fill="#FBF4E8" />
      {product.kind === "camiseta" && (
        <path d="M60 30 L85 20 Q100 32 115 20 L140 30 L155 60 L132 70 L132 140 L68 140 L68 70 L45 60 Z" fill={c} />
      )}
      {product.kind === "ecobag" && (
        <g>
          <path d="M75 45 Q75 22 100 22 Q125 22 125 45" stroke={c} strokeWidth="7" fill="none" />
          <rect x="55" y="45" width="90" height="90" rx="6" fill={c} />
          <circle cx="100" cy="88" r="24" fill="#FBF4E8" opacity="0.85" />
        </g>
      )}
      {product.kind === "adesivo" && (
        <g>
          <circle cx="78" cy="70" r="34" fill={c} />
          <rect x="104" y="52" width="58" height="58" rx="10" fill={c} opacity="0.65" transform="rotate(12 133 81)" />
          <path d="M70 118 l10 22 22 -6 -14 20 16 18 -26 -4 -10 24 -6 -26 -26 -2 22 -14 z" fill={c} opacity="0.4" transform="scale(0.55) translate(120 40)" />
        </g>
      )}
      {product.kind === "poster" && (
        <g>
          <rect x="55" y="18" width="90" height="124" fill={c} />
          <circle cx="100" cy="60" r="26" fill="#FBF4E8" />
          <rect x="68" y="100" width="64" height="8" fill="#FBF4E8" />
          <rect x="76" y="114" width="48" height="5" fill="#FBF4E8" opacity="0.7" />
        </g>
      )}
      {product.kind === "caneca" && (
        <g>
          <rect x="60" y="45" width="70" height="80" rx="8" fill={c} />
          <path d="M130 60 Q160 62 158 85 Q156 108 128 105" stroke={c} strokeWidth="9" fill="none" />
          <ellipse cx="95" cy="45" rx="35" ry="8" fill="#FBF4E8" opacity="0.5" />
          <circle cx="95" cy="85" r="16" fill="#FBF4E8" opacity="0.85" />
        </g>
      )}
    </svg>
  );
}

/**
 * LOJINHA — banquinha de feira gráfica: produtos como itens colados
 * num mural, preços em etiquetas de papelaria e aviso de "sem pagamento
 * online ainda" — retire na sessão.
 */
export function Lojinha() {
  return (
    <section id="lojinha" className="relative overflow-hidden bg-melies-peach py-24 text-melies-ink md:py-32">
      <div className="texture-paper absolute inset-0 opacity-40 mix-blend-multiply" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle kicker="banquinha oficial" title="Lojinha" tone="ink" tilt={-2} />
          <p className="max-w-[240px] rotate-2 border-2 border-dashed border-melies-ink/50 p-3 font-melies-typewriter text-xs uppercase leading-relaxed tracking-wider">
            catálogo — pagamento e retirada na próxima sessão ✦
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: ((i % 3) - 1) * 1.5 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.1, type: "spring", stiffness: 140, damping: 15 }}
              whileHover={{ rotate: 0, y: -8 }}
              className="group relative flex flex-col bg-melies-cream shadow-poster"
            >
              {/* etiqueta de preço pendurada */}
              <span className="absolute -right-3 -top-3 z-10 rotate-12 bg-melies-ink px-3 py-2 font-melies-display text-lg text-melies-peach shadow-sticker transition-transform group-hover:rotate-3 group-hover:scale-110">
                {formatPrice(product.price)}
              </span>

              <div className="aspect-[5/4] overflow-hidden border-b-2 border-dashed border-melies-ink/20">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2">
                  <ProductArt product={product} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="font-melies-typewriter text-[10px] uppercase tracking-[0.25em] text-melies-purple">
                  {product.kind}
                </span>
                <h3 className="mt-1 font-melies-display text-2xl uppercase leading-tight">
                  {product.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-melies-ink/70">
                  {product.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
