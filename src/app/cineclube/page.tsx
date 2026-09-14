import { Navbar } from "@/cineclube/components/layout/Navbar";
import { Footer } from "@/cineclube/components/layout/Footer";
import { Hero } from "@/cineclube/components/sections/Hero";
import { Sobre } from "@/cineclube/components/sections/Sobre";
import { QuemSomos } from "@/cineclube/components/sections/QuemSomos";
import { Agenda } from "@/cineclube/components/sections/Agenda";
import { OndeEstamos } from "@/cineclube/components/sections/OndeEstamos";
import { SejaMembro } from "@/cineclube/components/sections/SejaMembro";
import { Lojinha } from "@/cineclube/components/sections/Lojinha";
import { ParceirosFaq } from "@/cineclube/components/sections/ParceirosFaq";
import { Contato } from "@/cineclube/components/sections/Contato";
import { FilmStrip } from "@/cineclube/components/ui/FilmStrip";

export default function CineclubePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Sobre />
      <QuemSomos />
      <FilmStrip />
      <Agenda />
      <OndeEstamos />
      <SejaMembro />
      <Lojinha />
      <FilmStrip />
      <ParceirosFaq />
      <Contato />
      <Footer />
    </main>
  );
}
