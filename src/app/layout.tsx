import type { Metadata } from "next";
import { Big_Shoulders, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { VisualModeProvider } from "@/components/ui/VisualModeProvider";
import ThemeScript from "@/components/ui/ThemeScript";
import VisualModeScript from "@/components/ui/VisualModeScript";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  // Next.js 16 não tem métricas precalculadas para Big Shoulders;
  // sem isso, o dev server loga o aviso a cada request.
  adjustFontFallback: false,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FUMEC Criativa — Computação Gráfica & Design de Games",
    template: "%s — FUMEC Criativa",
  },
  description:
    "Portfólio dos cursos de Computação Gráfica e Design de Games da FUMEC: modelagem 3D, jogos, concept art, animação e produções dos alunos.",
  icons: {
    icon: withBasePath("/logo-fumec.svg"),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      data-visual="minimal"
      className={`${bigShoulders.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <VisualModeScript />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        {/* Every reveal starts hidden and is opened by JS. With scripting off
            the copy is all still in the HTML but none of it would ever be
            painted, so unhide it wholesale rather than ship a blank page. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;clip-path:none!important;transform:none!important}`}</style>
        </noscript>
        <ThemeProvider>
          <VisualModeProvider>{children}</VisualModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
