import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-BqtwNJfn.js
function createSupabaseClient() {
	const SUPABASE_URL = "https://tmrxavzvwlaugbjbythg.supabase.co".replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
	const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtcnhhdnp2d2xhdWdiamJ5dGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NTM4ODIsImV4cCI6MjA5NzAyOTg4Mn0.k4Tc5BnlR32Lt7bsPjEZjxQyt4gAf9uGeQbk7EhZbp0";
	if (!SUPABASE_URL || false) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...[]].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
