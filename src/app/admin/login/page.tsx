import { Suspense } from "react";
import AdminLoginForm from "@/app/admin/login/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted">Carregando…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
