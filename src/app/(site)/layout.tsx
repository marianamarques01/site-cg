import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import AmbientField from "@/components/ui/AmbientField";
import IntroProvider from "@/components/ui/IntroProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <IntroProvider>
      <AmbientField />
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </IntroProvider>
  );
}
