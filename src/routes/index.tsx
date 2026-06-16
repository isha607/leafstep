import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isDemoMode } from "@/lib/leafstep-storage";
import {
  Leaf,
  TrendingDown,
  Sparkles,
  Users,
  ArrowRight,
  Calculator,
  CalendarCheck,
  BarChart3,
} from "lucide-react";


export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LandingPage,
});

const FEATURES = [
  {
    icon: Calculator,
    title: "Understand your impact",
    desc: "A guided carbon calculator breaks down transport, diet, energy, and shopping into clear annual totals.",
    color: "#1d9e75",
  },
  {
    icon: Sparkles,
    title: "Simple high-impact actions",
    desc: "Personalized recommendations ranked by CO₂ savings — from meat-free days to renewable energy switches.",
    color: "#38bdf8",
  },
  {
    icon: CalendarCheck,
    title: "Build lasting habits",
    desc: "Track daily eco habits with streaks, weekly progress rings, and visible grams of CO₂ avoided.",
    color: "#f59e0b",
  },
  {
    icon: Users,
    title: "Community challenges",
    desc: "Join group challenges and climb the leaderboard — accountability makes change stick.",
    color: "#a855f7",
  },
];

const STEPS = [
  { n: "1", label: "Calculate", desc: "Estimate your footprint in 4 quick steps" },
  { n: "2", label: "Act", desc: "Pick personalized actions that fit your life" },
  { n: "3", label: "Track", desc: "Log habits and watch your score improve" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">Leafstep</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="btn-glow rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 left-1/4 h-96 w-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #1d9e75, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 -right-32 h-80 w-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-bold text-accent-foreground">
              <TrendingDown className="h-3.5 w-3.5" />
              Understand · Track · Reduce
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
              Shrink your carbon footprint,{" "}
              <span className="text-primary">one step at a time</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Leafstep helps individuals understand, track, and reduce their environmental impact
              through simple actions and personalized insights — no climate science degree required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="btn-glow flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground sm:w-auto"
              >
                Try free demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold transition-colors hover:bg-secondary sm:w-auto"
              >
                Create account
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free forever · No credit card · Works on mobile
            </p>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 animate-slide-up stagger-2">
            {[
              { val: "8.6t", lbl: "Avg. footprint tracked", icon: BarChart3 },
              { val: "6", lbl: "High-impact actions", icon: Sparkles },
              { val: "5", lbl: "Daily habit trackers", icon: CalendarCheck },
              { val: "5,680+", lbl: "Community members", icon: Users },
            ].map((s) => (
              <div key={s.lbl} className="ls-card flex flex-col items-center gap-2 p-5 text-center">
                <s.icon className="h-5 w-5 text-primary" />
                <span className="text-2xl font-extrabold">{s.val}</span>
                <span className="text-xs text-muted-foreground">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card/50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold lg:text-3xl">How Leafstep works</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
            Three simple steps from awareness to action.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="ls-card relative p-6 animate-slide-up"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold lg:text-3xl">
            Everything you need to make a difference
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="ls-card-hover flex gap-4 p-6 animate-slide-up"
                style={{ animationDelay: `${0.15 + i * 0.06}s` }}
              >
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                  style={{ background: `${f.color}18`, color: f.color }}
                >
                  <f.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-navy py-16 text-navy-foreground lg:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
          <Leaf className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-2xl font-extrabold lg:text-3xl">
            Ready to take your first leaf step?
          </h2>
          <p className="mt-3 text-sm text-navy-foreground/70 leading-relaxed">
            Join thousands tracking their footprint and building greener habits every day.
          </p>
          <Link
            to="/dashboard"
            className="btn-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground"
          >
            Start tracking free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Leafstep · Built for a cooler planet 🌱
      </footer>
    </div>
  );
}
