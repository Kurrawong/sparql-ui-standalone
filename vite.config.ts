import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { sparqlProxy } from "./proxy/vite-plugin.js";

export default defineConfig({
	// sparqlProxy only runs under `pnpm dev`.
	plugins: [vue(), tailwindcss(), sparqlProxy()],
	// LightningCSS drops whole rules around the old IE hacks in Yasgui's CSS, which breaks some styling
	build: { cssMinify: false },
});
