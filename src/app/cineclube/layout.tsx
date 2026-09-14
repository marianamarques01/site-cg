import type { Metadata } from "next";
import { SmoothScroll } from "@/cineclube/components/ui/SmoothScroll";
import { GrainOverlay } from "@/cineclube/components/ui/GrainOverlay";
import { CustomCursor } from "@/cineclube/components/ui/CustomCursor";

import "@fontsource/girassol";
import "@fontsource/josefin-sans/400.css";
import "@fontsource/josefin-sans/600.css";
import "@fontsource/special-elite";

export const metadata: Metadata = {
  title: "Cineclube Méliès — cinema de autor, arte & experimentação",
  description:
    "Cineclube da Universidade FUMEC. Sessões gratuitas de cinema de autor, debates, oficinas e uma lua de cartola. Toda semana na Sala Google — FACE, Belo Horizonte.",
  keywords: [
    "cineclube",
    "cinema de autor",
    "FUMEC",
    "Belo Horizonte",
    "Méliès",
    "sessões de cinema",
  ],
  openGraph: {
    title: "Cineclube Méliès",
    description:
      "Sessões gratuitas de cinema de autor na FUMEC. Silêncio, vai começar.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function CineclubeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="cineclube-root antialiased">
      <SmoothScroll>{children}</SmoothScroll>
      <GrainOverlay />
      <CustomCursor />
    </div>
  );
}
