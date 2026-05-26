/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Translations provided by Vuetify
import { es,en } from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

//Enable md icons
// import { md } from 'vuetify/iconsets/md'

// Composables
import { createVuetify } from 'vuetify'
import dark from './themes/DarkTheme'
import light from './themes/LightTheme'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      //Enable md icons
      // md,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light,dark
    },
  },
  locale: {
    locale: 'es',
    fallback: 'en',
    messages: { es, en },
  },
})
