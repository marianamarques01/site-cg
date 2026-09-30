import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import PageTransition from "@/components/ui/PageTransition";
import CineclubeSection from "@/components/home/CineclubeSection";
import JogaJuntoSection from "@/components/extensao/JogaJuntoSection";

export const metadata: Metadata = {
  title: "Projetos de extensão",
  description: "Cineclube Méliès, Joga Junto e outras iniciativas de extensão dos cursos da FUMEC.",
};

export default function ExtensaoPage() {
  return (
    <PageTransition>
      <PageIntro
        kicker="Extensão"
        titleLines={["Projetos de", "extensão"]}
        description="Iniciativas que levam os cursos de Computação Gráfica e Design de Games para além da sala de aula."
      />
      <CineclubeSection />
      <JogaJuntoSection />
    </PageTransition>
  );
}
