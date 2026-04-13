import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {z} from "zod";
import {zodI18nMap} from "zod-i18n-map";
import zodDe from "zod-i18n-map/locales/de/zod.json";
import zodEn from "zod-i18n-map/locales/en/zod.json";
import {DEFAULT_LANGUAGE} from "../../common/config";
import {getCookieSave} from "../customComponents/Cookies";
import de from "./translationResources/de.json";
import en from "./translationResources/en.json";

const detectUserLocale = () => {
  const browserLanguage = navigator.language || navigator.userLanguage || DEFAULT_LANGUAGE;
  const languageCode = browserLanguage.split("-")[0].toLowerCase();
  return languageCode === "de" ? "de" : "en";
};

const resources = {
  en: {
    translation: en,
    zod: zodEn,
  },
  de: {
    translation: de,
    zod: zodDe,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getCookieSave("language", detectUserLocale()),
  fallbackLng: DEFAULT_LANGUAGE,
  debug: false,
  showSupportNotice: false,
  ns: ["translation", "zod"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", () => {
  z.config({
    localeError: zodI18nMap,
  });
});

z.config({
  localeError: zodI18nMap,
});

export default i18n;
