import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import * as z from "zod";
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
  en: {translation: en},
  de: {translation: de},
};

const applyZodLocale = (lang) => {
  const locale = lang === "de" ? z.locales.de : z.locales.en;
  z.config(locale());
};

i18n.use(initReactI18next).init({
  resources,
  lng: getCookieSave("language", detectUserLocale()),
  fallbackLng: DEFAULT_LANGUAGE,
  debug: false,
  showSupportNotice: false,
  interpolation: {escapeValue: false},
});

i18n.on("languageChanged", (lang) => {
  applyZodLocale(lang);
});

applyZodLocale(i18n.language);

export default i18n;
