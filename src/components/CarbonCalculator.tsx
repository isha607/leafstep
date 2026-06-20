import { useState } from "react";
import { Car, Utensils, Zap, ShoppingCart, ChevronRight, ChevronLeft, Leaf, RotateCcw } from "lucide-react";

interface CalcData {
  carKmPerWeek: number;
  flightsPerYear: number;
  meatMealsPerWeek: number;
  electricityKwhPerMonth: number;
  gasUseLevel: number; // 0-3: none, low, med, high
  newItemsPerMonth: number;
}

const DEFAULT: CalcData = {
  carKmPerWeek: 100,
  flightsPerYear: 2,
  meatMealsPerWeek: 5,
  electricityKwhPerMonth: 200,
  gasUseLevel: 1,
  newItemsPerMonth: 3,
};

function calcFootprint(d: CalcData) {
  const transport = (d.carKmPerWeek * 52 * 0.21) / 1000 + d.flightsPerYear * 0.255;
  const diet = (d.meatMealsPerWeek * 2.5 + (14 - d.meatMealsPerWeek) * 0.5) * 52 / 1000;
  const energy = (d.electricityKwhPerMonth * 0.716 * 12) / 1000;
  const shopping = d.newItemsPerMonth * 12 * 0.06;
  return {
    transport: +transport.toFixed(2),
    diet: +diet.toFixed(2),
    energy: +energy.toFixed(2),
    shopping: +shopping.toFixed(2),
    total: +(transport + diet + energy + shopping).toFixed(2),
  };
}

const STEPS = [
  { icon: Car,          label: "Transport",    color: "text-rose-500",   bg: "bg-rose-50 dark:bg-rose-950/20",   border: "border-rose-200 dark:border-rose-900/30" },
  { icon: Utensils,     label: "Diet",         color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-950/20",  border: "border-amber-200 dark:border-amber-900/30" },
  { icon: Zap,          label: "Home Energy",  color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/20",   border: "border-blue-200 dark:border-blue-900/30" },
  { icon: ShoppingCart, label: "Shopping",     color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200 dark:border-purple-900/30" },
];

const GAS_LABELS = ["None / Electric", "Low", "Medium", "High"];

function Slider({
  label, value, min, max, step = 1, unit, onChange, description,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  unit: string; onChange: (v: number) => void; description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="rounded-lg bg-primary-soft px-2.5 py-0.5 text-sm font-bold text-accent-foreground">
          {value} {unit}
        </span>
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

function ResultsView({ data, onReset }: { data: CalcData; onReset: () => void }) {
  const fp = calcFootprint(data);
  const worldAvg = 4.7;
  const indiaAvg = 1.9;
  const percentage = Math.round((fp.total / worldAvg) * 100);

  const bars = [
    { label: "Transport",    value: fp.transport, color: "#ef4444", max: 6 },
    { label: "Diet",         value: fp.diet,      color: "#f59e0b", max: 4 },
    { label: "Home Energy",  value: fp.energy,    color: "#3b82f6", max: 4 },
    { label: "Shopping",     value: fp.shopping,  color: "#a855f7", max: 3 },
  ];

  const tips = [];
  if (fp.transport > 2)  tips.push("🚌 Try public transit or carpooling twice a week to cut transport emissions.");
  if (fp.diet > 1.5)     tips.push("🥗 Swapping 3 meat meals/week for plant-based saves ~0.5t CO₂ annually.");
  if (fp.energy > 1)     tips.push("💡 Switch to a renewable energy provider to slash home energy emissions.");
  if (fp.shopping > 0.5) tips.push("♻️ Buy secondhand first — extends product life and skips new manufacturing.");
  if (tips.length === 0) tips.push("🌱 Great job! You're already below average. Share your habits to inspire others.");

  const scoreColor =
    fp.total < 2 ? "#1d9e75" :
    fp.total < 4 ? "#f59e0b" :
    fp.total < 7 ? "#ef4444" : "#7f1d1d";

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Score headline */}
      <div className="flex flex-col items-center gap-1 text-center">
        <div
          className="text-5xl font-extrabold tracking-tight"
          style={{ color: scoreColor }}
        >
          {fp.total}t
        </div>
        <p className="text-sm font-semibold text-muted-foreground">CO₂ per year</p>
        <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
          <span>World avg: <b className="text-foreground">{worldAvg}t</b></span>
          <span>·</span>
          <span>India avg: <b className="text-foreground">{indiaAvg}t</b></span>
        </div>
        <div
          className="mt-2 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: scoreColor }}
        >
          {percentage < 100 ? `${100 - percentage}% below world average 🎉` : `${percentage - 100}% above world average`}
        </div>
      </div>

      {/* Category bars */}
      <div className="flex flex-col gap-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-semibold">{b.label}</span>
              <span className="text-muted-foreground">{b.value}t</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full progress-fill"
                style={{
                  width: `${Math.min(100, (b.value / b.max) * 100)}%`,
                  backgroundColor: b.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="rounded-2xl border border-primary/20 bg-primary-soft p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          Your top actions
        </p>
        <ul className="flex flex-col gap-2">
          {tips.slice(0, 3).map((t, i) => (
            <li key={i} className="text-sm text-foreground animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary"
      >
        <RotateCcw className="h-4 w-4" />
        Recalculate
      </button>
    </div>
  );
}

export function CarbonCalculator({
  onClose,
  onComplete,
}: {
  onClose?: () => void;
  onComplete?: (result: {
    transport: number;
    diet: number;
    energy: number;
    shopping: number;
    total: number;
  }) => void;
}) {
  const [step, setStep] = useState(0); // 0-3 input, 4 results
  const [data, setData] = useState<CalcData>(DEFAULT);
  const [done, setDone] = useState(false);

  function update<K extends keyof CalcData>(key: K, val: CalcData[K]) {
    setData((d) => ({ ...d, [key]: val }));
  }

  function reset() {
    setData(DEFAULT);
    setStep(0);
    setDone(false);
  }

  const isLast = step === 3;
  const StepIcon = STEPS[step]?.icon ?? Leaf;
  const stepInfo = STEPS[step];

  return (
    <div className="ls-card flex flex-col gap-5 p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <p className="font-extrabold leading-tight">Carbon Calculator</p>
            <p className="text-xs text-muted-foreground">Estimate your annual footprint</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary"
          >
            ✕
          </button>
        )}
      </div>

      {done ? (
        <ResultsView data={data} onReset={reset} />
      ) : (
        <>
          {/* Step progress */}
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          {/* Step header */}
          <div className={`flex items-center gap-3 rounded-xl border p-3 ${stepInfo.bg} ${stepInfo.border}`}>
            <span className={`grid h-9 w-9 place-items-center rounded-lg bg-white dark:bg-slate-900 ${stepInfo.color}`}>
              <StepIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-sm">{stepInfo.label}</p>
              <p className="text-xs text-muted-foreground">
                Step {step + 1} of 4
              </p>
            </div>
          </div>

          {/* Step content */}
          <div className="flex flex-col gap-5 animate-fade-in" key={step}>
            {step === 0 && (
              <>
                <Slider
                  label="Car distance"
                  value={data.carKmPerWeek}
                  min={0} max={500} step={10}
                  unit="km/week"
                  onChange={(v) => update("carKmPerWeek", v)}
                  description="Average weekly driving distance"
                />
                <Slider
                  label="Flights per year"
                  value={data.flightsPerYear}
                  min={0} max={20}
                  unit="flights"
                  onChange={(v) => update("flightsPerYear", v)}
                  description="Short-haul domestic flights (avg 1000 km)"
                />
              </>
            )}

            {step === 1 && (
              <Slider
                label="Meat meals per week"
                value={data.meatMealsPerWeek}
                min={0} max={21}
                unit="meals"
                onChange={(v) => update("meatMealsPerWeek", v)}
                description="Beef/lamb meals have ~7× the emissions of plant-based"
              />
            )}

            {step === 2 && (
              <>
                <Slider
                  label="Electricity usage"
                  value={data.electricityKwhPerMonth}
                  min={0} max={800} step={10}
                  unit="kWh/mo"
                  onChange={(v) => update("electricityKwhPerMonth", v)}
                  description="Check your electricity bill for monthly kWh"
                />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Gas / LPG usage</span>
                  <div className="grid grid-cols-4 gap-2">
                    {GAS_LABELS.map((lbl, i) => (
                      <button
                        key={i}
                        onClick={() => update("gasUseLevel", i)}
                        className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                          data.gasUseLevel === i
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <Slider
                label="New items bought"
                value={data.newItemsPerMonth}
                min={0} max={30}
                unit="items/mo"
                onChange={(v) => update("newItemsPerMonth", v)}
                description="Clothes, electronics, appliances, etc."
              />
            )}
          </div>

          {/* Nav buttons */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (isLast) {
                  const fp = calcFootprint(data);
                  onComplete?.(fp);
                  setDone(true);
                } else setStep((s) => s + 1);
              }}
              className="btn-glow flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground"
            >
              {isLast ? "Calculate my footprint" : "Next"}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
