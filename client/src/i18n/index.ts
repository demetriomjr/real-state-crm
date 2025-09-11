import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBR from './locales/ptBR.json';

const resources = {
  ptBR: {
    translation: ptBR,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ptBR',
    fallbackLng: 'ptBR',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    // Ensure resources are loaded before app starts
    initImmediate: false,
    // React options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transWrapTextNodes: '',
    },
  })
  .then(() => {
    console.log('i18n initialized successfully');
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

// Add error handling for missing resources
i18n.on('missingKey', (lngs, key) => {
  console.warn(`Missing translation key: ${key} for language: ${lngs}`);
});

i18n.on('failedLoading', (msg) => {
  console.error(`Failed loading translations: ${msg}`);
});

export default i18n;
