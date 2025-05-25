// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationEN from './locales/en_translation.json'; // English
import translationIT from './locales/it_translation.json'; // Italian
const resources = {
    en: {
        translation: translationEN,
    },
    it: {
        translation: translationIT,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'it', // Set the default language
    keySeparator: false, // Allow for nested translations without using dots
    interpolation: {
        escapeValue: false,
    },
}); export default i18n;