import { useActions } from "../hooks/useLeafstep";

const ACTIONS = [
  { id: "a1", icon: "🚌", bg: "#E1F5EE", title: "Take public transport twice a week",   desc: "Swapping 2 car trips/week saves ~0.6 t CO₂/year.",                    impact: "-0.6 t/yr", effort: "Easy",   effortColor: "text-green-400 bg-green-500/15 border-green-500/25" },
  { id: "a2", icon: "🥦", bg: "#FAEEDA", title: "Go meat-free on weekdays",              desc: "Plant-based meals on weekdays cuts dietary emissions by 40%.",        impact: "-0.7 t/yr", effort: "Medium", effortColor: "text-amber-400 bg-amber-500/15 border-amber-500/25"  },
  { id: "a3", icon: "🌡️", bg: "#E6F1FB", title: "Lower thermostat by 2°C",              desc: "Each degree saves ~6% of heating energy bills.",                      impact: "-0.3 t/yr", effort: "Easy",   effortColor: "text-green-400 bg-green-500/15 border-green-500/25" },
  { id: "a4", icon: "✈️", bg: "#FCEBEB", title: "Skip one short-haul flight",           desc: "Replace a 1-hr flight with train — biggest single action you can take.", impact: "-0.8 t/yr", effort: "Hard",   effortColor: "text-red-400 bg-red-500/15 border-red-500/25"       },
  { id: "a5", icon: "💡", bg: "#EEEDFE", title: "Switch to LED bulbs",                  desc: "LED bulbs use 75% less energy than incandescent.",                    impact: "-0.1 t/yr", effort: "Easy",   effortColor: "text-green-400 bg-green-500/15 border-green-500/25" },
  { id: "a6", icon: "🚿", bg: "#E1F5EE", title: "Shorten showers by 2 minutes",        desc: "Saves hot water energy and ~30L of water per shower.",                 impact: "-0.05 t/yr",effort: "Easy",   effortColor: "text-green-400 bg-green-500/15 border-green-500/25" },
];

const OFFSETS = [
  { icon: "🌳", title: "Plant native trees",  desc: "Reforestation in the Western Ghats. Verified carbon removal.", price: "₹250 / tree" },
  { icon: "☀️", title: "Rural solar kits",    desc: "Fund solar lanterns for off-grid villages in Rajasthan.",     price: "₹500 / kit"  },
  { icon: "🌾", title: "Biogas projects",     desc: "Convert agricultural waste into clean cooking fuel.",          price: "₹750 / month"},
  { icon: "💧", title: "Clean water access",  desc: "Replace kerosene boiling with UV water purifiers.",           price: "₹400 / unit" },
];

export default function Actions({ userId }: { userId: string }) {
  const { completed, toggleAction } = useActions(userId);

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
        <div className="px-4 pt-4 pb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Top picks — high impact</h3>
        </div>
        {ACTIONS.map((a, i) => {
          const done = completed.has(a.id);
          return (
            <div key={a.id} className={`flex gap-3 p-4 items-start transition-opacity ${done ? "opacity-50" : ""}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: a.bg + "33" }}>{a.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? "line-through text-gray-500" : "text-white"}`}>{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{a.desc}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full border bg-green-500/15 text-green-400 border-green-500/25 font-medium">{a.impact}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${a.effortColor}`}>{a.effort}</span>
                </div>
              </div>
              <button
                onClick={() => toggleAction(a.id)}
                className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  done
                    ? "bg-green-500/20 border-green-500/40 text-green-400"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {done ? "Done ✓" : "Add"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Offsets */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">Offset your footprint</h3>
        <div className="grid grid-cols-2 gap-3">
          {OFFSETS.map(o => (
            <button key={o.title}
              className="text-left bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-green-500/40 transition-all group">
              <div className="text-2xl mb-2">{o.icon}</div>
              <div className="text-sm font-medium text-white mb-1">{o.title}</div>
              <div className="text-xs text-gray-400 leading-relaxed mb-2">{o.desc}</div>
              <div className="text-xs font-semibold text-green-400">{o.price}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
