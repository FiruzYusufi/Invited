// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

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
      title: 'Онлайн пригласительное на свадьбу',
      meta: [
        { name: 'description', content: 'С любовью приглашаем вас разделить с нами самый важный день в нашей жизни' }
      ],
      htmlAttrs: {
        lang: 'ru'
      }
    }
  }
})
