import { u as setStoredFootprint } from "./demo-user-BPNeXgaL.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useAuth } from "./use-auth-CLea-AkB.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as CarbonCalculator } from "./CarbonCalculator-BS3Yp4qA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calculator-DIeCFYus.js
var import_jsx_runtime = require_jsx_runtime();
function CalculatorPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	function handleComplete(result) {
		if (!user) return;
		setStoredFootprint(user.id, result);
		toast.success("Footprint calculated! Taking you to your dashboard 🌱");
		setTimeout(() => navigate({
			to: "/dashboard",
			replace: true
		}), 800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 max-w-2xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-slide-up",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold tracking-tight lg:text-3xl",
					children: "Carbon Calculator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: "Answer 4 quick questions to see your personal footprint"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-3 animate-slide-up",
				children: [
					{
						val: "10t",
						lbl: "Global avg/person"
					},
					{
						val: "1.9t",
						lbl: "India avg/person"
					},
					{
						val: "0.5t",
						lbl: "2050 target"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ls-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-extrabold text-primary",
						children: s.val
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground mt-0.5",
						children: s.lbl
					})]
				}, s.lbl))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarbonCalculator, { onComplete: handleComplete })
		]
	});
}
//#endregion
export { CalculatorPage as component };
