import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — FUMEC Criativa",
    template: "%s — Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-void text-foreground">
      <main>{children}</main>
    </div>
  );
}
