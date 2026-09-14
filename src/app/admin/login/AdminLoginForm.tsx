"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    const next = searchParams.get("next");
    router.push(next?.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md border border-border p-8 sm:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">Admin</p>
        <h1 className="mt-3 font-display text-4xl text-foreground">Entrar</h1>
        <p className="mt-2 text-sm text-muted">Painel de edição do site FUMEC Criativa.</p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-brand"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">Senha</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-brand"
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <PrimaryButton type="submit" disabled={loading} className="mt-2">
            {loading ? "Entrando…" : "Entrar"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
