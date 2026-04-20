import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./lib/storage";
import { downloadPdfFromElement } from "./lib/pdf";
import TopHero from "./components/TopHero";
import ControlsBar from "./components/ControlsBar";
import DraggableLayout, { getDefaultLayout } from "./components/DraggableLayout";
import { normalizeExperienceItems } from "./components/ExperienceGrid";

const SECTION_IDS = ["skills", "education", "projects", "experience", "languages"];
const PDF_TEMPLATES = ["modern", "classic", "compact"];
const DEFAULT_PALETTE = {
  light: {
    bg: "#f6f7fb",
    brand: "#7b84d6",
    brand2: "#9aa2ff",
    ink: "#0f172a",
  },
  dark: {
    bg: "#0b1020",
    brand: "#7b84d6",
    brand2: "#9aa2ff",
    ink: "#f8fafc",
  },
};

export default function App(){
  const { i18n, t } = useTranslation();
  const defaults = getDefaultCvState(t);

  const [theme, setTheme] = useState(store.get("cv_theme", "light"));
  const [editMode, setEditMode] = useState(store.get("cv_editMode", false));
  const [showPalette, setShowPalette] = useState(false);
  const [pdfTemplate, setPdfTemplate] = useState(() => normalizePdfTemplate(store.get("cv_pdfTemplate", "modern")));
  const [palette, setPalette] = useState(() =>
    store.get("cv_palette", DEFAULT_PALETTE)
  );
  const [layout, setLayout] = useState(store.get("cv_layout", defaults.layout));
  const [hero, setHero] = useState(() =>
    store.get("cv_hero", defaults.hero)
  );
  const [meta, setMeta] = useState(() =>
    store.get("cv_meta", defaults.meta)
  );
  const [skills, setSkills] = useState(() =>
    ensureItemIds(store.get("cv_skills", defaults.skills), "skill")
  );
  const [languages, setLanguages] = useState(() =>
    ensureItemIds(store.get("cv_languages", defaults.languages), "lang")
  );
  const [experience, setExperience] = useState(() =>
    normalizeExperienceItems(store.get("cv_experience", defaults.experience))
  );
  const [projects, setProjects] = useState(() =>
    ensureProjectIds(store.get("cv_projects", defaults.projects))
  );
  const [education, setEducation] = useState(() =>
    ensureEducationIds(store.get("cv_education", defaults.education))
  );
  const [sectionVisibility, setSectionVisibility] = useState(() =>
    normalizeSectionVisibility(store.get("cv_sectionVisibility", defaults.sectionVisibility))
  );

  const printRef = useRef(null);
  const contentTopPadding = showPalette
    ? editMode
      ? "pt-80"
      : "pt-64"
    : editMode
      ? "pt-52"
      : "pt-28";

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    store.set("cv_theme", theme);
  }, [theme]);
  useEffect(() => {
    const root = document.documentElement;
    const current = palette[theme];
    const toolbarAlpha = theme === "dark" ? 0.78 : 0.76;
    const chipAlpha = theme === "dark" ? 0.22 : 0.12;
    const lineAlpha = theme === "dark" ? 0.12 : 0.08;
    const mutedAlpha = theme === "dark" ? 0.72 : 0.65;

    root.style.setProperty("--bg", current.bg);
    root.style.setProperty("--brand", current.brand);
    root.style.setProperty("--brand2", current.brand2);
    root.style.setProperty("--ink", current.ink);
    root.style.setProperty("--panel", theme === "dark" ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.92)");
    root.style.setProperty("--toolbar", withAlpha(current.bg, toolbarAlpha));
    root.style.setProperty("--chip", withAlpha(current.brand, chipAlpha));
    root.style.setProperty("--line", withAlpha(current.ink, lineAlpha));
    root.style.setProperty("--muted", withAlpha(current.ink, mutedAlpha));
    root.style.setProperty("--selection", withAlpha(current.brand, 0.25));

    store.set("cv_palette", palette);
  }, [palette, theme]);

  useEffect(() => store.set("cv_editMode", editMode), [editMode]);
  useEffect(() => store.set("cv_pdfTemplate", pdfTemplate), [pdfTemplate]);
  useEffect(() => store.set("cv_layout", layout), [layout]);
  useEffect(() => store.set("cv_hero", hero), [hero]);
  useEffect(() => store.set("cv_meta", meta), [meta]);
  useEffect(() => store.set("cv_skills", skills), [skills]);
  useEffect(() => store.set("cv_languages", languages), [languages]);
  useEffect(() => store.set("cv_experience", experience), [experience]);
  useEffect(() => store.set("cv_projects", projects), [projects]);
  useEffect(() => store.set("cv_education", education), [education]);
  useEffect(() => store.set("cv_sectionVisibility", sectionVisibility), [sectionVisibility]);

  const visibleSections = normalizeSectionVisibility(sectionVisibility);

  const toggleSectionVisibility = (sectionId) => {
    setSectionVisibility((current) => ({
      ...current,
      [sectionId]: !visibleSections[sectionId],
    }));
  };

  const resetSection = (sectionId) => {
    if (sectionId === "skills") setSkills(ensureItemIds(defaults.skills, "skill"));
    if (sectionId === "languages") setLanguages(ensureItemIds(defaults.languages, "lang"));
    if (sectionId === "experience") setExperience(normalizeExperienceItems(defaults.experience));
    if (sectionId === "projects") setProjects(ensureProjectIds(defaults.projects));
    if (sectionId === "education") setEducation(ensureEducationIds(defaults.education));

    setSectionVisibility((current) => ({
      ...current,
      [sectionId]: true,
    }));
  };

  const resetAll = () => {
    setLayout(defaults.layout);
    setHero(defaults.hero);
    setMeta(defaults.meta);
    setSkills(ensureItemIds(defaults.skills, "skill"));
    setLanguages(ensureItemIds(defaults.languages, "lang"));
    setExperience(normalizeExperienceItems(defaults.experience));
    setProjects(ensureProjectIds(defaults.projects));
    setEducation(ensureEducationIds(defaults.education));
    setSectionVisibility(defaults.sectionVisibility);
    setPdfTemplate("modern");
  };

  const sections = [
    { id: "skills", label: t("nav.skills"), visible: visibleSections.skills },
    { id: "experience", label: t("nav.experience"), visible: visibleSections.experience },
    { id: "projects", label: t("nav.projects"), visible: visibleSections.projects },
    { id: "education", label: t("nav.education"), visible: visibleSections.education },
    { id: "languages", label: t("nav.languages"), visible: visibleSections.languages },
  ];

  const onPdf = async () => {
    const pdfFilename = `${toFileSafeName(hero.name || "CV")}-CV.pdf`;
    await downloadPdfFromElement(printRef.current, pdfFilename, {
      preferSinglePage: true,
    });
  };

  const templateClass = `cv-template-${normalizePdfTemplate(pdfTemplate)}`;

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-x-0 top-0 z-40 pointer-events-none"
        style={{
          background: "var(--bg)",
        }}
      >
        <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 pb-6">
          <div className="pointer-events-auto">
            <ControlsBar
              theme={theme}
              setTheme={setTheme}
              showPalette={showPalette}
              setShowPalette={setShowPalette}
              palette={palette}
              setPalette={setPalette}
              defaultPalette={DEFAULT_PALETTE}
              pdfTemplate={pdfTemplate}
              setPdfTemplate={setPdfTemplate}
              sections={sections}
              onToggleSection={toggleSectionVisibility}
              onResetAll={resetAll}
              editMode={editMode}
              setEditMode={setEditMode}
              onPdf={onPdf}
            />
          </div>
        </div>
      </div>

      <div className={`mx-auto max-w-6xl px-4 pb-6 ${contentTopPadding}`}>
        <CvContent
          templateClass={templateClass}
          hero={hero}
          setHero={setHero}
          meta={meta}
          setMeta={setMeta}
          editMode={editMode}
          layout={layout}
          setLayout={setLayout}
          skills={skills}
          setSkills={setSkills}
          languages={languages}
          setLanguages={setLanguages}
          experience={experience}
          setExperience={setExperience}
          projects={projects}
          setProjects={setProjects}
          education={education}
          setEducation={setEducation}
          sectionVisibility={visibleSections}
          onToggleSection={toggleSectionVisibility}
          onResetSection={resetSection}
        />
      </div>

      <div
        aria-hidden
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: "794px",
          pointerEvents: "none",
          opacity: 0,
          zIndex: -1,
        }}
      >
        <div ref={printRef} className="cv-export-root">
          <CvContent
            templateClass={templateClass}
            hero={hero}
            setHero={setHero}
            meta={meta}
            setMeta={setMeta}
            editMode={false}
            layout={layout}
            setLayout={setLayout}
            skills={skills}
            setSkills={setSkills}
            languages={languages}
            setLanguages={setLanguages}
            experience={experience}
            setExperience={setExperience}
            projects={projects}
            setProjects={setProjects}
            education={education}
            setEducation={setEducation}
            sectionVisibility={visibleSections}
            onToggleSection={toggleSectionVisibility}
            onResetSection={resetSection}
            exportMode
          />
        </div>
      </div>
    </div>
  );
}

function CvContent({
  templateClass,
  hero,
  setHero,
  meta,
  setMeta,
  editMode,
  layout,
  setLayout,
  skills,
  setSkills,
  languages,
  setLanguages,
  experience,
  setExperience,
  projects,
  setProjects,
  education,
  setEducation,
  sectionVisibility,
  onToggleSection,
  onResetSection,
  exportMode = false,
}) {
  return (
    <div className={`cv-page space-y-4 ${templateClass} ${exportMode ? "cv-export-page" : ""}`}>
      <div className={`cv-breadcrumb flex items-start justify-between gap-3 ${exportMode ? "" : "pr-[340px]"}`}>
        <div className="text-sm text-[var(--muted)]">
          <span className="font-semibold text-[color:var(--brand)]">Interactive CV</span>
          <span className="mx-2 opacity-60">-</span>
          <span>{hero.name}</span>
        </div>
      </div>

      <TopHero
        hero={hero}
        setHero={setHero}
        meta={meta}
        setMeta={setMeta}
        editMode={editMode}
        exportMode={exportMode}
      />

        <DraggableLayout
          layout={layout}
          setLayout={setLayout}
        editMode={editMode}
        skills={skills}
        setSkills={setSkills}
        languages={languages}
        setLanguages={setLanguages}
        experience={experience}
        setExperience={setExperience}
        projects={projects}
        setProjects={setProjects}
        education={education}
        setEducation={setEducation}
          sectionVisibility={sectionVisibility}
          onToggleSection={onToggleSection}
          onResetSection={onResetSection}
          exportMode={exportMode}
          disableMotion={exportMode}
        />

      <footer className="cv-footer pt-6 text-center text-xs text-[var(--muted)]">
        &copy; {new Date().getFullYear()} {hero.name} - Built with React
      </footer>
    </div>
  );
}

function getDefaultCvState(t) {
  return {
    layout: getDefaultLayout(),
    sectionVisibility: Object.fromEntries(SECTION_IDS.map((id) => [id, true])),
    hero: {
      name: t("name"),
      headline: t("headline"),
      subheadline: t("subheadline"),
      avatar: {
        type: "empty",
        preset: "initials",
        image: "",
        fit: "cover",
      },
    },
    meta: t("meta", { returnObjects: true }),
    skills: t("skills", { returnObjects: true }),
    languages: t("languages", { returnObjects: true }),
    experience: t("experience", { returnObjects: true }),
    projects: t("projects", { returnObjects: true }),
    education: t("education", { returnObjects: true }),
  };
}

function ensureItemIds(items, prefix) {
  return (items ?? []).map((item, index) => ({
    id: item.id ?? `${prefix}-${index + 1}`,
    ...item,
  }));
}

function ensureProjectIds(items) {
  return (items ?? []).map((item, index) => ({
    id: item.id ?? `project-${index + 1}`,
    url: item.url ?? "",
    buttonLabel: item.buttonLabel ?? "View Project",
    wholeCardClickable: item.wholeCardClickable ?? false,
    ...item,
  }));
}

function ensureEducationIds(items) {
  return (items ?? []).map((item, index) => ({
    id: item.id ?? `edu-${index + 1}`,
    start: item.start ?? "",
    end: item.end ?? "",
    ...item,
  }));
}

function withAlpha(hex, alpha) {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeSectionVisibility(value) {
  const fallback = Object.fromEntries(SECTION_IDS.map((id) => [id, true]));
  if (!value || typeof value !== "object") return fallback;
  return SECTION_IDS.reduce((acc, id) => {
    acc[id] = value[id] ?? true;
    return acc;
  }, {});
}

function normalizePdfTemplate(value) {
  return PDF_TEMPLATES.includes(value) ? value : "modern";
}

function toFileSafeName(value) {
  return String(value)
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "CV";
}
