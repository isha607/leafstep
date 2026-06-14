import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Bike, Recycle, Beef, Plug, ShoppingBag, Flame } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/habits")({
  component: HabitsPage,
});

const HABITS = [
  { key: "bike", label: "Bike or walk", icon: Bike, saved: 0.6 },
  { key: "recycle", label: "Recycle waste", icon: Recycle, saved: 0.2 },
  { key: "meatfree", label: "Meat-free meal", icon: Beef, saved: 0.5 },
  { key: "unplug", label: "Unplug devices", icon: Plug, saved: 0.1 },
  { key: "reusable", label: "Reusable bag/cup", icon: ShoppingBag, saved: 0.15 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Monday-based week dates (ISO) for the current week
function weekDates(): string[] {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function HabitsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const dates = weekDates();

  const { data: logs = [] } = useQuery({
    queryKey: ["habits", user?.id, dates[0]],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("habit_key, day")
        .eq("user_id", user!.id)
        .gte("day", dates[0])
        .lte("day", dates[6]);
      if (error) throw error;
      return data;
    },
  });

  const logged = new Set(logs.map((l) => `${l.habit_key}|${l.day}`));

  const toggle = useMutation({
    mutationFn: async ({ key, day, on }: { key: string; day: string; on: boolean }) => {
      if (on) {
        const { error } = await supabase
          .from("habits")
          .delete()
          .eq("user_id", user!.id)
          .eq("habit_key", key)
          .eq("day", day);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("habits")
          .insert({ user_id: user!.id, habit_key: key, day });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits", user?.id, dates[0]] }),
    onError: () => toast.error("Could not log habit."),
  });

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayIdx = dates.indexOf(todayIso);

  const weeklySaved = HABITS.reduce((sum, h) => {
    const count = dates.filter((d) => logged.has(`${h.key}|${d}`)).length;
    return sum + count * h.saved;
  }, 0);

  // streak: consecutive days up to today where at least one habit logged
  let streak = 0;
  for (let i = (todayIdx === -1 ? 6 : todayIdx); i >= 0; i--) {
    const any = HABITS.some((h) => logged.has(`${h.key}|${dates[i]}`));
    if (any) streak++;
    else break;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Habits Tracker</h1>
        <p className="text-sm text-muted-foreground">Tap a dot to log a habit for that day.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="ls-card flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Flame className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-extrabold">{streak} day{streak === 1 ? "" : "s"}</p>
            <p className="text-sm text-muted-foreground">Current streak</p>
          </div>
        </div>
        <div className="ls-card flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold">
            kg
          </span>
          <div>
            <p className="text-2xl font-extrabold">{(weeklySaved * 1000).toFixed(0)} kg</p>
            <p className="text-sm text-muted-foreground">CO₂ saved this week</p>
          </div>
        </div>
      </div>

      <section className="ls-card overflow-x-auto p-5">
        <div className="min-w-[480px]">
          <div className="mb-3 grid grid-cols-[1fr_repeat(7,2.25rem)] items-center gap-2">
            <span />
            {DAYS.map((d, i) => (
              <span
                key={d}
                className={`text-center text-xs font-bold ${i === todayIdx ? "text-primary" : "text-muted-foreground"}`}
              >
                {d}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {HABITS.map((h) => (
              <div key={h.key} className="grid grid-cols-[1fr_repeat(7,2.25rem)] items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <h.icon className="h-[18px] w-[18px] text-muted-foreground" />
                  <span className="text-sm font-semibold">{h.label}</span>
                </div>
                {dates.map((day, i) => {
                  const on = logged.has(`${h.key}|${day}`);
                  return (
                    <button
                      key={day}
                      onClick={() => toggle.mutate({ key: h.key, day, on })}
                      disabled={!user || toggle.isPending}
                      className={`mx-auto h-7 w-7 rounded-full border-2 transition-all disabled:opacity-50 ${
                        on
                          ? "border-primary bg-primary"
                          : i === todayIdx
                            ? "border-primary/40 bg-transparent hover:bg-primary-soft"
                            : "border-border bg-transparent hover:border-primary/50"
                      }`}
                      aria-label={`${h.label} ${day}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
