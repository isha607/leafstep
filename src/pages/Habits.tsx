import { useEffect } from "react";
import { useHabits } from "../hooks/useLeafstep";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function Habits({ userId }: { userId: string }) {
  const { habits, loading, toggleDay, createDefaultHabits } = useHabits(userId);

  useEffect(() => {
    if (!loading && habits.length === 0) createDefaultHabits();
  }, [loading, habits.length]);

  const totalDone   = habits.reduce((s, h) => s + h.days_completed.filter(Boolean).length, 0);
  const totalSlots  = habits.length * 7;
  const co2Avoided  = (totalDone * 0.12).toFixed(1);
  const leafPoints  = totalDone * 30;

  if (loading) return (
    <div className="space-y-3 pt-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-900 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { val: totalDone, lbl: "Habits logged" },
          { val: `-${co2Avoided} t`, lbl: "CO₂ avoided" },
          { val: leafPoints, lbl: "Leaf points" },
        ].map(s => (
          <div key={s.lbl} className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
            <div className="text-xl font-medium text-white">{s.val}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Habit grid */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">This week</h3>
          <div className="flex gap-1">
            {DAYS.map(d => (
              <div key={d} className="w-7 h-5 flex items-center justify-center text-[10px] text-gray-600 font-medium">{d}</div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {habits.map(h => (
            <div key={h.id} className="flex items-center gap-3">
              <span className="flex-1 text-sm text-gray-300 font-medium truncate">{h.habit_name}</span>
              <div className="flex gap-1">
                {h.days_completed.map((done, di) => (
                  <button
                    key={di}
                    onClick={() => toggleDay(h.id, di)}
                    className={`w-7 h-7 rounded-full border transition-all ${
                      done
                        ? "bg-green-500 border-green-400 shadow-sm shadow-green-500/30"
                        : "bg-gray-800 border-gray-700 hover:border-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-green-400 font-medium w-10 text-right">
                {h.streak_days > 0 ? `🔥 ${h.streak_days}d` : "–"}
              </span>
            </div>
          ))}
        </div>

        {/* Weekly progress bar */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
            <span>Weekly completion</span>
            <span>{totalSlots > 0 ? Math.round((totalDone / totalSlots) * 100) : 0}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-1.5 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${totalSlots > 0 ? (totalDone / totalSlots) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Add habit hint */}
      <button className="w-full py-3 rounded-2xl border border-dashed border-gray-700 text-sm text-gray-500 hover:border-green-500/40 hover:text-green-400 transition-all">
        + Add custom habit
      </button>
    </div>
  );
}
