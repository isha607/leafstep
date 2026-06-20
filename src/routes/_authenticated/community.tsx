import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Users, Flame, Medal, Star, Target, Leaf, ArrowUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/community")({
  component: CommunityPage,
});

const LEADERBOARD = [
  { rank: 1, name: "Priya S.",      city: "Bengaluru",  score: 94, saved: 3.2, badge: "🌳 Carbon Hero"    },
  { rank: 2, name: "Arjun M.",      city: "Pune",        score: 88, saved: 2.8, badge: "🌿 Eco Champion"  },
  { rank: 3, name: "Sneha R.",      city: "Mumbai",      score: 82, saved: 2.4, badge: "♻️ Green Warrior"  },
  { rank: 4, name: "Vikram P.",     city: "Hyderabad",   score: 79, saved: 2.1, badge: "🚴 Clean Commuter" },
  { rank: 5, name: "Anjali K.",     city: "New Delhi",   score: 75, saved: 1.9, badge: "🌱 Leaf Starter"   },
  { rank: 6, name: "Rahul D.",      city: "Chennai",     score: 71, saved: 1.7, badge: "🌱 Leaf Starter"   },
  { rank: 7, name: "Meera T.",      city: "Kolkata",     score: 68, saved: 1.5, badge: "🌱 Leaf Starter"   },
  { rank: 8, name: "Rohan B.",      city: "Ahmedabad",   score: 65, saved: 1.3, badge: "🌱 Leaf Starter"   },
];

const CHALLENGES = [
  {
    id: "meat-free-week",
    title: "Meat-Free Week 🥦",
    desc: "Go meat-free for 7 days and save up to 25 kg CO₂.",
    participants: 1240,
    daysLeft: 5,
    progress: 68,
    color: "#1d9e75",
    icon: "🥗",
  },
  {
    id: "bike-commute",
    title: "Bike Commute Month 🚴",
    desc: "Cycle or walk instead of driving for 30 days.",
    participants: 876,
    daysLeft: 18,
    progress: 42,
    color: "#38bdf8",
    icon: "🚴",
  },
  {
    id: "zero-plastic",
    title: "Zero-Plastic July ♻️",
    desc: "Refuse single-use plastics for the entire month.",
    participants: 2103,
    daysLeft: 11,
    progress: 55,
    color: "#a855f7",
    icon: "♻️",
  },
  {
    id: "energy-saver",
    title: "Energy Saver Sprint ⚡",
    desc: "Cut home energy use by 20% for two weeks.",
    participants: 652,
    daysLeft: 3,
    progress: 81,
    color: "#f59e0b",
    icon: "⚡",
  },
];

const STATS = [
  { val: "5,680+", lbl: "Community members", icon: Users,  color: "#1d9e75" },
  { val: "12.4t",  lbl: "CO₂ saved this month", icon: Leaf,   color: "#38bdf8" },
  { val: "4",      lbl: "Active challenges",   icon: Flame,  color: "#f59e0b" },
  { val: "94",     lbl: "Highest eco score",   icon: Trophy, color: "#a855f7" },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
      {rank}
    </span>
  );
}

function CommunityPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Community</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Join challenges, climb the leaderboard, and inspire others. 🌍
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-slide-up stagger-1">
        {STATS.map((s) => (
          <div key={s.lbl} className="ls-card p-4 flex flex-col items-center gap-2 text-center">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: `${s.color}20`, color: s.color }}
            >
              <s.icon className="h-4 w-4" />
            </span>
            <span className="text-xl font-extrabold">{s.val}</span>
            <span className="text-[11px] text-muted-foreground leading-snug">{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* Challenges */}
      <section className="animate-slide-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Active Challenges
          </h2>
          <span className="text-[11px] text-muted-foreground bg-secondary rounded-full px-2.5 py-1 font-semibold">
            {CHALLENGES.length} running
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {CHALLENGES.map((c, i) => (
            <div
              key={c.id}
              className="ls-card-hover flex flex-col gap-3 p-5 animate-slide-up"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{c.desc}</div>
                  </div>
                </div>
                <span
                  className="shrink-0 text-[10px] font-bold rounded-full px-2 py-1"
                  style={{ background: `${c.color}20`, color: c.color }}
                >
                  {c.daysLeft}d left
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">
                    <Users className="inline h-3 w-3 mr-1" />
                    {c.participants.toLocaleString()} participants
                  </span>
                  <span className="font-semibold" style={{ color: c.color }}>{c.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full progress-fill"
                    style={{ width: `${c.progress}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>

              <button
                className="btn-glow w-full rounded-xl py-2.5 text-xs font-bold transition-all"
                style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}30` }}
              >
                Join Challenge →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="ls-card p-6 animate-slide-up stagger-3">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Monthly Leaderboard
            </h2>
          </div>
          <span className="text-[11px] text-muted-foreground">June 2026</span>
        </div>

        <div className="flex flex-col gap-2">
          {LEADERBOARD.map((member, i) => (
            <div
              key={member.rank}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all animate-slide-in-left ${
                member.rank <= 3 ? "bg-primary-soft/60" : "hover:bg-secondary/50"
              }`}
              style={{ animationDelay: `${0.35 + i * 0.05}s` }}
            >
              <RankBadge rank={member.rank} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{member.name}</span>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">{member.city}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{member.badge}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-extrabold text-primary">{member.score}</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
                  <ArrowUp className="h-2.5 w-2.5 text-primary" />
                  {member.saved}t saved
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-secondary/40 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            <Medal className="inline h-3.5 w-3.5 text-primary mr-1" />
            Complete your carbon calculation and log habits to appear on the leaderboard!
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="ls-card p-5 flex flex-col sm:flex-row items-center gap-4 justify-between animate-slide-up stagger-4">
        <div>
          <div className="font-bold text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Want to climb the ranks?
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Log daily habits and complete your carbon footprint to earn points.
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <a
            href="/habits"
            className="btn-glow flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"
          >
            <Target className="h-3.5 w-3.5" />
            Log Habits
          </a>
        </div>
      </div>
    </div>
  );
}