//#region node_modules/.nitro/vite/services/ssr/assets/demo-user-BPNeXgaL.js
/** Local persistence for demo mode and offline fallback */
var DEMO_USER_ID = "demo-user-leafstep";
var DEMO_FLAG = "leafstep_demo";
function key(suffix, userId) {
	return `leafstep_${suffix}_${userId}`;
}
function isDemoMode() {
	if (typeof window === "undefined") return false;
	return localStorage.getItem(DEMO_FLAG) === "true";
}
function enableDemoMode() {
	localStorage.setItem(DEMO_FLAG, "true");
}
function disableDemoMode() {
	localStorage.removeItem(DEMO_FLAG);
}
function getStoredActions(userId) {
	try {
		const raw = localStorage.getItem(key("actions", userId));
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function setStoredActions(userId, keys) {
	localStorage.setItem(key("actions", userId), JSON.stringify(keys));
}
function getStoredHabits(userId) {
	try {
		const raw = localStorage.getItem(key("habits", userId));
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function setStoredHabits(userId, logs) {
	localStorage.setItem(key("habits", userId), JSON.stringify(logs));
}
function getStoredFootprint(userId) {
	try {
		const raw = localStorage.getItem(key("footprint", userId));
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setStoredFootprint(userId, fp) {
	localStorage.setItem(key("footprint", userId), JSON.stringify({
		...fp,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}));
}
var DEFAULT_FOOTPRINT = {
	transport: 0,
	diet: 0,
	energy: 0,
	shopping: 0,
	total: 0,
	updatedAt: ""
};
var DEMO_USER = {
	id: DEMO_USER_ID,
	email: "demo@leafstep.app",
	app_metadata: {},
	user_metadata: { full_name: "Demo User" },
	aud: "authenticated",
	created_at: (/* @__PURE__ */ new Date()).toISOString()
};
//#endregion
export { getStoredActions as a, isDemoMode as c, setStoredHabits as d, enableDemoMode as i, setStoredActions as l, DEMO_USER as n, getStoredFootprint as o, disableDemoMode as r, getStoredHabits as s, DEFAULT_FOOTPRINT as t, setStoredFootprint as u };
