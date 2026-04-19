export default function ControlsBar({
  theme,
  setTheme,
  showPalette,
  setShowPalette,
  palette,
  setPalette,
  defaultPalette,
  pdfTemplate,
  setPdfTemplate,
  sections,
  onToggleSection,
  onResetAll,
  editMode,
  setEditMode,
  onPdf,
}){
  const currentPalette = palette[theme];

  return (
    <div className="max-w-[calc(100vw-2rem)] rounded-3xl border border-[var(--line)] bg-[var(--toolbar)] px-3 py-3 shadow-soft backdrop-blur-md">
      <div className="flex flex-wrap gap-2 items-center justify-end">
        <button
          className="px-3 py-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-soft text-sm font-semibold"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Done" : "Edit layout"}
        </button>

        <button
          className="px-3 py-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-soft text-sm font-semibold"
          onClick={onPdf}
        >
          Download PDF
        </button>

        <label className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 shadow-soft">
          <span className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]">Template</span>
          <select
            value={pdfTemplate}
            onChange={(e) => setPdfTemplate(e.target.value)}
            className="bg-transparent text-sm font-semibold outline-none"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="compact">Compact</option>
          </select>
        </label>

        <button
          className={`px-3 py-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-soft text-sm font-semibold ${showPalette ? "bg-[var(--chip)]" : ""}`}
          onClick={() => setShowPalette((current) => !current)}
        >
          Palette
        </button>

        <div className="flex rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--panel)] shadow-soft">
          <button className={`px-3 py-2 text-sm font-semibold ${theme==="light" ? "bg-[var(--chip)]" : ""}`} onClick={() => setTheme("light")}>
            Light
          </button>
          <button className={`px-3 py-2 text-sm font-semibold ${theme==="dark" ? "bg-[var(--chip)]" : ""}`} onClick={() => setTheme("dark")}>
            Dark
          </button>
        </div>
      </div>

      {showPalette ? (
        <div className="mt-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-3">
          <div className="mb-3 flex justify-end">
            <button
              className="px-3 py-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-soft text-sm font-semibold"
              onClick={() => setPalette(structuredClone(defaultPalette))}
            >
              Reset palette
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ColorField
            label={`${theme} background`}
            value={currentPalette.bg}
            onChange={(value) => updatePalette(setPalette, theme, "bg", value)}
          />
          <ColorField
            label={`${theme} text`}
            value={currentPalette.ink}
            onChange={(value) => updatePalette(setPalette, theme, "ink", value)}
          />
          <ColorField
            label={`${theme} primary`}
            value={currentPalette.brand}
            onChange={(value) => updatePalette(setPalette, theme, "brand", value)}
          />
          <ColorField
            label={`${theme} secondary`}
            value={currentPalette.brand2}
            onChange={(value) => updatePalette(setPalette, theme, "brand2", value)}
          />
          </div>
        </div>
      ) : null}

      {editMode ? (
        <div className="mt-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]">
              Sections
            </div>
            <button
              className="px-3 py-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-soft text-sm font-semibold"
              onClick={onResetAll}
            >
              Reset all
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`px-3 py-2 rounded-2xl border border-[var(--line)] shadow-soft text-sm font-semibold ${
                  section.visible ? "bg-[var(--chip)]" : "bg-[var(--panel)] opacity-70"
                }`}
                onClick={() => onToggleSection(section.id)}
              >
                {section.visible ? "Hide" : "Show"} {section.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-9 rounded-md border-0 bg-transparent p-0"
      />
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </label>
  );
}

function updatePalette(setPalette, theme, key, value) {
  setPalette((current) => ({
    ...current,
    [theme]: {
      ...current[theme],
      [key]: value,
    },
  }));
}
