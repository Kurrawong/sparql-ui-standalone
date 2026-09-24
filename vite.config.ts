import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    // Yasgui's CSS contains old IE-only hacks (e.g. *zoom) that LightningCSS rejects.
    css: { lightningcss: { errorRecovery: true } },
});
