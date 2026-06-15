import { useState } from "react";

const LEADERBOARD = [
  { rank: 1,  name: "Priya S.",  initials: "PS", color: "#E1F5EE", tc: "#0F6E56", score: 4.1, pct: 100, you: false },
  { rank: 2,  name: "You",       initials: "YO", color: "#E6F1FB", tc: "#185FA5", score: 6.2, pct: 66,  you: true  },
  { rank: 3,  name: "Rahul M.",  initials: "RM", color: "#FAEEDA", tc: "#854F0B", score: 6.8, pct: 60,  you: false },
  { rank: 4,  name: "Sneha K.",  initials: "SK", color: "#EEEDFE", tc: "#534AB7", score: 7.3, pct: 56,  you: false },
  { rank: 5,  name: "Ankit D.",  initials: "AD", color: "#FCEBEB", tc: "#993C1D", score: 8.5, pct: 48,  you: false },
];

const RANK_EMOJI = ["🥇", "🥈", "🥉", "4", "5"];

const CHALLENGES = [
  { id: "c1", icon: "🚴", title: "Bike Week Challenge",    desc: "Cycle instead of drive every day this week. 847 participants.", tag: "Ends in 3 days", tagColor: "text-green-400 bg-green-500/15 border-green-500/25", co2: "-0.4t CO₂" },
  { id: "c2", icon: "🌱", title: "Plant-based Monday",     desc: "Go meat-free every Monday for a month. 2,341 joined.",           tag: "Ongoing",       tagColor: "text-amber-400 bg-amber-500/15 border-amber-500/25", co2: "-0.2t CO₂" },
  { id: "c3", icon: "💡", title: "Switch to LED",          desc: "Replace all bulbs at home this month. Share your photo.",        tag: "1,102 done",    tagColor: "text-blue-400 bg-blue-500/15 border-blue-500/25",   co2: "-0.1t CO₂" },
];

export default function Community() {
  const [joined, setJoined] = useState<Set<string>>(new Set(["c2"]));

  const toggle = (id: string) => {
    setJoined(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="space-y-4">
      {/* Leaderboard */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-gray-800">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Leaderboard — this month</h3>
        </div>
        {LEADERBOARD.map((u, i) => (
          <div key={u.rank}
            className={`flex items-center gap-3 px-4 py-3 border-b border-gray-800 last:border-0 ${u.you ? "bg-gray-800/60" : ""}`}>
            <span className="text-sm font-medium w-5 text-center text-gray-400">{RANK_EMOJI[i]}</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ background: u.color, color: u.tc }}>{u.initials}</div>
            <span className="flex-1 text-sm font-medium text-white">
              {u.name}{u.you ? <span className="text-gray-500 font-normal"> (you)</span> : ""}
            </span>
            <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${u.pct}%` }} />
            </div>
            <span className="text-sm font-medium text-green-400 w-12 text-right">{u.score} t</span>
          </div>
        ))}
      </div>

      {/* Challenges */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">Group challenges</h3>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
          {CHALLENGES.map(c => (
            <div key={c.id} className="flex gap-3 p-4 items-start">
              <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">{c.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{c.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{c.desc}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${c.tagColor}`}>{c.tag}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full border bg-blue-500/15 text-blue-400 border-blue-500/25 font-medium">{c.co2}</span>
                </div>
              </div>
              <button
                onClick={() => toggle(c.id)}
                className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  joined.has(c.id)
                    ? "bg-green-500/20 border-green-500/40 text-green-400"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {joined.has(c.id) ? "Joined ✓" : "Join"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
