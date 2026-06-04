// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: '' // filled from NUXT_PUBLIC_API_BASE at runtime
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  devServer: {
    host: '0.0.0.0',
    port: 3001
  },

  imports: {
    dirs: ['stores']
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
