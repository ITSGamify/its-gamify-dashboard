import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import viLogin from "./locales/vi/login.json";
import viSidebar from "./locales/vi/sideBar.json";

export type TRANSLATION_NAME_SPACES_TYPE = keyof typeof resources.vi;

export const TRANSLATION_NAME_SPACES: Record<
  string,
  TRANSLATION_NAME_SPACES_TYPE
> = {
  LOGIN: "login",
  SIDEBAR: "sideBar",
};

// Define resources
const resources = {
  vi: {
    login: viLogin,
    sideBar: viSidebar,
  },
};

// Define supported languages
export const supportedLanguages = ["vi"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

// Language names for display
export const languageNames: Record<SupportedLanguage, string> = {
  vi: "Tiếng Việt",
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",

    // Language detection options
    // detection: {
    //   order: ["localStorage", "navigator", "htmlTag"],
    //   caches: ["localStorage"],
    //   lookupLocalStorage: "i18nextLng",
    // },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Development options
    debug: false,

    // Keyseparator
    keySeparator: ".",
    nsSeparator: ":",
  });

export default i18n;
