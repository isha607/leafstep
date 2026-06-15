import { useState, useMemo } from "react";
import AnimatedCityHero, { TransportMode } from "../components/hero/AnimatedCityHero";
import { useFootprintLogs } from "../hooks/useLeafstep";

const CATEGORIES = [
  { key: "transport", label: "Transport", icon: "🚗", color: "#E24B4A" },
  { key: "diet",      label: "Diet",      icon: "🥗", color: "#EF9F27" },
  { key: "energy",    label: "Home Energy",icon: "🏠", color: "#378ADD" },
  { key: "shopping",  label: "Shopping",  icon: "🛍️", color: "#7F77DD" },
];

// Simple SVG line chart
function TrendChart({ data }: { data: { label: string; value: number }[] }) {
  if (data.length < 2) return <div className="h-28 flex items-center justify-center text-sm text-gray-400">Not enough data yet</div>;
  const W = 560, H = 100, pad = 20;
  const vals = data.map(d => d.value);
  const min = Math.min(...vals) * 0.9, max = Math.max(...vals) * 1.05;
  const px = (i: number) => pad + (i / (data.length - 1)) * (W - pad * 2);
  const py = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(d.value)}`).join(" ");
  const areaD = `${pathD} L${px(data.length-1)},${H} L${px(0)},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28" preserveAspectRatio="none">
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#tg)" />
      <path d={pathD} fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={px(i)} cy={py(d.value)} r="3" fill="#1D9E75" />
          <text x={px(i)} y={H - 4} textAnchor="middle" fill="#6b7280" fontSize="9">{d.label}</text>
        </g>
      ))}
    </svg>
  );
}

// CO2 score ring
function ScoreRing({ tonnes, goal }: { tonnes: number; goal: number }) {
  const pct = Math.min(tonnes / (goal * 2), 1);
  const C = 2 * Math.PI * 33;
  const offset = C * (1 - pct);
  const color = tonnes <= goal ? "#1D9E75" : tonnes <= goal * 1.3 ? "#EF9F27" : "#E24B4A";

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r="33" fill="none" stroke="#1f2937" strokeWidth="7" />
        <circle cx="40" cy="40" r="33" fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-medium text-white leading-none">{tonnes.toFixed(1)}</span>
        <span className="text-[9px] text-gray-400 mt-0.5">t CO₂/yr</span>
      </div>
    </div>
  );
}

export default function Dashboard({ userId }: { userId: string }) {
  const [mode, setMode] = useState<TransportMode>("car");
  const { logs, loading, monthly } = useFootprintLogs(userId);

  // Demo breakdown (replace with real Supabase aggregation)
  const breakdown = { transport: 2.1, diet: 1.8, energy: 1.4, shopping: 0.9 };
  const totalTonnes = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const goal = 5;

  const chartData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return Object.entries(monthly).slice(-6).map(([key, val]) => ({
      label: months[parseInt(key.slice(5, 7)) - 1],
      value: parseFloat(val.toFixed(2)),
    }));
  }, [monthly]);

  // Fallback demo chart data
  const displayChart = chartData.length >= 2 ? chartData : [
    { label: "Jan", value: 8.4 }, { label: "Feb", value: 8.0 },
    { label: "Mar", value: 7.5 }, { label: "Apr", value: 7.1 },
    { label: "May", value: 6.7 }, { label: "Jun", value: 6.2 },
  ];

  return (
    <div className="space-y-4">
      <AnimatedCityHero mode={mode} onModeChange={setMode} />

      {/* Score + summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-4 items-center">
        <ScoreRing tonnes={totalTonnes} goal={goal} />
        <div>
          <h2 className="text-white font-medium text-base">38% below global average</h2>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            Global average is 10 t/yr. You need to cut <span className="text-green-400 font-medium">{(totalTonnes - goal).toFixed(1)} t</span> more to hit your goal.
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-[11px] bg-green-500/15 text-green-400 border border-green-500/25 px-2 py-0.5 rounded-full">↓ 2.2t saved this year</span>
            <span className="text-[11px] bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2 py-0.5 rounded-full">🔥 24 day streak</span>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Breakdown</h3>
        <div className="space-y-3">
          {CATEGORIES.map(c => {
            const val = breakdown[c.key as keyof typeof breakdown];
            const pct = (val / totalTonnes) * 100;
            return (
              <div key={c.key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: c.color + "25" }}>{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-300 mb-1">{c.label}</div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">{val} t</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">6-Month Trend</h3>
        <TrendChart data={displayChart} />
      </div>

      {/* Goal tracker */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Goal: {goal} t CO₂/yr</h3>
          <span className="text-xs text-green-400">{Math.round((1 - totalTonnes / (goal * 2)) * 100)}% there</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-2 rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700"
            style={{ width: `${Math.min((1 - (totalTonnes - goal) / goal) * 100, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-gray-500">Current: {totalTonnes.toFixed(1)} t</span>
          <span className="text-[10px] text-gray-500">Goal: {goal} t</span>
        </div>
      </div>
    </div>
  );
}
