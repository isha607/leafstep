import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  getStoredActions,
  isDemoMode,
  setStoredActions,
} from "@/lib/leafstep-storage";
import { Check, TreePine, Sun, Flame, Droplets, Sparkles, TrendingDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/actions")({
  component: ActionsPage,
});

type Difficulty = "Easy" | "Medium" | "Hard";

const ACTIONS: {
  key: string;
  title: string;
  desc: string;
  impact: string;
  savingTons: number;
  difficulty: Difficulty;
  emoji: string;
}[] = [
  { key: "ev_commute",  title: "Switch to electric or shared commute", desc: "Swap your daily drive for transit, carpool or EV.", impact: "-1.4t CO₂/yr", savingTons: 1.4, difficulty: "Hard",   emoji: "🚌" },
  { key: "plant_diet",  title: "Eat plant-based 5 days a week",        desc: "Cut red meat to slash diet emissions.",            impact: "-0.8t CO₂/yr", savingTons: 0.8, difficulty: "Medium", emoji: "🥗" },
  { key: "heat_pump",   title: "Lower thermostat by 2°C in winter",    desc: "Small comfort tweak, big energy savings.",          impact: "-0.6t CO₂/yr", savingTons: 0.6, difficulty: "Easy",   emoji: "🌡️" },
  { key: "green_energy",title: "Switch to a renewable energy plan",     desc: "Power your home with certified green electricity.", impact: "-1.1t CO₂/yr", savingTons: 1.1, difficulty: "Medium", emoji: "⚡" },
  { key: "less_flights",title: "Replace one flight with rail",          desc: "Trade a short-haul flight for the train.",          impact: "-0.5t CO₂/yr", savingTons: 0.5, difficulty: "Medium", emoji: "🚆" },
  { key: "secondhand",  title: "Buy secondhand before new",             desc: "Extend product life and skip manufacturing.",       impact: "-0.3t CO₂/yr", savingTons: 0.3, difficulty: "Easy",   emoji: "♻️" },
];

const OFFSETS = [
  { key: "trees",  title: "Plant Trees",       desc: "Native reforestation in degraded land.", price: "₹999 / mo",  icon: TreePine, tint: "var(--color-chart-1)" },
  { key: "solar",  title: "Solar Kits",        desc: "Off-grid solar for rural homes.",         price: "₹1499 / mo", icon: Sun,      tint: "var(--color-chart-3)" },
  { key: "biogas", title: "Biogas Digesters",  desc: "Turn farm waste into clean fuel.",         price: "₹749 / mo",  icon: Flame,    tint: "var(--color-destructive)" },
  { key: "water",  title: "Clean Water",       desc: "Safe water cuts the need to boil.",        price: "₹1249 / mo", icon: Droplets, tint: "var(--color-chart-2)" },
];

const DIFF_STYLE: Record<Difficulty, { badge: string; dot: string }> = {
  Easy:   { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  Medium: { badge: "bg-amber-100 text-amber-700",     dot: "bg-amber-400" },
  Hard:   { badge: "bg-rose-100 text-rose-700",       dot: "bg-rose-400" },
};

/* Simple confetti burst */
function ConfettiBurst({ x, y }: { x: number; y: number }) {
  const colors = ["#1d9e75", "#f59e0b", "#3b82f6", "#a855f7", "#ef4444"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: x + (Math.random() - 0.5) * 80,
            top: y + (Math.random() - 0.5) * 40,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${i * 0.04}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function ActionsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [confetti, setConfetti] = useState<{ x: number; y: number; id: number } | null>(null);
  const confettiId = useRef(0);

  const { data: completed = [] } = useQuery({
    queryKey: ["actions_completed", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      if (isDemoMode()) return getStoredActions(user.id);
      try {
        const { data, error } = await supabase
          .from("actions_completed")
          .select("action_key")
          .eq("user_id", user!.id);
        if (error) throw error;
        return data.map((r) => r.action_key);
      } catch {
        return getStoredActions(user.id);
      }
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ key, done }: { key: string; done: boolean }) => {
      if (!user) return;
      if (isDemoMode()) {
        const current = getStoredActions(user.id);
        const next = done ? current.filter((k) => k !== key) : [...current, key];
        setStoredActions(user.id, next);
        return;
      }
      try {
        if (done) {
          const { error } = await supabase
            .from("actions_completed")
            .delete()
            .eq("user_id", user!.id)
            .eq("action_key", key);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("actions_completed")
            .insert({ user_id: user!.id, action_key: key });
          if (error) throw error;
        }
      } catch {
        const current = getStoredActions(user.id);
        const next = done ? current.filter((k) => k !== key) : [...current, key];
        setStoredActions(user.id, next);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actions_completed", user?.id] }),
    onError: () => toast.error("Could not update. Try again."),
  });

  const doneCount = completed.length;
  const totalSaved = ACTIONS.filter((a) => completed.includes(a.key))
    .reduce((s, a) => s + a.savingTons, 0);
  const progressPct = Math.round((doneCount / ACTIONS.length) * 100);

  function handleToggle(key: string, isDone: boolean, e: React.MouseEvent) {
    if (!isDone) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      confettiId.current++;
      setConfetti({ x: rect.left + rect.width / 2, y: rect.top, id: confettiId.current });
      setTimeout(() => setConfetti(null), 900);
      toast.success("Action marked complete! 🌱");
    }
    toggle.mutate({ key, done: isDone });
  }

  return (
    <div className="flex flex-col gap-6">
      {confetti && <ConfettiBurst x={confetti.x} y={confetti.y} key={confetti.id} />}

      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Eco Actions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ranked by impact for you — {doneCount} of {ACTIONS.length} completed.
        </p>
      </div>

      {/* Progress header card */}
      <div className="ls-card p-5 animate-slide-up stagger-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">Your Progress</span>
          </div>
          <span className="text-sm font-bold text-primary">{progressPct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {doneCount}/{ACTIONS.length} actions complete
          </p>
          {totalSaved > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1">
              <TrendingDown className="h-3 w-3 text-primary" />
              <span className="text-xs font-bold text-accent-foreground">
                -{totalSaved.toFixed(1)}t CO₂/yr saved
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action cards */}
      <section className="flex flex-col gap-3">
        {ACTIONS.map((a, i) => {
          const isDone = completed.includes(a.key);
          return (
            <div
              key={a.key}
              className={`ls-card-hover flex items-center gap-4 p-4 animate-slide-up transition-all ${
                isDone ? "bg-primary-soft border-primary/20" : ""
              }`}
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              {/* Rank / emoji */}
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-lg">
                {isDone ? "✅" : a.emoji}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className={`font-bold leading-snug ${isDone ? "line-through opacity-50" : ""}`}>
                  {a.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground truncate">{a.desc}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                    {a.impact}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1 ${DIFF_STYLE[a.difficulty].badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${DIFF_STYLE[a.difficulty].dot}`} />
                    {a.difficulty}
                  </span>
                </div>
              </div>

              {/* Toggle button */}
              <button
                onClick={(e) => handleToggle(a.key, isDone, e)}
                disabled={!user || toggle.isPending}
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 disabled:opacity-50 ${
                  isDone
                    ? "border-primary bg-primary text-primary-foreground scale-100"
                    : "border-border text-transparent hover:border-primary hover:bg-primary-soft hover:text-primary hover:scale-110"
                }`}
                aria-label={isDone ? "Mark as not done" : "Mark as done"}
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </section>

      {/* Offset marketplace */}
      <div className="pt-2 animate-slide-up stagger-4">
        <h2 className="text-lg font-extrabold tracking-tight">Offset Marketplace</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fund verified projects to neutralize what you can't yet cut.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up stagger-5">
        {OFFSETS.map((o, i) => (
          <div
            key={o.key}
            className="ls-card-hover flex flex-col gap-3 p-5"
            style={{ animationDelay: `${0.5 + i * 0.07}s` }}
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl"
              style={{
                backgroundColor: `color-mix(in oklab, ${o.tint} 16%, transparent)`,
                color: o.tint,
              }}
            >
              <o.icon className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="font-bold">{o.title}</p>
              <p className="text-sm text-muted-foreground">{o.desc}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{o.price}</span>
              <button
                onClick={() => toast.success(`Thanks for supporting ${o.title}! 🌿`)}
                className="btn-glow rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
              >
                Offset
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
