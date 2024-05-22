import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/language.en.json";
import vn from "./locales/language.vn.json";

const resources = {
  en: {
    translation: en,
  },
  vn: {
    translation: vn,
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "vn",
  resources,
});

export default i18n;
