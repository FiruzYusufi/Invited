// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  alias: {
    '@invited/database': '../../packages/database/index.ts',
    '@invited/shared': '../../packages/shared/index.ts',
    '@invited/ui': '../../packages/ui/index.ts'
  },
  components: [
    { path: '~/components' },
    { path: '../../packages/ui/components', prefix: 'Ui' }
  ],
  build: {
    transpile: ['@invited/database', '@invited/shared', '@invited/ui']
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@vueuse/nuxt'
  ],

  googleFonts: {
    families: {
      'Cormorant Garamond': [300, 400, 500, 600, 700],
      'Montserrat': [300, 400, 500],
      'Playfair Display': [400, 500, 600]
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Invited - Создайте идеальные приглашения',
      meta: [
        { name: 'description', content: 'Создавайте красивые онлайн приглашения для ваших мероприятий.' }
      ],
      htmlAttrs: {
        lang: 'ru'
      }
    }
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    public: {
      apiBase: '/api'
    }
  }
})
