import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { enableDemoMode } from "@/lib/leafstep-storage";
import { toast } from "sonner";
import { Leaf, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

type AuthSearch = { mode?: "signup"; demo?: boolean };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    mode: search.mode === "signup" ? "signup" : undefined,
    demo: search.demo === true || search.demo === "true" ? true : undefined,
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (search.demo && !loading && !user) {
      startDemo();
    }
  }, [search.demo, loading, user]);

  function startDemo() {
    enableDemoMode();
    toast.success("Welcome to the Leafstep demo! 🌱");
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created! You're all set. 🌱");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy text-navy-foreground">
      {/* ── Animated background ───────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient orbs */}
        <div
          className="absolute -top-32 -left-32 h-80 w-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #1d9e75, transparent 70%)",
            animation: "float-cloud 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 -right-40 h-96 w-96 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #38bdf8, transparent 70%)",
            animation: "float-cloud 11s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #a855f7, transparent 70%)",
            animation: "float-cloud 9s ease-in-out infinite 2s",
          }}
        />

        {/* Floating leaf icons */}
        {mounted && (
          <>
            {[
              { top: "12%", left: "8%",  delay: "0s",    size: 18, opacity: 0.12 },
              { top: "25%", left: "88%", delay: "1.5s",  size: 14, opacity: 0.10 },
              { top: "55%", left: "5%",  delay: "3s",    size: 22, opacity: 0.08 },
              { top: "70%", left: "92%", delay: "2s",    size: 16, opacity: 0.12 },
              { top: "85%", left: "20%", delay: "0.8s",  size: 12, opacity: 0.10 },
              { top: "40%", left: "78%", delay: "2.5s",  size: 20, opacity: 0.09 },
            ].map((leaf, i) => (
              <div
                key={i}
                className="absolute text-primary"
                style={{
                  top: leaf.top,
                  left: leaf.left,
                  opacity: leaf.opacity,
                  fontSize: leaf.size,
                  animation: `float-cloud ${6 + i}s ease-in-out infinite ${leaf.delay}`,
                }}
              >
                🍃
              </div>
            ))}
          </>
        )}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Card ──────────────────────────────────── */}
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl animate-scale-in"
        >
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground ls-glow animate-leaf-spin">
              <Leaf className="h-6 w-6" />
            </span>
            <div>
              <span className="block text-2xl font-extrabold tracking-tight">Leafstep</span>
              <span className="text-xs text-navy-foreground/50">Carbon Footprint Tracker</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold leading-tight">
            {mode === "signin" ? "Welcome back 👋" : "Start your climate journey 🌱"}
          </h1>
          <p className="mt-2 text-sm text-navy-foreground/60">
            Track, reduce, and offset your carbon footprint — one step at a time.
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={busy}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/25 hover:scale-[1.01] disabled:opacity-50 disabled:scale-100"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          {/* Demo button */}
          <button
            type="button"
            onClick={startDemo}
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/20 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Try demo — no account needed
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4 text-xs text-navy-foreground/40">
            <div className="h-px flex-1 bg-white/10" />
            or with email
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmail} className="flex flex-col gap-3">
            {mode === "signup" && (
              <div className="relative animate-slide-down">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Display name"
                  className="input-glow w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder:text-navy-foreground/40 transition-all"
                />
              </div>
            )}

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-glow w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder:text-navy-foreground/40 transition-all"
            />

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="input-glow w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-11 text-sm placeholder:text-navy-foreground/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-foreground/40 hover:text-navy-foreground/70 transition-colors"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-glow mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "signin" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                mode === "signin" ? "Sign in" : "Create account"
              )}
            </button>
          </form>

          {/* Mode toggle */}
          <p className="mt-6 text-center text-sm text-navy-foreground/60">
            {mode === "signin" ? "New to Leafstep?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setEmail("");
                setPassword("");
                setName("");
              }}
              className="font-semibold text-primary hover:underline transition-colors"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>

          {/* Features list */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-navy-foreground/40">
            {["🌿 Carbon tracking", "📊 Insights", "🏆 Challenges", "💚 Free forever"].map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
