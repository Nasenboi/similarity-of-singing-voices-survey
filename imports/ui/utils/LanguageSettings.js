import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {getCookieSave} from "../customComponents/Cookies";
import de from "./translationResources/de.json";
import en from "./translationResources/en.json";

const resources = {en, de};
const defaultLanguage = "en";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getCookieSave("language", "de"),
    fallbackLng: defaultLanguage,
    debug: false,
    showSupportNotice: false,
  });

export default i18n;
