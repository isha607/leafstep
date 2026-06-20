import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BqtwNJfn.mjs";
import { a as getStoredActions, c as isDemoMode, o as getStoredFootprint, s as getStoredHabits, t as DEFAULT_FOOTPRINT, u as setStoredFootprint } from "./demo-user-BPNeXgaL.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useAuth } from "./use-auth-CLea-AkB.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as ChevronRight, F as Award, L as ArrowRight, M as Calculator, S as Flame, b as Leaf, c as Target, d as Sparkles, n as X, o as TrendingDown } from "../_libs/lucide-react.mjs";
import { t as CarbonCalculator } from "./CarbonCalculator-BS3Yp4qA.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BEDecCC8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODES = {
	car: {
		smogAlpha: .72,
		fogColor: "180,140,80",
		aqi: 187,
		co2: "8.4 kg",
		visibility: "1.2 km",
		emission: "2.1 kg",
		aqiImpact: "+45",
		saved: "₹0",
		trees: "14",
		label: "Car",
		icon: "🚗"
	},
	bus: {
		smogAlpha: .35,
		fogColor: "150,160,180",
		aqi: 72,
		co2: "1.8 kg",
		visibility: "4.5 km",
		emission: "0.4 kg",
		aqiImpact: "+8",
		saved: "₹180",
		trees: "3",
		label: "Bus",
		icon: "🚌"
	},
	bike: {
		smogAlpha: .08,
		fogColor: "100,160,120",
		aqi: 18,
		co2: "0.0 kg",
		visibility: "9.8 km",
		emission: "0.0 kg",
		aqiImpact: "+0",
		saved: "₹220",
		trees: "0",
		label: "Bike",
		icon: "🚲"
	},
	walk: {
		smogAlpha: .05,
		fogColor: "80,160,120",
		aqi: 12,
		co2: "0.0 kg",
		visibility: "10+ km",
		emission: "0.0 kg",
		aqiImpact: "+0",
		saved: "₹220",
		trees: "0",
		label: "Walk",
		icon: "🚶"
	},
	ev: {
		smogAlpha: .18,
		fogColor: "100,120,200",
		aqi: 38,
		co2: "0.9 kg",
		visibility: "7.2 km",
		emission: "0.2 kg",
		aqiImpact: "+4",
		saved: "₹120",
		trees: "2",
		label: "EV",
		icon: "⚡"
	}
};
var AQI_COLORS = {
	car: "#E24B4A",
	bus: "#378ADD",
	bike: "#1D9E75",
	walk: "#1D9E75",
	ev: "#7F77DD"
};
function genBuildings() {
	const bldW = [
		28,
		36,
		22,
		44,
		30,
		26,
		38,
		24,
		32,
		20,
		42,
		28,
		34
	];
	const bldH = [
		80,
		120,
		60,
		160,
		100,
		70,
		140,
		55,
		90,
		65,
		130,
		75,
		110
	];
	const out = [];
	let x = 0;
	while (x < 800) {
		const w = bldW[Math.floor(Math.random() * bldW.length)];
		const h = bldH[Math.floor(Math.random() * bldH.length)];
		out.push({
			x,
			w,
			h,
			floors: Math.floor(h / 20),
			wPerFloor: Math.max(1, Math.floor(w / 12))
		});
		x += w + 2 + Math.random() * 6;
	}
	return out;
}
function spawnVehicles(mode, W) {
	const configs = {
		car: [{
			type: "car",
			count: 8
		}, {
			type: "truck",
			count: 3
		}],
		bus: [{
			type: "bus",
			count: 3
		}, {
			type: "car",
			count: 2
		}],
		bike: [{
			type: "bike",
			count: 6
		}, {
			type: "car",
			count: 1
		}],
		walk: [{
			type: "person",
			count: 8
		}],
		ev: [{
			type: "ev",
			count: 5
		}, {
			type: "bike",
			count: 2
		}]
	};
	const palette = [
		"#E24B4A",
		"#3266ad",
		"#888",
		"#fff",
		"#F0997B"
	];
	const out = [];
	configs[mode].forEach(({ type, count }) => {
		for (let i = 0; i < count; i++) out.push({
			x: Math.random() * W,
			type,
			speed: type === "person" ? .4 : type === "bike" ? .8 : type === "bus" ? 1.1 : type === "ev" ? 1.5 : 1.8 + Math.random() * .8,
			w: type === "truck" ? 52 : type === "bus" ? 48 : type === "car" || type === "ev" ? 34 : type === "bike" ? 16 : 10,
			h: type === "truck" ? 22 : type === "bus" ? 20 : 14,
			color: type === "car" ? palette[Math.floor(Math.random() * palette.length)] : type === "bus" ? "#378ADD" : type === "truck" ? "#5F5E5A" : type === "ev" ? "#7F77DD" : "#1D9E75",
			exhaustTimer: 0
		});
	});
	return out;
}
function AnimatedCityHero({ mode, onModeChange }) {
	const canvasRef = (0, import_react.useRef)(null);
	const stateRef = (0, import_react.useRef)({
		smogAlpha: .72,
		targetSmog: .72,
		fogColor: "180,140,80",
		mode: "car"
	});
	const dataRef = (0, import_react.useRef)({
		buildings: [],
		vehicles: [],
		particles: [],
		stars: [],
		smogClouds: []
	});
	const rafRef = (0, import_react.useRef)(0);
	const [liveAqi, setLiveAqi] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		dataRef.current.buildings = genBuildings();
		dataRef.current.stars = Array.from({ length: 60 }, () => ({
			x: Math.random(),
			y: Math.random() * .4,
			r: Math.random() * 1.2,
			alpha: .3 + Math.random() * .5
		}));
		dataRef.current.smogClouds = Array.from({ length: 18 }, () => ({
			x: Math.random() * 800,
			y: Math.random() * 200 + 40,
			r: 40 + Math.random() * 60,
			speed: .1 + Math.random() * .2,
			alpha: .1 + Math.random() * .15
		}));
	}, []);
	(0, import_react.useEffect)(() => {
		fetch(`https://api.waqi.info/feed/aurangabad/?token=b82cfb1d525b4a2fdaf2e324cac3fda3d4fd6ef3`).then((r) => r.json()).then((json) => {
			if (json.status === "ok") setLiveAqi(json.data.aqi);
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		const cfg = MODES[mode];
		stateRef.current.targetSmog = cfg.smogAlpha;
		stateRef.current.fogColor = cfg.fogColor;
		stateRef.current.mode = mode;
		const canvas = canvasRef.current;
		if (canvas) dataRef.current.vehicles = spawnVehicles(mode, canvas.width);
		dataRef.current.particles = [];
	}, [mode]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		function resize() {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			dataRef.current.vehicles = spawnVehicles(stateRef.current.mode, canvas.width);
		}
		resize();
		window.addEventListener("resize", resize);
		function roundRect(x, y, w, h, r) {
			ctx.beginPath();
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.arcTo(x + w, y, x + w, y + r, r);
			ctx.lineTo(x + w, y + h - r);
			ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
			ctx.lineTo(x + r, y + h);
			ctx.arcTo(x, y + h, x, y + h - r, r);
			ctx.lineTo(x, y + r);
			ctx.arcTo(x, y, x + r, y, r);
			ctx.closePath();
		}
		function drawBuildings(groundY) {
			const W = canvas.width;
			dataRef.current.buildings.forEach((b) => {
				const bx = b.x / 800 * W, bw = b.w / 800 * W;
				const bh = b.h / 300 * canvas.height * .55;
				const by = groundY - bh;
				ctx.fillStyle = "#1a2035";
				ctx.fillRect(bx, by, bw, bh);
				ctx.strokeStyle = "rgba(255,255,255,0.06)";
				ctx.lineWidth = .5;
				ctx.strokeRect(bx, by, bw, bh);
				const wh = bh / (b.floors + 1);
				for (let f = 0; f < b.floors; f++) for (let wi = 0; wi < b.wPerFloor; wi++) {
					const lit = Math.random() > .35;
					const wx = bx + 4 + wi * (bw - 8) / b.wPerFloor;
					const wy = by + wh * f + 6;
					ctx.fillStyle = lit ? `rgba(255,220,120,${(.4 + Math.random() * .4).toFixed(2)})` : "rgba(255,255,255,0.04)";
					ctx.fillRect(wx, wy, Math.max(4, (bw - 8) / b.wPerFloor - 3), Math.max(4, wh - 8));
				}
			});
		}
		function drawVehicle(v, groundY) {
			const y = groundY - v.h;
			ctx.save();
			if (v.type === "person") {
				ctx.strokeStyle = "#9FE1CB";
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.arc(v.x, y - 8, 4, 0, Math.PI * 2);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(v.x, y - 4);
				ctx.lineTo(v.x, y + 6);
				ctx.lineTo(v.x - 4, y + 12);
				ctx.moveTo(v.x, y + 6);
				ctx.lineTo(v.x + 4, y + 12);
				ctx.moveTo(v.x - 4, y + 2);
				ctx.lineTo(v.x + 4, y + 2);
				ctx.stroke();
			} else if (v.type === "bike") {
				ctx.strokeStyle = "#1D9E75";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(v.x - 6, y + 8, 7, 0, Math.PI * 2);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(v.x + 6, y + 8, 7, 0, Math.PI * 2);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(v.x - 6, y + 8);
				ctx.lineTo(v.x, y);
				ctx.lineTo(v.x + 6, y + 8);
				ctx.stroke();
			} else {
				ctx.fillStyle = v.color;
				roundRect(v.x - v.w / 2, y, v.w, v.h, 4);
				ctx.fill();
				ctx.fillStyle = "rgba(160,210,255,0.5)";
				if (v.type === "car" || v.type === "ev") {
					roundRect(v.x - v.w / 2 + 4, y + 2, v.w - 8, v.h / 2, 2);
					ctx.fill();
				} else if (v.type === "bus") for (let wi = 0; wi < 4; wi++) ctx.fillRect(v.x - v.w / 2 + 4 + wi * 10, y + 3, 7, 8);
				else ctx.fillRect(v.x - v.w / 2 + 4, y + 3, v.w - 8, 8);
				ctx.fillStyle = "#222";
				ctx.beginPath();
				ctx.arc(v.x - v.w / 2 + 8, y + v.h, 5, 0, Math.PI * 2);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(v.x + v.w / 2 - 8, y + v.h, 5, 0, Math.PI * 2);
				ctx.fill();
				if (v.type === "ev") {
					ctx.shadowColor = "#7F77DD";
					ctx.shadowBlur = 10;
					ctx.strokeStyle = "rgba(127,119,221,0.4)";
					ctx.lineWidth = 1.5;
					roundRect(v.x - v.w / 2 - 1, y - 1, v.w + 2, v.h + 2, 5);
					ctx.stroke();
					ctx.shadowBlur = 0;
				}
			}
			ctx.restore();
		}
		function addExhaust(v, groundY) {
			if (v.type === "bike" || v.type === "person" || v.type === "ev") return;
			v.exhaustTimer++;
			const interval = v.type === "bus" ? 4 : v.type === "truck" ? 3 : 6;
			if (v.exhaustTimer % interval !== 0) return;
			const intensity = stateRef.current.mode === "car" ? 1 : stateRef.current.mode === "bus" ? .5 : .2;
			const num = v.type === "truck" ? 3 : v.type === "bus" ? 2 : 1;
			for (let n = 0; n < num; n++) dataRef.current.particles.push({
				x: v.x - v.w * .4 + (Math.random() - .5) * 4,
				y: groundY - v.h * .5 - Math.random() * 4,
				vx: -.3 + (Math.random() - .5) * .4,
				vy: -(.3 + Math.random() * .5),
				r: 4 + Math.random() * 6,
				alpha: .5 * intensity,
				life: 1,
				decay: .008 + Math.random() * .006,
				type: v.type
			});
		}
		function draw() {
			const { smogAlpha: sa, targetSmog, fogColor } = stateRef.current;
			stateRef.current.smogAlpha += (targetSmog - sa) * .025;
			const smog = stateRef.current.smogAlpha;
			const W = canvas.width, H = canvas.height;
			ctx.clearRect(0, 0, W, H);
			const sR = Math.round(10 + 90 * smog), sG = Math.round(14 + 66 * smog), sB = Math.round(26 + 24 * smog);
			const sky = ctx.createLinearGradient(0, 0, 0, H * .65);
			sky.addColorStop(0, `rgb(${sR},${sG},${sB})`);
			sky.addColorStop(1, `rgb(${Math.round(sR * 1.4)},${Math.round(sG * 1.3)},${Math.round(sB * 1.2)})`);
			ctx.fillStyle = sky;
			ctx.fillRect(0, 0, W, H);
			dataRef.current.stars.forEach((s) => {
				ctx.globalAlpha = s.alpha * (1 - smog * .9);
				ctx.fillStyle = "#fff";
				ctx.beginPath();
				ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
				ctx.fill();
			});
			ctx.globalAlpha = 1;
			dataRef.current.smogClouds.forEach((c) => {
				c.x += c.speed;
				if (c.x > 850) c.x = -80;
				const g2 = ctx.createRadialGradient(c.x / 800 * W, c.y / 300 * H, 0, c.x / 800 * W, c.y / 300 * H, c.r / 800 * W * 2);
				g2.addColorStop(0, `rgba(${fogColor},${(c.alpha * smog).toFixed(2)})`);
				g2.addColorStop(1, `rgba(${fogColor},0)`);
				ctx.fillStyle = g2;
				ctx.beginPath();
				ctx.ellipse(c.x / 800 * W, c.y / 300 * H, c.r / 800 * W * 3, c.r / 300 * H * .9, 0, 0, Math.PI * 2);
				ctx.fill();
			});
			ctx.globalAlpha = Math.max(.1, 1 - smog * .8);
			ctx.fillStyle = "#ffeebb";
			ctx.beginPath();
			ctx.arc(W * .82, H * .12, 14, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = `rgb(${sR},${sG},${sB})`;
			ctx.beginPath();
			ctx.arc(W * .82 + 5, H * .12, 12, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1;
			const groundY = H * .72;
			drawBuildings(groundY);
			const rg = ctx.createLinearGradient(0, groundY, 0, H);
			rg.addColorStop(0, "#1a1f2e");
			rg.addColorStop(1, "#0d1018");
			ctx.fillStyle = rg;
			ctx.fillRect(0, groundY, W, H - groundY);
			ctx.strokeStyle = "rgba(255,255,255,0.15)";
			ctx.lineWidth = 1.5;
			ctx.setLineDash([20, 18]);
			ctx.beginPath();
			ctx.moveTo(0, groundY + 18);
			ctx.lineTo(W, groundY + 18);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.fillStyle = "rgba(255,255,255,0.08)";
			ctx.fillRect(0, groundY, W, 2);
			for (let i = dataRef.current.particles.length - 1; i >= 0; i--) {
				const p = dataRef.current.particles[i];
				p.x += p.vx;
				p.y += p.vy;
				p.r += .12;
				p.life -= p.decay;
				p.alpha = p.life * .35;
				if (p.life <= 0) {
					dataRef.current.particles.splice(i, 1);
					continue;
				}
				ctx.globalAlpha = Math.max(0, p.alpha);
				ctx.fillStyle = p.type === "truck" ? "rgb(50,40,30)" : p.type === "bus" ? "rgb(80,90,110)" : "rgb(100,90,70)";
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
				ctx.globalAlpha = 1;
			}
			dataRef.current.vehicles.forEach((v) => {
				v.x += v.speed * (W / 800);
				if (v.x > W + v.w) v.x = -v.w;
				addExhaust(v, groundY);
				drawVehicle(v, groundY);
			});
			if (smog > .05) {
				const fg = ctx.createLinearGradient(0, groundY + 5, 0, H);
				fg.addColorStop(0, `rgba(${fogColor},0)`);
				fg.addColorStop(.3, `rgba(${fogColor},${(smog * .4).toFixed(2)})`);
				fg.addColorStop(1, `rgba(${fogColor},${(smog * .6).toFixed(2)})`);
				ctx.fillStyle = fg;
				ctx.fillRect(0, groundY, W, H - groundY);
			}
			const hz = ctx.createLinearGradient(0, 0, 0, groundY);
			hz.addColorStop(0, `rgba(${fogColor},0)`);
			hz.addColorStop(1, `rgba(${fogColor},${(smog * .55).toFixed(2)})`);
			ctx.fillStyle = hz;
			ctx.fillRect(0, 0, W, groundY);
			[
				.1,
				.28,
				.46,
				.64,
				.82
			].forEach((fx) => {
				const lx = fx * W;
				ctx.strokeStyle = "rgba(255,255,255,0.4)";
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.moveTo(lx, groundY);
				ctx.lineTo(lx, groundY - 50);
				ctx.lineTo(lx + 10, groundY - 50);
				ctx.stroke();
				const lg = ctx.createRadialGradient(lx + 10, groundY - 50, 0, lx + 10, groundY - 50, 40);
				lg.addColorStop(0, "rgba(255,220,100,0.5)");
				lg.addColorStop(1, "rgba(255,220,100,0)");
				ctx.fillStyle = lg;
				ctx.beginPath();
				ctx.arc(lx + 10, groundY - 50, 40, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = "rgba(255,240,180,0.9)";
				ctx.beginPath();
				ctx.arc(lx + 10, groundY - 50, 3, 0, Math.PI * 2);
				ctx.fill();
			});
			rafRef.current = requestAnimationFrame(draw);
		}
		rafRef.current = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(rafRef.current);
			window.removeEventListener("resize", resize);
		};
	}, []);
	const cfg = MODES[mode];
	const aqiColor = AQI_COLORS[mode];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full h-72 md:h-96 rounded-2xl overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 w-full h-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-2 h-2 rounded-full animate-pulse",
						style: {
							background: aqiColor,
							boxShadow: `0 0 6px ${aqiColor}`
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-white/50",
						children: "AQI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						style: { color: aqiColor },
						children: liveAqi ?? cfg.aqi
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-px h-3 bg-white/15" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-white/50",
						children: "CO₂ today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-white font-medium",
						children: cfg.co2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-px h-3 bg-white/15" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-white/50",
						children: "Visibility"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-white font-medium",
						children: cfg.visibility
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 mb-2",
					children: Object.keys(MODES).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onModeChange(m),
						className: `flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${mode === m ? m === "car" ? "bg-red-500/20 border-red-400 text-red-300" : m === "bus" ? "bg-blue-500/20 border-blue-400 text-blue-300" : m === "ev" ? "bg-violet-500/20 border-violet-400 text-violet-300" : "bg-green-500/20 border-green-400 text-green-300" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base",
							children: MODES[m].icon
						}), MODES[m].label]
					}, m))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						{
							val: cfg.emission,
							lbl: "CO₂/trip"
						},
						{
							val: `${cfg.aqiImpact} AQI`,
							lbl: "Your impact"
						},
						{
							val: cfg.saved,
							lbl: "Saved vs car"
						},
						{
							val: `${cfg.trees} trees`,
							lbl: "To offset"
						}
					].map(({ val, lbl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-white font-medium text-sm",
							children: val
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-white/40 text-[10px] mt-0.5",
							children: lbl
						})]
					}, lbl))
				})]
			})
		]
	});
}
function getInsights({ totalTons = 0, streak = 0, topCategory = "Transport", actionsCompleted = 0, totalActions = 6, weeklySavedKg = 0 }) {
	const list = [];
	if (totalTons === 0) {
		list.push({
			id: "no-data",
			icon: Leaf,
			iconColor: "text-primary",
			iconBg: "bg-primary-soft",
			headline: "Calculate your footprint to get started!",
			body: "Answer 4 quick questions to see your personal CO2 breakdown and get actionable tips.",
			cta: "Calculate now",
			ctaTo: "/calculator"
		});
		return list;
	}
	if (totalTons > 7) list.push({
		id: "footprint-high",
		icon: TrendingDown,
		iconColor: "text-rose-400",
		iconBg: "bg-secondary",
		headline: `Your ${topCategory} emissions are your biggest opportunity`,
		body: `At ${totalTons.toFixed(1)}t/year you're above the 7t target. Small ${topCategory.toLowerCase()} changes can make a big dent.`,
		cta: "See actions",
		ctaTo: "/actions"
	});
	else list.push({
		id: "footprint-good",
		icon: Leaf,
		iconColor: "text-primary",
		iconBg: "bg-primary-soft",
		headline: "You're tracking below the climate target!",
		body: `${totalTons.toFixed(1)}t/year is under the 7t target. Keep your habits up!`,
		cta: "Build habits",
		ctaTo: "/habits"
	});
	if (streak >= 3) list.push({
		id: "streak",
		icon: Flame,
		iconColor: "text-amber-400",
		iconBg: "bg-secondary",
		headline: `${streak}-day streak - you're on fire!`,
		body: "Consistent daily habits are the most powerful way to shrink your footprint long-term."
	});
	else list.push({
		id: "start-streak",
		icon: Flame,
		iconColor: "text-amber-400",
		iconBg: "bg-secondary",
		headline: "Start a habit streak today",
		body: "Log just one eco habit today - bike, recycle, or skip meat. Streaks build momentum.",
		cta: "Go to Habits",
		ctaTo: "/habits"
	});
	if (actionsCompleted < totalActions) list.push({
		id: "actions",
		icon: Leaf,
		iconColor: "text-primary",
		iconBg: "bg-primary-soft",
		headline: `${totalActions - actionsCompleted} high-impact actions left`,
		body: `You've completed ${actionsCompleted} of ${totalActions} recommended eco actions.`,
		cta: "View actions",
		ctaTo: "/actions"
	});
	if (weeklySavedKg > 0) list.push({
		id: "weekly-saved",
		icon: TrendingDown,
		iconColor: "text-primary",
		iconBg: "bg-primary-soft",
		headline: `You saved ${weeklySavedKg.toFixed(1)} kg CO2 this week!`,
		body: "Small daily choices, big annual impact."
	});
	return list;
}
function InsightBanner(props) {
	const insights = getInsights(props);
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [dismissed, setDismissed] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [animating, setAnimating] = (0, import_react.useState)(false);
	const visible = insights.filter((i) => !dismissed.has(i.id));
	if (visible.length === 0) return null;
	const idx = current % visible.length;
	const insight = visible[idx];
	function goNext() {
		setAnimating(true);
		setTimeout(() => {
			setCurrent((c) => (c + 1) % visible.length);
			setAnimating(false);
		}, 200);
	}
	function dismiss() {
		setDismissed((d) => new Set([...d, insight.id]));
		setCurrent((c) => Math.max(0, c - 1));
	}
	const IconComp = insight.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `ls-card relative flex items-start gap-4 p-4 pb-6 transition-all duration-300 ${animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${insight.iconBg}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComp, { className: `h-5 w-5 ${insight.iconColor}` })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-sm leading-snug text-foreground",
						children: insight.headline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground leading-relaxed",
						children: insight.body
					}),
					insight.cta && insight.ctaTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: insight.ctaTo,
						className: "mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline",
						children: [insight.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: dismiss,
					className: "grid h-6 w-6 place-items-center rounded-lg text-muted-foreground hover:bg-secondary",
					"aria-label": "Dismiss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
				}), visible.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: goNext,
					className: "grid h-6 w-6 place-items-center rounded-lg text-muted-foreground hover:bg-secondary",
					"aria-label": "Next",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
				})]
			}),
			visible.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1",
				children: visible.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCurrent(i),
					className: `h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-4 bg-primary" : "w-1.5 bg-border"}`
				}, i))
			})
		]
	});
}
var CATEGORIES_META = [
	{
		key: "transport",
		label: "Transport",
		color: "#ef4444",
		max: 5
	},
	{
		key: "diet",
		label: "Diet",
		color: "#f59e0b",
		max: 5
	},
	{
		key: "energy",
		label: "Home Energy",
		color: "#3b82f6",
		max: 5
	},
	{
		key: "shopping",
		label: "Shopping",
		color: "#a855f7",
		max: 5
	}
];
var GOAL_TONNES = 7;
var EMPTY_FEATURES = [
	{
		icon: "📊",
		title: "Track your footprint",
		desc: "See exactly where your CO₂ comes from."
	},
	{
		icon: "⚡",
		title: "Get personal actions",
		desc: "Recommendations based on YOUR lifestyle."
	},
	{
		icon: "📅",
		title: "Build green habits",
		desc: "Log habits and watch your footprint shrink."
	},
	{
		icon: "👥",
		title: "Community challenges",
		desc: "Join thousands of Indians going green."
	}
];
function buildTrend(total) {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun"
	];
	if (total === 0) return months.map((month) => ({
		month,
		co2: 0
	}));
	return months.map((month, i) => ({
		month,
		co2: +(total + (months.length - 1 - i) * .45).toFixed(1)
	}));
}
function weekDates() {
	const now = /* @__PURE__ */ new Date();
	const dow = (now.getDay() + 6) % 7;
	const monday = new Date(now);
	monday.setDate(now.getDate() - dow);
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return d.toISOString().slice(0, 10);
	});
}
function computeStreak(dates, logged) {
	const todayIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const todayIdx = dates.indexOf(todayIso);
	const habitKeys = [
		"bike",
		"recycle",
		"meatfree",
		"unplug",
		"reusable"
	];
	let streak = 0;
	for (let i = todayIdx === -1 ? 6 : todayIdx; i >= 0; i--) if (habitKeys.some((k) => logged.has(`${k}|${dates[i]}`))) streak++;
	else break;
	return streak;
}
function useCountUp(target, duration = 900) {
	const [val, setVal] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let start = null;
		function step(ts) {
			if (!start) start = ts;
			const progress = Math.min((ts - start) / duration, 1);
			setVal(target * (1 - Math.pow(1 - progress, 3)));
			if (progress < 1) requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}, [target, duration]);
	return val;
}
function ScoreRing({ score }) {
	const r = 70;
	const c = 2 * Math.PI * r;
	const offset = c - score / 100 * c;
	const animatedScore = useCountUp(score);
	const color = score >= 70 ? "var(--color-primary)" : score >= 40 ? "#f59e0b" : "#ef4444";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-44 w-44",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 180 180",
			className: "h-full w-full -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "90",
				cy: "90",
				r,
				fill: "none",
				stroke: "var(--color-secondary)",
				strokeWidth: "14"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "90",
				cy: "90",
				r,
				fill: "none",
				stroke: color,
				strokeWidth: "14",
				strokeLinecap: "round",
				strokeDasharray: c,
				strokeDashoffset: offset,
				style: { transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1), stroke 0.5s ease" }
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-4xl font-extrabold",
					style: { color },
					children: Math.round(animatedScore)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold text-muted-foreground",
					children: "/ 100"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
					children: "Eco Score"
				})
			]
		})]
	});
}
function GoalProgress({ current, start, goal }) {
	const pct = Math.max(0, Math.min(100, (start - current) / (start - goal) * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-auto flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-3 w-full overflow-hidden rounded-full bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-primary progress-fill",
				style: { width: `${pct}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-semibold text-primary",
				children: [Math.round(pct), "% to goal"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				current.toFixed(1),
				"t / ",
				goal.toFixed(1),
				"t"
			] })]
		})]
	});
}
function StatBadge({ label, value, icon: Icon, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 animate-slide-up",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
			style: {
				background: `${color}20`,
				color
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-extrabold",
			children: value
		})] })]
	});
}
function EmptyState({ onGetStarted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 animate-slide-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ls-card relative overflow-hidden p-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-10",
						style: { background: "radial-gradient(circle, #1d9e75, transparent 70%)" }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary/20 border border-primary/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-8 w-8 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-extrabold tracking-tight lg:text-3xl",
							children: "Welcome to Leafstep 🌱"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed",
							children: "Your personal carbon footprint tracker. Find out how much CO₂ you produce and get a step-by-step plan to reduce it."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onGetStarted,
							className: "btn-glow mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg hover:scale-105 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-5 w-5" }), "Calculate My Carbon Footprint"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "Takes 2 minutes • Free forever"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					{
						val: "10t",
						lbl: "Global avg CO₂/person"
					},
					{
						val: "1.9t",
						lbl: "India avg CO₂/person"
					},
					{
						val: "0.5t",
						lbl: "Climate target 2050"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ls-card p-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-extrabold text-primary",
						children: s.val
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground mt-1 leading-snug",
						children: s.lbl
					})]
				}, s.lbl))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ls-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4",
					children: "What you'll get"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: EMPTY_FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl flex-shrink-0",
							children: f.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: f.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-0.5 leading-relaxed",
							children: f.desc
						})] })]
					}, f.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ls-card p-5 flex flex-col sm:flex-row items-center gap-4 justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-bold text-sm",
					children: "Ready to see your footprint?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Join thousands of Indians tracking their impact 🇮🇳"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onGetStarted,
					className: "btn-glow flex-shrink-0 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground",
					children: ["Get Started ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})]
			})
		]
	});
}
function Dashboard() {
	const { user } = useAuth();
	const [mode, setMode] = (0, import_react.useState)("car");
	const [showCalc, setShowCalc] = (0, import_react.useState)(false);
	const [footprint, setFootprint] = (0, import_react.useState)(() => user ? getStoredFootprint(user.id) ?? DEFAULT_FOOTPRINT : DEFAULT_FOOTPRINT);
	(0, import_react.useEffect)(() => {
		if (user) setFootprint(getStoredFootprint(user.id) ?? DEFAULT_FOOTPRINT);
	}, [user?.id]);
	const hasData = footprint.total > 0;
	const { data: completedActions = [] } = useQuery({
		queryKey: ["actions_completed", user?.id],
		enabled: !!user,
		queryFn: async () => {
			if (!user) return [];
			if (isDemoMode()) return getStoredActions(user.id);
			try {
				const { data, error } = await supabase.from("actions_completed").select("action_key").eq("user_id", user.id);
				if (error) throw error;
				return data.map((r) => r.action_key);
			} catch {
				return getStoredActions(user.id);
			}
		}
	});
	const dates = weekDates();
	const { data: habitLogs = [] } = useQuery({
		queryKey: [
			"habits",
			user?.id,
			dates[0]
		],
		enabled: !!user,
		queryFn: async () => {
			if (!user) return [];
			if (isDemoMode()) return getStoredHabits(user.id);
			try {
				const { data, error } = await supabase.from("habits").select("habit_key, day").eq("user_id", user.id).gte("day", dates[0]).lte("day", dates[6]);
				if (error) throw error;
				return data;
			} catch {
				return getStoredHabits(user.id);
			}
		}
	});
	const streak = computeStreak(dates, new Set(habitLogs.map((l) => `${l.habit_key}|${l.day}`)));
	const weeklySavedKg = habitLogs.length * 120;
	const categories = (0, import_react.useMemo)(() => CATEGORIES_META.map((c) => ({
		...c,
		value: footprint[c.key]
	})), [footprint]);
	const total = footprint.total;
	const score = total > 0 ? Math.round(Math.max(0, Math.min(100, (1 - total / 16) * 100))) : 0;
	const topCat = categories.reduce((a, b) => a.value > b.value ? a : b).label;
	const trend = (0, import_react.useMemo)(() => buildTrend(total), [total]);
	const trendChange = total > 0 ? Math.round((trend[0].co2 - trend[trend.length - 1].co2) / trend[0].co2 * 100) : 0;
	function handleCalcComplete(result) {
		if (!user) return;
		setStoredFootprint(user.id, result);
		setFootprint({
			...result,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setShowCalc(false);
		toast.success("Footprint saved to your dashboard! 🌱");
	}
	if (!hasData && !showCalc) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { onGetStarted: () => setShowCalc(true) });
	if (showCalc) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between animate-slide-up",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold tracking-tight",
				children: "Carbon Calculator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-0.5",
				children: "Tell us about your lifestyle"
			})] }), hasData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setShowCalc(false),
				className: "rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors",
				children: "← Back to Dashboard"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarbonCalculator, {
			onClose: hasData ? () => setShowCalc(false) : void 0,
			onComplete: handleCalcComplete
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-slide-up",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-extrabold tracking-tight lg:text-3xl",
						children: "Your Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: "Pick how you commute and watch the city breathe."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowCalc(true),
						className: "btn-glow hidden sm:flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-4 w-4" }), "Recalculate"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative animate-slide-up stagger-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightBanner, {
					totalTons: total,
					topCategory: topCat,
					actionsCompleted: completedActions.length,
					totalActions: 6,
					streak,
					weeklySavedKg
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowCalc(true),
				className: "btn-glow flex sm:hidden items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground animate-slide-up stagger-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-4 w-4" }), "Recalculate My Footprint"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "animate-slide-up stagger-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedCityHero, {
					mode,
					onModeChange: setMode
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4 animate-slide-up stagger-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBadge, {
						label: "Total CO₂ / year",
						value: `${total.toFixed(1)}t`,
						icon: Target,
						color: "#1d9e75"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBadge, {
						label: "vs Last Month",
						value: `-${trendChange}% 📉`,
						icon: TrendingDown,
						color: "#3b82f6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBadge, {
						label: "Eco Score",
						value: `${score} / 100`,
						icon: Award,
						color: "#a855f7"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBadge, {
						label: "Top Emitter",
						value: topCat,
						icon: Sparkles,
						color: "#f59e0b"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3 animate-slide-up stagger-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "ls-card flex flex-col items-center justify-center gap-3 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "self-start text-sm font-bold text-muted-foreground",
							children: "CO₂ Score"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { score }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-sm text-muted-foreground",
							children: [
								"Est. ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-foreground",
									children: [total.toFixed(1), "t"]
								}),
								" CO₂ / year"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/actions",
							className: "btn-glow w-full rounded-xl bg-primary-soft py-2 text-center text-xs font-bold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground",
							children: "See recommended actions →"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "ls-card flex flex-col gap-4 p-6 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold text-muted-foreground",
							children: "Category Breakdown"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-4",
							children: categories.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "animate-slide-up",
								style: { animationDelay: `${.35 + i * .07}s` },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1.5 flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-block h-2.5 w-2.5 rounded-full",
											style: { backgroundColor: c.color }
										}), c.label]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [c.value.toFixed(1), "t"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2.5 w-full overflow-hidden rounded-full bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full progress-fill",
										style: {
											width: `${c.value / c.max * 100}%`,
											backgroundColor: c.color,
											animationDelay: `${.4 + i * .1}s`
										}
									})
								})]
							}, c.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground border-t border-border pt-3",
							children: [
								"💡 ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tip:" }),
								" Your ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: topCat }),
								" emissions are highest. Explore targeted actions to reduce them."
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3 animate-slide-up stagger-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "ls-card flex flex-col gap-4 p-6 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold text-muted-foreground",
							children: "6-Month Trend"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Monthly footprint"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-accent-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }),
								"↓ ",
								trendChange,
								"% improvement"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: trend,
								margin: {
									top: 8,
									right: 8,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "co2Gradient",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "var(--color-primary)",
											stopOpacity: .25
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "var(--color-primary)",
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--color-border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										tickLine: false,
										axisLine: false,
										tick: {
											fontSize: 12,
											fill: "var(--color-muted-foreground)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tickLine: false,
										axisLine: false,
										tick: {
											fontSize: 12,
											fill: "var(--color-muted-foreground)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											borderRadius: 12,
											border: "1px solid var(--color-border)",
											fontSize: 13
										},
										formatter: (v) => [`${v}t CO₂`, "Footprint"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "co2",
										stroke: "var(--color-primary)",
										strokeWidth: 3,
										fill: "url(#co2Gradient)",
										dot: {
											r: 4,
											fill: "var(--color-primary)",
											strokeWidth: 0
										},
										activeDot: {
											r: 6,
											fill: "var(--color-primary)"
										}
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "ls-card flex flex-col gap-4 p-6 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-bold text-muted-foreground",
									children: "2026 Goal"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Cut your annual footprint to ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-foreground",
									children: [GOAL_TONNES.toFixed(1), "t"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalProgress, {
								current: total,
								start: trend[0].co2,
								goal: GOAL_TONNES
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-auto rounded-xl bg-primary-soft p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold text-accent-foreground",
									children: [
										"🌱 At your current pace, you'll hit your goal by ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "September 2026" }),
										". You're ",
										trendChange,
										"% of the way there!"
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/habits",
								className: "btn-glow rounded-xl border border-primary py-2.5 text-center text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground mt-4",
								children: "Build daily habits →"
							})
						]
					})
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
