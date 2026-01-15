import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ptBR from '../locales/pt-BR.json'
import enUS from '../locales/en-US.json'
import es from '../locales/es.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
      es: { translation: es },
    },
    fallbackLng: 'en-US',
    supportedLngs: ['pt-BR', 'en-US', 'es'],

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['LocalStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
