import { useTranslation } from "react-i18next";

export default function ControlsBar({ theme, setTheme, lang, setLang, editMode, setEditMode, onPdf }){
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-2 items-center justify-end">
      <button
        className="px-3 py-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-soft text-sm font-semibold"
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? t("actions.done") : t("actions.editMode")}
      </button>

      <button
        className="px-3 py-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-soft text-sm font-semibold"
        onClick={onPdf}
      >
        {t("actions.downloadPdf")}
      </button>

      <div className="flex rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--panel)] shadow-soft">
        <button className={`px-3 py-2 text-sm font-semibold ${theme==="light" ? "bg-[var(--chip)]" : ""}`} onClick={() => setTheme("light")}>
          {t("actions.themeLight")}
        </button>
        <button className={`px-3 py-2 text-sm font-semibold ${theme==="dark" ? "bg-[var(--chip)]" : ""}`} onClick={() => setTheme("dark")}>
          {t("actions.themeDark")}
        </button>
      </div>

      <div className="flex rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--panel)] shadow-soft">
        <button className={`px-3 py-2 text-sm font-semibold ${lang==="en" ? "bg-[var(--chip)]" : ""}`} onClick={() => setLang("en")}>
          {t("actions.langEN")}
        </button>
        <button className={`px-3 py-2 text-sm font-semibold ${lang==="el" ? "bg-[var(--chip)]" : ""}`} onClick={() => setLang("el")}>
          {t("actions.langEL")}
        </button>
      </div>
    </div>
  );
}
