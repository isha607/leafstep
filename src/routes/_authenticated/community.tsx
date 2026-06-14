import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Crown, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/community")({
  component: CommunityPage,
});

const SEED = [
  { name: "Maya Okonkwo", score: 982 },
  { name: "Liam Frost", score: 911 },
  { name: "Sofia Reyes", score: 874 },
  { name: "Arjun Patel", score: 803 },
  { name: "Nina Berg", score: 752 },
  { name: "Tom Saito", score: 690 },
];

const CHALLENGES = [
  { key: "carfree", title: "Car-Free Fortnight", members: 1240, desc: "Skip the car for 14 days straight.", tint: "var(--color-chart-1)" },
  { key: "meatless", title: "Meatless May", members: 3580, desc: "One month of plant-based eating.", tint: "var(--color-chart-2)" },
  { key: "zerowaste", title: "Zero-Waste Week", members: 860, desc: "Send nothing to landfill for 7 days.", tint: "var(--color-chart-3)" },
];

function avatarColor(name: string) {
  const colors = ["#1d9e75", "#38bdf8", "#f59e0b", "#a855f7", "#e0533d", "#0ea5e9"];
  let h = 0;
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function CommunityPage() {
  const { user } = useAuth();
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, score")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const me = {
    name: profile?.display_name ?? "You",
    score: profile?.score ?? 640,
    isMe: true,
  };

  const board = [...SEED.map((s) => ({ ...s, isMe: false })), me].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Community</h1>
        <p className="text-sm text-muted-foreground">See how you stack up and join the movement.</p>
      </div>

      <section className="ls-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border p-5">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="font-bold">Leaderboard</h2>
        </div>
        <div className="divide-y divide-border">
          {board.map((p, i) => (
            <div
              key={p.name + i}
              className={`flex items-center gap-4 px-5 py-3 ${p.isMe ? "bg-primary-soft" : ""}`}
            >
              <span className="w-6 shrink-0 text-center text-sm font-bold text-muted-foreground">
                {i === 0 ? <Crown className="mx-auto h-4 w-4 text-amber-500" /> : i + 1}
              </span>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: avatarColor(p.name) }}
              >
                {initials(p.name)}
              </span>
              <span className="flex-1 truncate text-sm font-semibold">
                {p.name} {p.isMe && <span className="text-primary">(You)</span>}
              </span>
              <span className="text-sm font-bold">{p.score}</span>
            </div>
          ))}
        </div>
      </section>

      <div>
        <h2 className="text-lg font-extrabold tracking-tight">Group Challenges</h2>
        <p className="text-sm text-muted-foreground">Team up to multiply your impact.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {CHALLENGES.map((c) => {
          const isJoined = !!joined[c.key];
          return (
            <div key={c.key} className="ls-card flex flex-col gap-3 p-5">
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ backgroundColor: `color-mix(in oklab, ${c.tint} 16%, transparent)`, color: c.tint }}
              >
                <Users className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="font-bold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {(c.members + (isJoined ? 1 : 0)).toLocaleString()} members
                </p>
              </div>
              <button
                onClick={() => setJoined((j) => ({ ...j, [c.key]: !j[c.key] }))}
                className={`rounded-lg py-2 text-sm font-bold transition-colors ${
                  isJoined
                    ? "border border-primary bg-primary-soft text-accent-foreground"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {isJoined ? "Joined ✓" : "Join Challenge"}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
