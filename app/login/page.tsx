import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <section className="max-w-sm mx-auto mt-20">
      <h1 className="font-display text-3xl mb-6">Sign in</h1>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
