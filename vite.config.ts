import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    plugins: [basicSsl(), sveltekit()],
    server: {
        proxy: {},

        allowedHosts: [
          'plumbing-andrews-montreal-linux.trycloudflare.com',
          '*.trycloudflare.com',
          '*.ngrok-free.app'
        ],
    },
});
