import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../content/en.json";
import el from "../content/el.json";
import { store } from "./storage";

const saved = store.get("cv_lang", "en");

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, el: { translation: el } },
  lng: saved,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export const setLang = (lng) => {
  i18n.changeLanguage(lng);
  store.set("cv_lang", lng);
};

export default i18n;
