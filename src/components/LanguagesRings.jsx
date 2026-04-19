export default function LanguagesRings({ languages, setLanguages, editMode, locale = "en" }){
  const updateLanguage = (index, patch) => {
    setLanguages((current) =>
      current.map((lang, i) => (i === index ? { ...lang, ...patch } : lang))
    );
  };

  const addLanguage = () => {
    setLanguages((current) => [
      ...current,
      { id: `lang-${Date.now()}`, name: `Language ${current.length + 1}`, pct: 50 },
    ]);
  };

  const removeLanguage = (index) => {
    setLanguages((current) => current.filter((_, i) => i !== index));
  };

  return (
    <div className="languages-grid space-y-4">
      <div className="languages-grid-list flex flex-wrap gap-6">
        {languages.map((lang, index) => {
          const pct = clampPercent(lang.pct);
          const level = getLanguageLevel(pct, locale);

          return (
            <div key={lang.id ?? `lang-${index}`} className="language-entry flex min-w-[120px] flex-col items-center gap-2">
              <Ring pct={pct} ringId={lang.id ?? `lang-${index}`} />

              {editMode ? (
                <div className="w-full space-y-2">
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => updateLanguage(index, { name: e.target.value })}
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-center text-sm font-semibold outline-none"
                    placeholder="Language"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pct}
                      onChange={(e) => updateLanguage(index, { pct: clampPercent(e.target.value) })}
                      className="w-full accent-[var(--brand)]"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={pct}
                      onChange={(e) => updateLanguage(index, { pct: clampPercent(e.target.value) })}
                      className="w-16 rounded-xl border border-[var(--line)] bg-[var(--chip)] px-2 py-2 text-sm font-semibold text-right outline-none"
                    />
                  </div>
                  <div className="text-center text-xs text-[var(--muted)]">{level}</div>
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-2.5 py-2 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-sm font-extrabold">{lang.name}</div>
                  <div className="text-xs text-[var(--muted)]">{level}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {editMode ? (
        <button
          type="button"
          onClick={addLanguage}
          className="w-full rounded-2xl border border-dashed border-[var(--line)] bg-[var(--chip)] px-4 py-3 text-sm font-semibold"
        >
          Add language
        </button>
      ) : null}
    </div>
  );
}

function Ring({ pct, ringId }){
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const gradientId = `g-${ringId}`;

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} stroke="rgba(15,23,42,.10)" strokeWidth="6" fill="none" />
      <circle
        cx="36"
        cy="36"
        r={r}
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        transform="rotate(-90 36 36)"
      />
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="72" y2="0">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--brand2)" />
        </linearGradient>
      </defs>
      <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--ink)">
        {pct}%
      </text>
    </svg>
  );
}

function clampPercent(value) {
  const next = Number(value);
  if (Number.isNaN(next)) return 0;
  return Math.max(0, Math.min(100, Math.round(next)));
}

export function getLanguageLevel(pct, locale = "en") {
  const labels = locale === "el"
    ? {
        native: "Μητρική",
        professional: "Επαγγελματική",
        advanced: "Πολύ καλή",
        intermediate: "Μέτρια",
        basic: "Βασική",
      }
    : {
        native: "Native",
        professional: "Professional",
        advanced: "Advanced",
        intermediate: "Intermediate",
        basic: "Basic",
      };

  if (pct >= 95) return labels.native;
  if (pct >= 80) return labels.professional;
  if (pct >= 65) return labels.advanced;
  if (pct >= 45) return labels.intermediate;
  return labels.basic;
}
