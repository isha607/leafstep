import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getStoredFootprint, DEFAULT_FOOTPRINT } from "@/lib/leafstep-storage";
import { Trophy, Crown, Users, Globe, TrendingDown, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/community")({
  component: CommunityPage,
});

const SEED = [
  { name: "Maya Okonkwo", score: 982, saved: "3.2t" },
  { name: "Liam Frost",   score: 911, saved: "2.8t" },
  { name: "Sofia Reyes",  score: 874, saved: "2.5t" },
  { name: "Arjun Patel",  score: 803, saved: "2.1t" },
  { name: "Nina Berg",    score: 752, saved: "1.9t" },
  { name: "Tom Saito",    score: 690, saved: "1.6t" },
];

const CHALLENGES = [
  {
    key: "carfree",
    title: "Car-Free Fortnight",
    members: 1240,
    desc: "Skip the car for 14 days straight.",
    tint: "var(--color-chart-1)",
    emoji: "🚲",
    impact: "-0.5t CO₂",
    daysLeft: 8,
  },
  {
    key: "meatless",
    title: "Meatless May",
    members: 3580,
    desc: "One month of plant-based eating.",
    tint: "var(--color-chart-2)",
    emoji: "🥗",
    impact: "-0.8t CO₂",
    daysLeft: 16,
  },
  {
    key: "zerowaste",
    title: "Zero-Waste Week",
    members: 860,
    desc: "Send nothing to landfill for 7 days.",
    tint: "var(--color-chart-3)",
    emoji: "♻️",
    impact: "-0.2t CO₂",
    daysLeft: 3,
  },
];

const GLOBAL_STATS = [
  { icon: Users,       label: "Members",       value: "5,680",  color: "#3b82f6" },
  { icon: TrendingDown,label: "CO₂ saved",     value: "12.4t",  color: "#1d9e75" },
  { icon: Zap,         label: "Actions done",  value: "24,310", color: "#f59e0b" },
  { icon: Globe,       label: "Countries",     value: "42",     color: "#a855f7" },
];

function avatarColor(name: string) {
  const colors = ["#1d9e75","#38bdf8","#f59e0b","#a855f7","#e0533d","#0ea5e9"];
  let h = 0;
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 0) return (
    <span className="relative">
      <Crown className="h-5 w-5 text-amber-400" />
      <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
    </span>
  );
  if (rank === 1) return <span className="text-sm font-bold text-slate-400">2</span>;
  if (rank === 2) return <span className="text-sm font-bold text-amber-700">3</span>;
  return <span className="text-sm font-bold text-muted-foreground">{rank + 1}</span>;
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

  const fp = user ? getStoredFootprint(user.id) ?? DEFAULT_FOOTPRINT : DEFAULT_FOOTPRINT;
  const me = {
    name: profile?.display_name ?? "You",
    score: profile?.score ?? Math.round(1000 - fp.total * 55),
    saved: `${Math.max(0.5, 10 - fp.total).toFixed(1)}t`,
    isMe: true,
  };

  const board = [
    ...SEED.map((s) => ({ ...s, isMe: false })),
    me,
  ].sort((a, b) => b.score - a.score);

  function handleJoin(key: string) {
    setJoined((j) => {
      const next = { ...j, [key]: !j[key] };
      if (next[key]) toast.success("Challenge joined! 🎯 You're making a difference.");
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Community</h1>
        <p className="text-sm text-muted-foreground mt-0.5">See how you stack up and join the movement.</p>
      </div>

      {/* Global stats banner */}
      <div className="ls-card p-5 animate-slide-up stagger-1">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          🌍 Leafstep community impact — this month
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GLOBAL_STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-xl border border-border p-3 text-center"
            >
              <s.icon className="h-5 w-5" style={{ color: s.color }} />
              <span className="text-lg font-extrabold">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <section className="ls-card overflow-hidden animate-slide-up stagger-2">
        <div className="flex items-center gap-2 border-b border-border p-5">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="font-bold">Leaderboard</h2>
          <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
            This month
          </span>
        </div>
        <div className="divide-y divide-border">
          {board.map((p, i) => (
            <div
              key={p.name + i}
              className={`flex items-center gap-3 px-5 py-3 transition-colors animate-slide-in-left ${
                p.isMe ? "bg-primary-soft" : "hover:bg-secondary/40"
              }`}
              style={{ animationDelay: `${0.25 + i * 0.05}s` }}
            >
              {/* Rank */}
              <span className="w-6 shrink-0 text-center">
                <RankBadge rank={i} />
              </span>

              {/* Avatar */}
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: avatarColor(p.name) }}
              >
                {initials(p.name)}
              </span>

              {/* Name + saved */}
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold truncate">
                  {p.name}{" "}
                  {p.isMe && <span className="text-xs font-bold text-primary">(You)</span>}
                </span>
                <span className="text-xs text-muted-foreground">saved {p.saved} CO₂</span>
              </div>

              {/* Score */}
              <div className="text-right">
                <span className="block text-sm font-extrabold">{p.score}</span>
                <span className="text-[10px] text-muted-foreground">pts</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Group challenges */}
      <div className="animate-slide-up stagger-3">
        <h2 className="text-lg font-extrabold tracking-tight">Group Challenges</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Team up to multiply your impact.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3 animate-slide-up stagger-4">
        {CHALLENGES.map((c, i) => {
          const isJoined = !!joined[c.key];
          return (
            <div
              key={c.key}
              className="ls-card-hover flex flex-col gap-3 p-5"
              style={{ animationDelay: `${0.4 + i * 0.07}s` }}
            >
              {/* Icon + days left badge */}
              <div className="flex items-start justify-between">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `color-mix(in oklab, ${c.tint} 16%, transparent)` }}
                >
                  {c.emoji}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  {c.daysLeft}d left
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="font-bold">{c.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{c.desc}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    👥 {(c.members + (isJoined ? 1 : 0)).toLocaleString()} members
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: `color-mix(in oklab, ${c.tint} 80%, #000)` }}
                  >
                    {c.impact}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleJoin(c.key)}
                className={`btn-glow rounded-xl py-2.5 text-sm font-bold transition-all ${
                  isJoined
                    ? "border border-primary bg-primary-soft text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {isJoined ? "✓ Joined" : "Join Challenge"}
              </button>
            </div>
          );
        })}
      </section>

      {/* Community tip */}
      <div className="ls-card p-4 border-l-4 border-l-blue-400 animate-slide-up stagger-5">
        <p className="text-sm font-bold">🤝 Community accountability works</p>
        <p className="text-sm text-muted-foreground mt-1">
          Studies show people in group challenges are <b>2× more likely</b> to stick to their eco goals. Invite a friend to join Leafstep!
        </p>
      </div>
    </div>
  );
}
