import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/actions";
import AdminDisplayControls from "@/components/admin/AdminDisplayControls";
import AdminNav from "@/components/admin/AdminNav";

type AdminShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AdminShell({ title, description, actions, children }: AdminShellProps) {
  return (
    <div className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-6 border-b border-border pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/admin"
                className="text-xs font-medium uppercase tracking-[0.14em] text-faint transition-colors hover:text-brand"
              >
                ← Painel
              </Link>
              <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">{title}</h1>
              {description ? <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {actions}
              <AdminDisplayControls />
              <form action={signOut}>
                <button
                  type="submit"
                  className="border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-brand hover:text-foreground"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
          <AdminNav />
        </header>
        {children}
      </div>
    </div>
  );
}
