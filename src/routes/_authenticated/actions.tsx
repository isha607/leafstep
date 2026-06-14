import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Check, TreePine, Sun, Flame, Droplets } from "lucide-react";
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
  difficulty: Difficulty;
}[] = [
  { key: "ev_commute", title: "Switch to an electric or shared commute", desc: "Swap your daily drive for transit, carpool or EV.", impact: "-1.4t CO₂/yr", difficulty: "Hard" },
  { key: "plant_diet", title: "Eat plant-based 5 days a week", desc: "Cut red meat to slash diet emissions.", impact: "-0.8t CO₂/yr", difficulty: "Medium" },
  { key: "heat_pump", title: "Lower thermostat by 2°C in winter", desc: "Small comfort tweak, big energy savings.", impact: "-0.6t CO₂/yr", difficulty: "Easy" },
  { key: "green_energy", title: "Switch to a renewable energy plan", desc: "Power your home with certified green electricity.", impact: "-1.1t CO₂/yr", difficulty: "Medium" },
  { key: "less_flights", title: "Replace one flight with rail this year", desc: "Trade a short-haul flight for the train.", impact: "-0.5t CO₂/yr", difficulty: "Medium" },
  { key: "secondhand", title: "Buy secondhand before new", desc: "Extend product life and skip new manufacturing.", impact: "-0.3t CO₂/yr", difficulty: "Easy" },
];

const OFFSETS = [
  { key: "trees", title: "Plant Trees", desc: "Native reforestation in degraded land.", price: "$12 / mo", icon: TreePine, tint: "var(--color-chart-1)" },
  { key: "solar", title: "Solar Kits", desc: "Off-grid solar for rural homes.", price: "$18 / mo", icon: Sun, tint: "var(--color-chart-3)" },
  { key: "biogas", title: "Biogas Digesters", desc: "Turn farm waste into clean fuel.", price: "$9 / mo", icon: Flame, tint: "var(--color-destructive)" },
  { key: "water", title: "Clean Water", desc: "Safe water cuts the need to boil.", price: "$15 / mo", icon: Droplets, tint: "var(--color-chart-2)" },
];

const DIFF_STYLE: Record<Difficulty, string> = {
  Easy: "bg-primary-soft text-accent-foreground",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700",
};

function ActionsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: completed = [] } = useQuery({
    queryKey: ["actions_completed", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actions_completed")
        .select("action_key")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data.map((r) => r.action_key);
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ key, done }: { key: string; done: boolean }) => {
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
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actions_completed", user?.id] }),
    onError: () => toast.error("Could not update. Try again."),
  });

  const doneCount = completed.length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Eco Actions</h1>
        <p className="text-sm text-muted-foreground">
          Ranked by impact for you — {doneCount} of {ACTIONS.length} done.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        {ACTIONS.map((a, i) => {
          const isDone = completed.includes(a.key);
          return (
            <div
              key={a.key}
              className={`ls-card flex items-center gap-4 p-4 transition-colors ${isDone ? "bg-primary-soft" : ""}`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`font-bold ${isDone ? "line-through opacity-60" : ""}`}>{a.title}</p>
                <p className="truncate text-sm text-muted-foreground">{a.desc}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                    {a.impact}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFF_STYLE[a.difficulty]}`}>
                    {a.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggle.mutate({ key: a.key, done: isDone })}
                disabled={!user || toggle.isPending}
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-colors disabled:opacity-50 ${
                  isDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-transparent hover:border-primary"
                }`}
                aria-label="Toggle done"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </section>

      <div className="pt-2">
        <h2 className="text-lg font-extrabold tracking-tight">Offset Marketplace</h2>
        <p className="text-sm text-muted-foreground">
          Fund verified projects to neutralize what you can't yet cut.
        </p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OFFSETS.map((o) => (
          <div key={o.key} className="ls-card flex flex-col gap-3 p-5">
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl"
              style={{ backgroundColor: `color-mix(in oklab, ${o.tint} 16%, transparent)`, color: o.tint }}
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
                onClick={() => toast.success(`Thanks for supporting ${o.title}!`)}
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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
