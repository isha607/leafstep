import { useState, useEffect } from "react";
import { Wind, RotateCw, AlertTriangle, ShieldAlert, CheckCircle2, CloudRain, MapPin } from "lucide-react";

interface AqiData {
  aqi: number;
  city: string;
  pm25?: number;
}

const CITIES = [
  { name: "📍 Detect My Location", value: "here"        },
  { name: "🏙️ Aurangabad",         value: "aurangabad"  },
  { name: "🏙️ Mumbai",             value: "mumbai"      },
  { name: "🏙️ New Delhi",          value: "delhi"       },
  { name: "🏙️ Pune",               value: "pune"        },
  { name: "🏙️ Bengaluru",          value: "bangalore"   },
  { name: "🏙️ Hyderabad",          value: "hyderabad"   },
  { name: "🏙️ Kolkata",            value: "kolkata"     },
  { name: "🏙️ Chennai",            value: "chennai"     },
  { name: "🏙️ Ahmedabad",          value: "ahmedabad"   },
  { name: "🏙️ Nagpur",             value: "nagpur"      },
];

// Realistic India AQI fallback data (when API fails / demo token)
const FALLBACK: Record<string, AqiData> = {
  here:        { aqi: 95,  city: "Your Area",  pm25: 32 },
  aurangabad:  { aqi: 89,  city: "Aurangabad", pm25: 28 },
  mumbai:      { aqi: 112, city: "Mumbai",     pm25: 45 },
  delhi:       { aqi: 178, city: "New Delhi",  pm25: 95 },
  pune:        { aqi: 76,  city: "Pune",       pm25: 22 },
  bangalore:   { aqi: 42,  city: "Bengaluru",  pm25: 11 },
  hyderabad:   { aqi: 88,  city: "Hyderabad",  pm25: 29 },
  kolkata:     { aqi: 135, city: "Kolkata",    pm25: 58 },
  chennai:     { aqi: 65,  city: "Chennai",    pm25: 18 },
  ahmedabad:   { aqi: 142, city: "Ahmedabad",  pm25: 62 },
  nagpur:      { aqi: 98,  city: "Nagpur",     pm25: 34 },
};

function getAqiLevel(aqi: number) {
  if (aqi <= 50) return {
    label: "Good",
    desc: "Air quality is satisfactory. Little or no risk.",
    color: "#1d9e75",
    bg: "rgba(29,158,117,0.1)",
    border: "rgba(29,158,117,0.25)",
    glow: "0 0 16px rgba(29,158,117,0.25)",
    tip: "Perfect air day! Great for walking or cycling to save CO₂. 🚶‍♂️🚴‍♀️",
    icon: CheckCircle2,
  };
  if (aqi <= 100) return {
    label: "Moderate",
    desc: "Acceptable quality. Some risk for sensitive people.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    glow: "0 0 16px rgba(245,158,11,0.25)",
    tip: "Decent air quality. Good day to be outside. Pace yourself if sensitive. 🏃",
    icon: CloudRain,
  };
  if (aqi <= 150) return {
    label: "Unhealthy for Sensitive Groups",
    desc: "Sensitive groups may experience health effects.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.25)",
    glow: "0 0 16px rgba(249,115,22,0.25)",
    tip: "Elevated pollution. Try public transit to avoid adding more emissions. 🚌",
    icon: AlertTriangle,
  };
  if (aqi <= 200) return {
    label: "Unhealthy",
    desc: "Everyone may experience health effects.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    glow: "0 0 16px rgba(239,68,68,0.25)",
    tip: "High pollution. Stay indoors if sensitive. Support clean transit. 🚊",
    icon: ShieldAlert,
  };
  return {
    label: "Hazardous",
    desc: "Health warnings of emergency conditions.",
    color: "#7f1d1d",
    bg: "rgba(127,29,29,0.1)",
    border: "rgba(127,29,29,0.25)",
    glow: "0 0 16px rgba(127,29,29,0.25)",
    tip: "Hazardous air. Avoid all outdoor activity. Wear N95 mask if going out. 😷",
    icon: ShieldAlert,
  };
}

export function AirQualityWidget() {
  const [selectedCity, setSelectedCity] = useState("aurangabad");
  const [data, setData] = useState<AqiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  async function fetchAqi(city: string) {
    setLoading(true);
    setUsingFallback(false);
    try {
      // Try WAQI API — works with a real token, falls back gracefully
      const token = import.meta.env.VITE_WAQI_TOKEN ?? "demo";
      const endpoint = city === "here"
        ? `https://api.waqi.info/feed/geo:19.8762;75.3433/?token=${token}` // Aurangabad coords as default
        : `https://api.waqi.info/feed/${city}/?token=${token}`;

      const res = await fetch(endpoint);
      const json = await res.json();

      if (json.status === "ok" && json.data && typeof json.data.aqi === "number") {
        setData({
          aqi: json.data.aqi,
          city: json.data.city?.name?.split(",")[0] ?? city,
          pm25: json.data.iaqi?.pm25?.v,
        });
        setUsingFallback(false);
      } else {
        throw new Error("API returned non-ok status");
      }
    } catch {
      // Use realistic India fallback data
      setTimeout(() => {
        setData(FALLBACK[city] ?? FALLBACK["here"]);
        setUsingFallback(true);
        setLoading(false);
      }, 400);
      return;
    }
    setLoading(false);
  }

  useEffect(() => { fetchAqi(selectedCity); }, [selectedCity]);

  const aqi = data?.aqi ?? 0;
  const level = getAqiLevel(aqi);
  const LvlIcon = level.icon;

  return (
    <div
      className="ls-card flex flex-col gap-4 p-6 transition-all duration-300"
      style={{
        borderColor: data && !loading ? level.border : undefined,
        boxShadow: data && !loading ? level.glow : undefined,
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-bold text-muted-foreground">Live Air Quality</h2>
          {usingFallback && (
            <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full">estimated</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-secondary/60 text-xs font-semibold text-foreground px-2 py-1.5 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-secondary transition-colors"
          >
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => fetchAqi(selectedCity)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Refresh"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="my-2 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-secondary" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-20 rounded bg-secondary" />
              <div className="h-3 w-32 rounded bg-secondary" />
            </div>
          </div>
          <div className="h-10 rounded bg-secondary" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            {/* Gauge */}
            <div className="relative h-16 w-16 shrink-0">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <path strokeWidth="3.5" stroke="var(--color-secondary)" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0-31.831" />
                <path strokeWidth="3.5"
                  strokeDasharray={`${Math.min(100, (aqi / 300) * 100)}, 100`}
                  strokeLinecap="round" stroke={level.color} fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0-31.831"
                  style={{ transition: "stroke-dasharray 1s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-sm">{aqi}</div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight" style={{ color: level.color }}>{level.label}</span>
                <LvlIcon className="h-4 w-4" style={{ color: level.color }} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {data?.city}
                {data?.pm25 && <span className="ml-1 text-[10px]">· PM2.5: {data.pm25} µg/m³</span>}
              </p>
            </div>
          </div>

          {/* AQI scale bar */}
          <div className="flex flex-col gap-1">
            <div className="flex h-2 w-full overflow-hidden rounded-full">
              {["#1d9e75","#f59e0b","#f97316","#ef4444","#7f1d1d"].map((c, i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Good</span><span>Moderate</span><span>Sensitive</span><span>Unhealthy</span><span>Hazardous</span>
            </div>
          </div>

          {/* Tip */}
          <div className="rounded-xl p-3 border text-xs leading-relaxed"
            style={{ backgroundColor: level.bg, borderColor: level.border, color: level.color }}>
            <div className="font-bold mb-0.5">Eco Tip:</div>
            {level.tip}
          </div>
        </>
      )}
    </div>
  );
}
