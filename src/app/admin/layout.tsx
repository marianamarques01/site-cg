import type { Metadata } from "next";
import CinemaPageBackground from "@/components/ui/CinemaPageBackground";

export const metadata: Metadata = {
  title: {
    default: "Admin — FUMEC Criativa",
    template: "%s — Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-portal relative min-h-full text-foreground">
      <CinemaPageBackground />
      <div className="relative z-[1]">
        <main>{children}</main>
      </div>
    </div>
  );
}
