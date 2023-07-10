// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  head: {
    title: 'Saidinhas'
  },
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@kevinmarrec/nuxt-pwa'
  ],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pwa: {
   
    manifest: {
      name: 'Saidinhas',
      short_name: 'Saidinhas',
      description: 'App created to manage how much you spent in the month',
      lang: 'en',
      useWebmanifestExtension: false,
      icon: {
        source: '/icon.png'
      }
    },
    workbox: {
      enabled: process.env.NODE_ENV !== "development"
    }
  },
  runtimeConfig: {
    public: {
      publicUrl: process.env.NODE_ENV === "development" ? 'http://127.0.0.1:8000' : process.env.PUBLIC_BASE_URL,
      baseUrl: process.env.NODE_ENV === "development" ? 'http://127.0.0.1:8000/api' : process.env.API_BASE_URL,
    }
  },
  static: {
    directory: true
  },
})
