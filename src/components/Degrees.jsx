export default function Degrees({ education, setEducation, editMode }){
  const updateDegree = (id, patch) => {
    setEducation((current) =>
      current.map((degree) => (degree.id === id ? { ...degree, ...patch } : degree))
    );
  };

  const addDegree = () => {
    setEducation((current) => [
      ...current,
      {
        id: `edu-${Date.now()}`,
        title: "New Degree",
        subtitle: "Program / Institution",
        start: "",
        end: "",
      },
    ]);
  };

  const removeDegree = (id) => {
    setEducation((current) => current.filter((degree) => degree.id !== id));
  };

  const moveDegree = (id, direction) => {
    setEducation((current) => moveItem(current, id, direction));
  };

  return (
    <div className="degrees-grid space-y-3">
      <div className="degrees-grid-list grid grid-cols-1 sm:grid-cols-2 gap-3">
        {education.map((degree) => (
          <div key={degree.id} className="degree-entry rounded-2xl border border-[var(--line)] bg-[var(--chip)] p-4">
            {editMode ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveDegree(degree.id, -1)}
                    className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDegree(degree.id, 1)}
                    className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
                  >
                    Move down
                  </button>
                </div>
                <input
                  type="text"
                  value={degree.title}
                  onChange={(e) => updateDegree(degree.id, { title: e.target.value })}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-extrabold outline-none"
                  placeholder="Title"
                />
                <textarea
                  value={degree.subtitle}
                  onChange={(e) => updateDegree(degree.id, { subtitle: e.target.value })}
                  className="min-h-[90px] w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-3 text-sm outline-none resize-y"
                  placeholder="Program / Institution"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={degree.start ?? ""}
                    onChange={(e) => updateDegree(degree.id, { start: e.target.value })}
                    className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm outline-none"
                    placeholder="From"
                  />
                  <input
                    type="text"
                    value={degree.end ?? ""}
                    onChange={(e) => updateDegree(degree.id, { end: e.target.value })}
                    className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm outline-none"
                    placeholder="To"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDegree(degree.id)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
                >
                  Remove degree
                </button>
              </div>
            ) : (
              <>
                <div className="text-sm font-extrabold text-[color:var(--brand)]">{degree.title}</div>
                <div className="text-sm mt-1 font-semibold whitespace-pre-line break-words">{degree.subtitle}</div>
                <div className="text-xs text-[var(--muted)] mt-2">{formatDegreePeriod(degree)}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {editMode ? (
        <button
          type="button"
          onClick={addDegree}
          className="w-full rounded-2xl border border-dashed border-[var(--line)] bg-[var(--chip)] px-4 py-3 text-sm font-semibold"
        >
          Add degree
        </button>
      ) : null}
    </div>
  );
}

export function formatDegreePeriod(degree) {
  const start = degree.start?.trim() || "";
  const end = degree.end?.trim() || "";
  const legacy = degree.period?.trim() || "";

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  return legacy || end;
}

function moveItem(items, id, direction) {
  const current = [...(items ?? [])];
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return current;
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= current.length) return current;
  const [item] = current.splice(index, 1);
  current.splice(nextIndex, 0, item);
  return current;
}
