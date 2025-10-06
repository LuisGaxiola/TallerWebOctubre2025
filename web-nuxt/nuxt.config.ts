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
    "@nuxt/icon",
    "nuxt-typed-router",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
  ],
  icon: {
    serverBundle: {
      collections: ["uil", "mdi"],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
});