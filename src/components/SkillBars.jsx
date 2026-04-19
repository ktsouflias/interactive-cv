export default function SkillBars({ skills, setSkills, editMode }){
  const updateSkill = (index, patch) => {
    setSkills((current) =>
      current.map((skill, i) => (i === index ? { ...skill, ...patch } : skill))
    );
  };

  const addSkill = () => {
    setSkills((current) => [
      ...current,
      { id: `skill-${Date.now()}`, name: `New Skill ${current.length + 1}`, level: 50 },
    ]);
  };

  const removeSkill = (index) => {
    setSkills((current) => current.filter((_, i) => i !== index));
  };

  return (
    <div className="skills-grid space-y-4">
      {skills.map((s, index) => (
        <div key={s.id ?? `skill-${index}`} className="skill-entry space-y-2">
          {editMode ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={s.name}
                onChange={(e) => updateSkill(index, { name: e.target.value })}
                className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm font-semibold outline-none"
                placeholder="Skill name"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={s.level}
                onChange={(e) => updateSkill(index, { level: clampLevel(e.target.value) })}
                className="w-16 rounded-xl border border-[var(--line)] bg-[var(--chip)] px-2 py-2 text-sm font-semibold text-right outline-none"
              />
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-2.5 py-2 text-xs font-semibold"
                title="Remove skill"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-xs text-[var(--muted)]">{s.level}%</div>
            </div>
          )}

          <div className="h-2 rounded-full bg-[rgba(15,23,42,.06)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand),var(--brand2))]"
              style={{ width: `${s.level}%` }}
            />
          </div>

          {editMode ? (
            <input
              type="range"
              min="0"
              max="100"
              value={s.level}
              onChange={(e) => updateSkill(index, { level: clampLevel(e.target.value) })}
              className="w-full accent-[var(--brand)]"
            />
          ) : null}
        </div>
      ))}

      {editMode ? (
        <button
          type="button"
          onClick={addSkill}
          className="w-full rounded-2xl border border-dashed border-[var(--line)] bg-[var(--chip)] px-4 py-3 text-sm font-semibold"
        >
          Add skill
        </button>
      ) : null}
    </div>
  );
}

function clampLevel(value) {
  const next = Number(value);
  if (Number.isNaN(next)) return 0;
  return Math.max(0, Math.min(100, Math.round(next)));
}
