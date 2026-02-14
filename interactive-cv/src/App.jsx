import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { setLang as setLangGlobal } from "./lib/i18n";
import { store } from "./lib/storage";
import { downloadPdfFromElement } from "./lib/pdf";
import TopHero from "./components/TopHero";
import ControlsBar from "./components/ControlsBar";
import DraggableLayout, { getDefaultOrder } from "./components/DraggableLayout";
import PrintView from "./components/PrintView";

export default function App(){
  const { i18n, t } = useTranslation();

  const [theme, setTheme] = useState(store.get("cv_theme", "light"));
  const [editMode, setEditMode] = useState(store.get("cv_editMode", false));
  const [order, setOrder] = useState(store.get("cv_order", getDefaultOrder()));

  const printRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    store.set("cv_theme", theme);
  }, [theme]);

  useEffect(() => store.set("cv_editMode", editMode), [editMode]);
  useEffect(() => store.set("cv_order", order), [order]);

  const onPdf = async () => {
    await downloadPdfFromElement(printRef.current, "Konstantinos-Tsouflias-CV.pdf");
  };

  const setLang = (lng) => setLangGlobal(lng);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-[var(--muted)]">
            <span className="font-semibold text-[color:var(--brand)]">Interactive CV</span>
            <span className="mx-2 opacity-60">•</span>
            <span>{t("name")}</span>
          </div>
          <ControlsBar
            theme={theme}
            setTheme={setTheme}
            lang={i18n.language}
            setLang={setLang}
            editMode={editMode}
            setEditMode={setEditMode}
            onPdf={onPdf}
          />
        </div>

        <TopHero />

        <DraggableLayout order={order} setOrder={setOrder} editMode={editMode} />

        <footer className="pt-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} {t("name")} — Built with React
        </footer>
      </div>

      {/* Hidden print surface for PDF export */}
      <div className="sr-only" aria-hidden>
        <div ref={printRef}>
          <PrintView />
        </div>
      </div>
    </div>
  );
}
