import { useEffect, useRef, useState } from "react";

export type TransportMode = "car" | "bus" | "bike" | "walk" | "ev";

interface ModeConfig {
  smogAlpha: number;
  fogColor: string;
  aqi: number;
  co2: string;
  visibility: string;
  emission: string;
  aqiImpact: string;
  saved: string;
  trees: string;
  label: string;
  icon: string;
}

const MODES: Record<TransportMode, ModeConfig> = {
  car:  { smogAlpha: 0.72, fogColor: "180,140,80",  aqi: 187, co2: "8.4 kg", visibility: "1.2 km", emission: "2.1 kg", aqiImpact: "+45", saved: "₹0",   trees: "14", label: "Car",  icon: "🚗" },
  bus:  { smogAlpha: 0.35, fogColor: "150,160,180", aqi: 72,  co2: "1.8 kg", visibility: "4.5 km", emission: "0.4 kg", aqiImpact: "+8",  saved: "₹180", trees: "3",  label: "Bus",  icon: "🚌" },
  bike: { smogAlpha: 0.08, fogColor: "100,160,120", aqi: 18,  co2: "0.0 kg", visibility: "9.8 km", emission: "0.0 kg", aqiImpact: "+0",  saved: "₹220", trees: "0",  label: "Bike", icon: "🚲" },
  walk: { smogAlpha: 0.05, fogColor: "80,160,120",  aqi: 12,  co2: "0.0 kg", visibility: "10+ km", emission: "0.0 kg", aqiImpact: "+0",  saved: "₹220", trees: "0",  label: "Walk", icon: "🚶" },
  ev:   { smogAlpha: 0.18, fogColor: "100,120,200", aqi: 38,  co2: "0.9 kg", visibility: "7.2 km", emission: "0.2 kg", aqiImpact: "+4",  saved: "₹120", trees: "2",  label: "EV",   icon: "⚡" },
};

const AQI_COLORS: Record<TransportMode, string> = {
  car: "#E24B4A", bus: "#378ADD", bike: "#1D9E75", walk: "#1D9E75", ev: "#7F77DD",
};

interface Building { x: number; w: number; h: number; floors: number; wPerFloor: number }
interface Particle  { x: number; y: number; vx: number; vy: number; r: number; alpha: number; life: number; decay: number; type: string }
interface Vehicle   { x: number; type: string; speed: number; w: number; h: number; color: string; exhaustTimer: number }

function genBuildings(): Building[] {
  const bldW = [28,36,22,44,30,26,38,24,32,20,42,28,34];
  const bldH = [80,120,60,160,100,70,140,55,90,65,130,75,110];
  const out: Building[] = [];
  let x = 0;
  while (x < 800) {
    const w = bldW[Math.floor(Math.random() * bldW.length)];
    const h = bldH[Math.floor(Math.random() * bldH.length)];
    out.push({ x, w, h, floors: Math.floor(h / 20), wPerFloor: Math.max(1, Math.floor(w / 12)) });
    x += w + 2 + Math.random() * 6;
  }
  return out;
}

function spawnVehicles(mode: TransportMode, W: number): Vehicle[] {
  const configs: Record<TransportMode, { type: string; count: number }[]> = {
    car:  [{ type: "car", count: 8 }, { type: "truck", count: 3 }],
    bus:  [{ type: "bus", count: 3 }, { type: "car",   count: 2 }],
    bike: [{ type: "bike",   count: 6 }, { type: "car", count: 1 }],
    walk: [{ type: "person", count: 8 }],
    ev:   [{ type: "ev",   count: 5 }, { type: "bike", count: 2 }],
  };
  const palette = ["#E24B4A","#3266ad","#888","#fff","#F0997B"];
  const out: Vehicle[] = [];
  configs[mode].forEach(({ type, count }) => {
    for (let i = 0; i < count; i++) {
      out.push({
        x: Math.random() * W,
        type,
        speed: type === "person" ? 0.4 : type === "bike" ? 0.8 : type === "bus" ? 1.1 : type === "ev" ? 1.5 : 1.8 + Math.random() * 0.8,
        w: type === "truck" ? 52 : type === "bus" ? 48 : type === "car" || type === "ev" ? 34 : type === "bike" ? 16 : 10,
        h: type === "truck" ? 22 : type === "bus" ? 20 : 14,
        color: type === "car" ? palette[Math.floor(Math.random() * palette.length)] :
               type === "bus" ? "#378ADD" : type === "truck" ? "#5F5E5A" : type === "ev" ? "#7F77DD" : "#1D9E75",
        exhaustTimer: 0,
      });
    }
  });
  return out;
}

export default function AnimatedCityHero({ mode, onModeChange }: { mode: TransportMode; onModeChange: (m: TransportMode) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef({ smogAlpha: 0.72, targetSmog: 0.72, fogColor: "180,140,80", mode: "car" as TransportMode });
  const dataRef   = useRef<{ buildings: Building[]; vehicles: Vehicle[]; particles: Particle[]; stars: { x: number; y: number; r: number; alpha: number }[]; smogClouds: { x: number; y: number; r: number; speed: number; alpha: number }[] }>({ buildings: [], vehicles: [], particles: [], stars: [], smogClouds: [] });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    dataRef.current.buildings  = genBuildings();
    dataRef.current.stars      = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random() * 0.4, r: Math.random() * 1.2, alpha: 0.3 + Math.random() * 0.5 }));
    dataRef.current.smogClouds = Array.from({ length: 18 }, () => ({ x: Math.random() * 800, y: Math.random() * 200 + 40, r: 40 + Math.random() * 60, speed: 0.1 + Math.random() * 0.2, alpha: 0.1 + Math.random() * 0.15 }));
  }, []);

  useEffect(() => {
    const cfg = MODES[mode];
    stateRef.current.targetSmog = cfg.smogAlpha;
    stateRef.current.fogColor   = cfg.fogColor;
    stateRef.current.mode       = mode;
    const canvas = canvasRef.current;
    if (canvas) dataRef.current.vehicles = spawnVehicles(mode, canvas.width);
    dataRef.current.particles = [];
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      canvas!.width  = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      dataRef.current.vehicles = spawnVehicles(stateRef.current.mode, canvas!.width);
    }
    resize();
    window.addEventListener("resize", resize);

    function roundRect(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }

    function drawBuildings(groundY: number) {
      const W = canvas!.width;
      dataRef.current.buildings.forEach(b => {
        const bx = (b.x / 800) * W, bw = (b.w / 800) * W;
        const bh = (b.h / 300) * canvas!.height * 0.55;
        const by = groundY - bh;
        ctx.fillStyle = "#1a2035"; ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 0.5; ctx.strokeRect(bx, by, bw, bh);
        const wh = bh / (b.floors + 1);
        for (let f = 0; f < b.floors; f++) {
          for (let wi = 0; wi < b.wPerFloor; wi++) {
            const lit = Math.random() > 0.35;
            const wx = bx + 4 + wi * (bw - 8) / b.wPerFloor;
            const wy = by + wh * f + 6;
            ctx.fillStyle = lit ? `rgba(255,220,120,${(0.4 + Math.random() * 0.4).toFixed(2)})` : "rgba(255,255,255,0.04)";
            ctx.fillRect(wx, wy, Math.max(4, (bw - 8) / b.wPerFloor - 3), Math.max(4, wh - 8));
          }
        }
      });
    }

    function drawVehicle(v: Vehicle, groundY: number) {
      const y = groundY - v.h;
      ctx.save();
      if (v.type === "person") {
        ctx.strokeStyle = "#9FE1CB"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(v.x, y - 8, 4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(v.x, y - 4); ctx.lineTo(v.x, y + 6);
        ctx.lineTo(v.x - 4, y + 12); ctx.moveTo(v.x, y + 6); ctx.lineTo(v.x + 4, y + 12);
        ctx.moveTo(v.x - 4, y + 2); ctx.lineTo(v.x + 4, y + 2); ctx.stroke();
      } else if (v.type === "bike") {
        ctx.strokeStyle = "#1D9E75"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(v.x - 6, y + 8, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(v.x + 6, y + 8, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(v.x - 6, y + 8); ctx.lineTo(v.x, y); ctx.lineTo(v.x + 6, y + 8); ctx.stroke();
      } else {
        ctx.fillStyle = v.color;
        roundRect(v.x - v.w / 2, y, v.w, v.h, 4); ctx.fill();
        ctx.fillStyle = "rgba(160,210,255,0.5)";
        if (v.type === "car" || v.type === "ev") { roundRect(v.x - v.w / 2 + 4, y + 2, v.w - 8, v.h / 2, 2); ctx.fill(); }
        else if (v.type === "bus") { for (let wi = 0; wi < 4; wi++) ctx.fillRect(v.x - v.w / 2 + 4 + wi * 10, y + 3, 7, 8); }
        else ctx.fillRect(v.x - v.w / 2 + 4, y + 3, v.w - 8, 8);
        ctx.fillStyle = "#222";
        ctx.beginPath(); ctx.arc(v.x - v.w / 2 + 8, y + v.h, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(v.x + v.w / 2 - 8, y + v.h, 5, 0, Math.PI * 2); ctx.fill();
        if (v.type === "ev") {
          ctx.shadowColor = "#7F77DD"; ctx.shadowBlur = 10;
          ctx.strokeStyle = "rgba(127,119,221,0.4)"; ctx.lineWidth = 1.5;
          roundRect(v.x - v.w / 2 - 1, y - 1, v.w + 2, v.h + 2, 5); ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
      ctx.restore();
    }

    function addExhaust(v: Vehicle, groundY: number) {
      if (v.type === "bike" || v.type === "person" || v.type === "ev") return;
      v.exhaustTimer++;
      const interval = v.type === "bus" ? 4 : v.type === "truck" ? 3 : 6;
      if (v.exhaustTimer % interval !== 0) return;
      const intensity = stateRef.current.mode === "car" ? 1 : stateRef.current.mode === "bus" ? 0.5 : 0.2;
      const num = v.type === "truck" ? 3 : v.type === "bus" ? 2 : 1;
      for (let n = 0; n < num; n++) {
        dataRef.current.particles.push({
          x: v.x - v.w * 0.4 + (Math.random() - 0.5) * 4,
          y: groundY - v.h * 0.5 - Math.random() * 4,
          vx: -0.3 + (Math.random() - 0.5) * 0.4,
          vy: -(0.3 + Math.random() * 0.5),
          r: 4 + Math.random() * 6, alpha: 0.5 * intensity, life: 1,
          decay: 0.008 + Math.random() * 0.006, type: v.type,
        });
      }
    }

    function draw() {
      const { smogAlpha: sa, targetSmog, fogColor } = stateRef.current;
      stateRef.current.smogAlpha += (targetSmog - sa) * 0.025;
      const smog = stateRef.current.smogAlpha;
      const W = canvas!.width, H = canvas!.height;
      ctx.clearRect(0, 0, W, H);

      // sky
      const sR = Math.round(10 + (100 - 10) * smog), sG = Math.round(14 + (80 - 14) * smog), sB = Math.round(26 + (50 - 26) * smog);
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
      sky.addColorStop(0, `rgb(${sR},${sG},${sB})`);
      sky.addColorStop(1, `rgb(${Math.round(sR*1.4)},${Math.round(sG*1.3)},${Math.round(sB*1.2)})`);
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      // stars
      dataRef.current.stars.forEach(s => {
        ctx.globalAlpha = s.alpha * (1 - smog * 0.9);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // smog clouds
      dataRef.current.smogClouds.forEach(c => {
        c.x += c.speed; if (c.x > 850) c.x = -80;
        const g2 = ctx.createRadialGradient(c.x / 800 * W, c.y / 300 * H, 0, c.x / 800 * W, c.y / 300 * H, c.r / 800 * W * 2);
        g2.addColorStop(0, `rgba(${fogColor},${(c.alpha * smog).toFixed(2)})`);
        g2.addColorStop(1, `rgba(${fogColor},0)`);
        ctx.fillStyle = g2; ctx.beginPath();
        ctx.ellipse(c.x / 800 * W, c.y / 300 * H, c.r / 800 * W * 3, c.r / 300 * H * 0.9, 0, 0, Math.PI * 2); ctx.fill();
      });

      // moon
      ctx.globalAlpha = Math.max(0.1, 1 - smog * 0.8);
      ctx.fillStyle = "#ffeebb"; ctx.beginPath(); ctx.arc(W * 0.82, H * 0.12, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgb(${sR},${sG},${sB})`; ctx.beginPath(); ctx.arc(W * 0.82 + 5, H * 0.12, 12, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;

      const groundY = H * 0.72;
      drawBuildings(groundY);

      // road
      const rg = ctx.createLinearGradient(0, groundY, 0, H);
      rg.addColorStop(0, "#1a1f2e"); rg.addColorStop(1, "#0d1018");
      ctx.fillStyle = rg; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1.5;
      ctx.setLineDash([20, 18]); ctx.beginPath(); ctx.moveTo(0, groundY + 18); ctx.lineTo(W, groundY + 18); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(0, groundY, W, 2);

      // exhaust particles
      for (let i = dataRef.current.particles.length - 1; i >= 0; i--) {
        const p = dataRef.current.particles[i];
        p.x += p.vx; p.y += p.vy; p.r += 0.12; p.life -= p.decay; p.alpha = p.life * 0.35;
        if (p.life <= 0) { dataRef.current.particles.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.type === "truck" ? "rgb(50,40,30)" : p.type === "bus" ? "rgb(80,90,110)" : "rgb(100,90,70)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // vehicles
      dataRef.current.vehicles.forEach(v => {
        v.x += v.speed * (W / 800);
        if (v.x > W + v.w) v.x = -v.w;
        addExhaust(v, groundY);
        drawVehicle(v, groundY);
      });

      // ground fog
      if (smog > 0.05) {
        const fg = ctx.createLinearGradient(0, groundY + 5, 0, H);
        fg.addColorStop(0, `rgba(${fogColor},0)`);
        fg.addColorStop(0.3, `rgba(${fogColor},${(smog * 0.4).toFixed(2)})`);
        fg.addColorStop(1, `rgba(${fogColor},${(smog * 0.6).toFixed(2)})`);
        ctx.fillStyle = fg; ctx.fillRect(0, groundY, W, H - groundY);
      }

      // haze
      const hz = ctx.createLinearGradient(0, 0, 0, groundY);
      hz.addColorStop(0, `rgba(${fogColor},0)`);
      hz.addColorStop(1, `rgba(${fogColor},${(smog * 0.55).toFixed(2)})`);
      ctx.fillStyle = hz; ctx.fillRect(0, 0, W, groundY);

      // street lamps
      [0.1, 0.28, 0.46, 0.64, 0.82].forEach(fx => {
        const lx = fx * W;
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(lx, groundY); ctx.lineTo(lx, groundY - 50); ctx.lineTo(lx + 10, groundY - 50); ctx.stroke();
        const lg = ctx.createRadialGradient(lx + 10, groundY - 50, 0, lx + 10, groundY - 50, 40);
        lg.addColorStop(0, "rgba(255,220,100,0.5)"); lg.addColorStop(1, "rgba(255,220,100,0)");
        ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx + 10, groundY - 50, 40, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,240,180,0.9)"; ctx.beginPath(); ctx.arc(lx + 10, groundY - 50, 3, 0, Math.PI * 2); ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const cfg = MODES[mode];
  const aqiColor = AQI_COLORS[mode];

  return (
    <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* HUD top */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-xs">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: aqiColor, boxShadow: `0 0 6px ${aqiColor}` }} />
        <span className="text-white/50">AQI</span>
        <span className="font-medium" style={{ color: aqiColor }}>{cfg.aqi}</span>
        <span className="w-px h-3 bg-white/15" />
        <span className="text-white/50">CO₂ today</span>
        <span className="text-white font-medium">{cfg.co2}</span>
        <span className="w-px h-3 bg-white/15" />
        <span className="text-white/50">Visibility</span>
        <span className="text-white font-medium">{cfg.visibility}</span>
      </div>

      {/* bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
        <div className="flex gap-2 mb-2">
          {(Object.keys(MODES) as TransportMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                mode === m
                  ? m === "car"  ? "bg-red-500/20 border-red-400 text-red-300"
                  : m === "bus"  ? "bg-blue-500/20 border-blue-400 text-blue-300"
                  : m === "ev"   ? "bg-violet-500/20 border-violet-400 text-violet-300"
                  : "bg-green-500/20 border-green-400 text-green-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
              }`}
            >
              <span className="text-base">{MODES[m].icon}</span>
              {MODES[m].label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { val: cfg.emission, lbl: "CO₂/trip" },
            { val: `${cfg.aqiImpact} AQI`, lbl: "Your impact" },
            { val: cfg.saved, lbl: "Saved vs car" },
            { val: `${cfg.trees} trees`, lbl: "To offset" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-center">
              <div className="text-white font-medium text-sm">{val}</div>
              <div className="text-white/40 text-[10px] mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
