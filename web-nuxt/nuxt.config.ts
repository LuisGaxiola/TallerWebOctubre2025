import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxtjs/seo",
    "nuxt-typed-router",
    "@vueuse/nuxt",
  ],
  icon: {
    serverBundle: {
      collections: ["uil", "mdi", "lucide"],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
});
