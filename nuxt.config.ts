// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  srcDir: 'app',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-mongoose',
    'nuxt-auth-utils'
  ],
  runtimeConfig: {
    session: {
      password: 'password-must-be-at-least-32-characters-long-so-here-is-a-long-string'
    }
  },
  postcss: {
    uri: process.env.MONGODB_URI,
    options: {},
    modelsDir: 'models',
    // devtools: true,
  },
})