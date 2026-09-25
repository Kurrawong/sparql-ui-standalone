import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { sparqlProxy } from "./proxy/vite-plugin.js";

export default defineConfig({
	plugins: [vue(), tailwindcss(), sparqlProxy()], // proxy plugin just for dev
	// Yasgui's CSS contains old IE-only hacks (e.g. *zoom) that LightningCSS rejects.
	css: { lightningcss: { errorRecovery: true } },
});
