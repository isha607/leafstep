import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { A as Car, D as ChevronLeft, E as ChevronRight, b as Leaf, f as ShoppingCart, m as RotateCcw, r as Utensils, t as Zap } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CarbonCalculator-BS3Yp4qA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT = {
	carKmPerWeek: 100,
	flightsPerYear: 2,
	meatMealsPerWeek: 5,
	electricityKwhPerMonth: 200,
	gasUseLevel: 1,
	newItemsPerMonth: 3
};
function calcFootprint(d) {
	const transport = d.carKmPerWeek * 52 * .21 / 1e3 + d.flightsPerYear * .255;
	const diet = (d.meatMealsPerWeek * 2.5 + (14 - d.meatMealsPerWeek) * .5) * 52 / 1e3;
	const energy = d.electricityKwhPerMonth * .716 * 12 / 1e3;
	const shopping = d.newItemsPerMonth * 12 * .06;
	return {
		transport: +transport.toFixed(2),
		diet: +diet.toFixed(2),
		energy: +energy.toFixed(2),
		shopping: +shopping.toFixed(2),
		total: +(transport + diet + energy + shopping).toFixed(2)
	};
}
var STEPS = [
	{
		icon: Car,
		label: "Transport",
		color: "text-rose-500",
		bg: "bg-rose-50 dark:bg-rose-950/20",
		border: "border-rose-200 dark:border-rose-900/30"
	},
	{
		icon: Utensils,
		label: "Diet",
		color: "text-amber-500",
		bg: "bg-amber-50 dark:bg-amber-950/20",
		border: "border-amber-200 dark:border-amber-900/30"
	},
	{
		icon: Zap,
		label: "Home Energy",
		color: "text-blue-500",
		bg: "bg-blue-50 dark:bg-blue-950/20",
		border: "border-blue-200 dark:border-blue-900/30"
	},
	{
		icon: ShoppingCart,
		label: "Shopping",
		color: "text-purple-500",
		bg: "bg-purple-50 dark:bg-purple-950/20",
		border: "border-purple-200 dark:border-purple-900/30"
	}
];
var GAS_LABELS = [
	"None / Electric",
	"Low",
	"Medium",
	"High"
];
function Slider({ label, value, min, max, step = 1, unit, onChange, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-lg bg-primary-soft px-2.5 py-0.5 text-sm font-bold text-accent-foreground",
					children: [
						value,
						" ",
						unit
					]
				})]
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min,
				max,
				step,
				value,
				onChange: (e) => onChange(Number(e.target.value)),
				className: "h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between text-[10px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					min,
					" ",
					unit
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					max,
					" ",
					unit
				] })]
			})
		]
	});
}
function ResultsView({ data, onReset }) {
	const fp = calcFootprint(data);
	const worldAvg = 4.7;
	const indiaAvg = 1.9;
	const percentage = Math.round(fp.total / worldAvg * 100);
	const bars = [
		{
			label: "Transport",
			value: fp.transport,
			color: "#ef4444",
			max: 6
		},
		{
			label: "Diet",
			value: fp.diet,
			color: "#f59e0b",
			max: 4
		},
		{
			label: "Home Energy",
			value: fp.energy,
			color: "#3b82f6",
			max: 4
		},
		{
			label: "Shopping",
			value: fp.shopping,
			color: "#a855f7",
			max: 3
		}
	];
	const tips = [];
	if (fp.transport > 2) tips.push("🚌 Try public transit or carpooling twice a week to cut transport emissions.");
	if (fp.diet > 1.5) tips.push("🥗 Swapping 3 meat meals/week for plant-based saves ~0.5t CO₂ annually.");
	if (fp.energy > 1) tips.push("💡 Switch to a renewable energy provider to slash home energy emissions.");
	if (fp.shopping > .5) tips.push("♻️ Buy secondhand first — extends product life and skips new manufacturing.");
	if (tips.length === 0) tips.push("🌱 Great job! You're already below average. Share your habits to inspire others.");
	const scoreColor = fp.total < 2 ? "#1d9e75" : fp.total < 4 ? "#f59e0b" : fp.total < 7 ? "#ef4444" : "#7f1d1d";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-1 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-5xl font-extrabold tracking-tight",
						style: { color: scoreColor },
						children: [fp.total, "t"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-muted-foreground",
						children: "CO₂ per year"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["World avg: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
								className: "text-foreground",
								children: [worldAvg, "t"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["India avg: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
								className: "text-foreground",
								children: [indiaAvg, "t"]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 rounded-full px-3 py-1 text-xs font-bold text-white",
						style: { backgroundColor: scoreColor },
						children: percentage < 100 ? `${100 - percentage}% below world average 🎉` : `${percentage - 100}% above world average`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: bars.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: b.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [b.value, "t"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2.5 w-full overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full progress-fill",
						style: {
							width: `${Math.min(100, b.value / b.max * 100)}%`,
							backgroundColor: b.color
						}
					})
				})] }, b.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-primary/20 bg-primary-soft p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-bold uppercase tracking-wider text-accent-foreground",
					children: "Your top actions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: tips.slice(0, 3).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-foreground animate-slide-up",
						style: { animationDelay: `${i * .08}s` },
						children: t
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onReset,
				className: "flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Recalculate"]
			})
		]
	});
}
function CarbonCalculator({ onClose, onComplete }) {
	const [step, setStep] = (0, import_react.useState)(0);
	const [data, setData] = (0, import_react.useState)(DEFAULT);
	const [done, setDone] = (0, import_react.useState)(false);
	function update(key, val) {
		setData((d) => ({
			...d,
			[key]: val
		}));
	}
	function reset() {
		setData(DEFAULT);
		setStep(0);
		setDone(false);
	}
	const isLast = step === 3;
	const StepIcon = STEPS[step]?.icon ?? Leaf;
	const stepInfo = STEPS[step];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ls-card flex flex-col gap-5 p-6 animate-slide-up",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-extrabold leading-tight",
					children: "Carbon Calculator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Estimate your annual footprint"
				})] })]
			}), onClose && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "grid h-8 w-8 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary",
				children: "✕"
			})]
		}), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsView, {
			data,
			onReset: reset
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5",
				children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-secondary"}` }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-3 rounded-xl border p-3 ${stepInfo.bg} ${stepInfo.border}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `grid h-9 w-9 place-items-center rounded-lg bg-white dark:bg-slate-900 ${stepInfo.color}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIcon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-sm",
					children: stepInfo.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Step ",
						step + 1,
						" of 4"
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5 animate-fade-in",
				children: [
					step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Car distance",
						value: data.carKmPerWeek,
						min: 0,
						max: 500,
						step: 10,
						unit: "km/week",
						onChange: (v) => update("carKmPerWeek", v),
						description: "Average weekly driving distance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Flights per year",
						value: data.flightsPerYear,
						min: 0,
						max: 20,
						unit: "flights",
						onChange: (v) => update("flightsPerYear", v),
						description: "Short-haul domestic flights (avg 1000 km)"
					})] }),
					step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Meat meals per week",
						value: data.meatMealsPerWeek,
						min: 0,
						max: 21,
						unit: "meals",
						onChange: (v) => update("meatMealsPerWeek", v),
						description: "Beef/lamb meals have ~7× the emissions of plant-based"
					}),
					step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Electricity usage",
						value: data.electricityKwhPerMonth,
						min: 0,
						max: 800,
						step: 10,
						unit: "kWh/mo",
						onChange: (v) => update("electricityKwhPerMonth", v),
						description: "Check your electricity bill for monthly kWh"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "Gas / LPG usage"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 gap-2",
							children: GAS_LABELS.map((lbl, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => update("gasUseLevel", i),
								className: `rounded-xl border py-2 text-xs font-semibold transition-all ${data.gasUseLevel === i ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary text-muted-foreground hover:border-primary/50"}`,
								children: lbl
							}, i))
						})]
					})] }),
					step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "New items bought",
						value: data.newItemsPerMonth,
						min: 0,
						max: 30,
						unit: "items/mo",
						onChange: (v) => update("newItemsPerMonth", v),
						description: "Clothes, electronics, appliances, etc."
					})
				]
			}, step),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [step > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setStep((s) => s - 1),
					className: "flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), "Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						if (isLast) {
							const fp = calcFootprint(data);
							onComplete?.(fp);
							setDone(true);
						} else setStep((s) => s + 1);
					},
					className: "btn-glow flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground",
					children: [isLast ? "Calculate my footprint" : "Next", !isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				})]
			})
		] })]
	});
}
//#endregion
export { CarbonCalculator as t };
