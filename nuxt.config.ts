// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      title: "MagicCalculator",
    },
  },
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt"],
  css: ["@/assets/main.scss"],
  colorMode: {
    preference: "light", // default value of $colorMode.preference
  },
  ui: {
    icons: ["ph"],
  },
  runtimeConfig: {
    apiKey: process.env.GEMINI_APIKEY,
  },
  // Development modules
  eslint: {
    config: {
      stylistic: {
        quotes: "single",
      },
    },
  },
});
