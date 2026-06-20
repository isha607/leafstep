import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    moduleSideEffects: ["tslib"],
  },
  vite: {
    ssr: {
      noExternal: ["tslib", "@supabase/functions-js"],
    },
  },
});