import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/language.en.json";
import vn from "./locales/language.vn.json";
import esp from "./locales/language.esp.json";

const resources = {
  en: {
    translation: en,
  },
  vn: {
    translation: vn,
  },
  esp: {
    translation: esp,
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources,
});

export default i18n;
