import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// 1️⃣ Check your app’s preferred language first
const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: preferredLanguage, // 👈 Use your app's stored preference first
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    },
    detection: {
      // 👇 We disable browser language detection entirely
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng' // i18next will still sync its key
    }
  });

// 2️⃣ Keep i18nextLng in sync with your preferredLanguage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('preferredLanguage', lng);
});

export default i18n;
