import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function ExperienceGrid({ experience, setExperience, editMode, locale = "en", exportMode = false }){
  const [tagDrafts, setTagDrafts] = useState({});
  const items = useMemo(() => experience ?? [], [experience]);

  const updateItem = (id, patch) => {
    setExperience((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const addTag = (id) => {
    const tag = (tagDrafts[id] ?? "").trim();
    if (!tag) return;

    setExperience((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, tags: [...(item.tags ?? []), tag] }
          : item
      )
    );

    setTagDrafts((current) => ({ ...current, [id]: "" }));
  };

  const removeTag = (id, tagIndex) => {
    setExperience((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, tags: (item.tags ?? []).filter((_, index) => index !== tagIndex) }
          : item
      )
    );
  };

  const addExperience = () => {
    setExperience((current) => [
      ...current,
      {
        id: `exp-${Date.now()}`,
        role: "New Role",
        company: "Company",
        start: "",
        end: "",
        isCurrent: false,
        tags: [],
        bullets: [],
      },
    ]);
  };

  const removeExperience = (id) => {
    setExperience((current) => current.filter((item) => item.id !== id));
  };

  const moveExperience = (id, direction) => {
    setExperience((current) => moveItem(current, id, direction));
  };

  return (
    <div className="experience-grid space-y-3">
      <div className="experience-grid-list grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <ExperienceCard
            key={item.id}
            item={item}
            editMode={editMode}
            locale={locale}
            exportMode={exportMode}
            onUpdate={updateItem}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onRemoveExperience={removeExperience}
            onMoveExperience={moveExperience}
            tagDraft={tagDrafts[item.id] ?? ""}
            setTagDraft={(value) =>
              setTagDrafts((current) => ({ ...current, [item.id]: value }))
            }
          />
        ))}
      </div>

      {editMode ? (
        <button
          type="button"
          onClick={addExperience}
          className="w-full rounded-2xl border border-dashed border-[var(--line)] bg-[var(--chip)] px-4 py-3 text-sm font-semibold"
        >
          Add experience
        </button>
      ) : null}
    </div>
  );
}

function ExperienceCard({
  item,
  editMode,
  locale,
  exportMode,
  onUpdate,
  onAddTag,
  onRemoveTag,
  onRemoveExperience,
  onMoveExperience,
  tagDraft,
  setTagDraft,
}) {
  const period = formatExperiencePeriod(item, locale);

  return (
    <motion.div
      initial={editMode || exportMode ? false : { opacity: 0, y: 14 }}
      whileInView={editMode || exportMode ? undefined : { opacity: 1, y: 0 }}
      viewport={editMode || exportMode ? undefined : { once: true, amount: 0.25 }}
      transition={editMode || exportMode ? undefined : { duration: 0.35, ease: "easeOut" }}
      className="experience-entry rounded-2xl border border-[var(--line)] bg-white/60 dark:bg-white/5 p-4"
      style={{ background: "var(--panel)" }}
    >
      {editMode ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onMoveExperience(item.id, -1)}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
            >
              Move up
            </button>
            <button
              type="button"
              onClick={() => onMoveExperience(item.id, 1)}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
            >
              Move down
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <input
              type="text"
              value={item.role}
              onChange={(e) => onUpdate(item.id, { role: e.target.value })}
              className="rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm font-extrabold outline-none"
              placeholder="Job title"
            />
            <input
              type="text"
              value={item.company}
              onChange={(e) => onUpdate(item.id, { company: e.target.value })}
              className="rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm outline-none"
              placeholder="Company"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={item.start ?? ""}
              onChange={(e) => onUpdate(item.id, { start: e.target.value })}
              className="rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm outline-none"
              placeholder="Start date"
            />
            <input
              type="text"
              value={item.end ?? ""}
              disabled={item.isCurrent}
              onChange={(e) => onUpdate(item.id, { end: e.target.value })}
              className="rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm outline-none disabled:opacity-50"
              placeholder="End date"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <input
              type="checkbox"
              checked={Boolean(item.isCurrent)}
              onChange={(e) => onUpdate(item.id, { isCurrent: e.target.checked })}
            />
            Current role
          </label>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--chip)] p-3 space-y-2">
            <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-[.14em]">Tags</div>
            <div className="flex flex-wrap gap-2">
              {(item.tags ?? []).map((tag, index) => (
                <button
                  key={`${tag}-${index}`}
                  type="button"
                  onClick={() => onRemoveTag(item.id, index)}
                  className="cv-tag text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--panel)]"
                  title="Remove tag"
                >
                  {tag} ×
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddTag(item.id);
                  }
                }}
                className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm outline-none"
                placeholder="Add tag"
              />
              <button
                type="button"
                onClick={() => onAddTag(item.id)}
                className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          <textarea
            value={item.detailsText ?? bulletsToText(item.bullets ?? [])}
            onChange={(e) =>
              onUpdate(item.id, {
                detailsText: e.target.value,
                bullets: textToBullets(e.target.value),
              })
            }
            className="min-h-[120px] w-full rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-3 text-sm outline-none resize-y"
            placeholder={item.detailsMode === "plain" ? "Write free text or paragraphs" : "One bullet per line"}
          />

          <div className="flex rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
            <button
              type="button"
              className={`px-3 py-2 text-sm font-semibold ${item.detailsMode !== "plain" ? "bg-[var(--chip)]" : ""}`}
              onClick={() => onUpdate(item.id, { detailsMode: "bullets" })}
            >
              Bullets
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-sm font-semibold ${item.detailsMode === "plain" ? "bg-[var(--chip)]" : ""}`}
              onClick={() => onUpdate(item.id, { detailsMode: "plain" })}
            >
              Plain text
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemoveExperience(item.id)}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
          >
            Remove job
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold">{item.role}</div>
              <div className="text-xs text-[var(--muted)] mt-1">{item.company}</div>
            </div>
            <div className="experience-period text-[11px] text-[var(--muted)] whitespace-nowrap">{period}</div>
          </div>

          {item.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="cv-tag text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--chip)]">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {item.detailsMode === "plain" ? (
            item.detailsText?.trim() ? (
              <div className="mt-3 text-sm leading-7 whitespace-pre-line break-words overflow-hidden">
                {item.detailsText}
              </div>
            ) : null
          ) : item.bullets?.length ? (
            <ul className="mt-3 list-disc pl-5 text-sm space-y-1 break-words overflow-hidden">
              {item.bullets.map((bullet, index) => <li key={index} className="break-words">{bullet}</li>)}
            </ul>
          ) : null}
        </>
      )}
    </motion.div>
  );
}

export function normalizeExperienceItems(items) {
  return (items ?? []).map((item, index) => {
    const normalized = parsePeriod(item.period ?? "");
    const bullets = item.bullets ?? [];

    return {
      id: item.id ?? `exp-${index + 1}`,
      role: item.role ?? "",
      company: item.company ?? "",
      start: item.start ?? normalized.start ?? "",
      end: item.end ?? normalized.end ?? "",
      isCurrent: item.isCurrent ?? normalized.isCurrent ?? false,
      tags: item.tags ?? [],
      bullets,
      detailsText: item.detailsText ?? bulletsToText(bullets),
      detailsMode: item.detailsMode ?? "bullets",
    };
  });
}

export function sortExperienceItems(items) {
  return [...(items ?? [])].sort((a, b) => {
    const endDiff = getSortDateValue(b) - getSortDateValue(a);
    if (endDiff !== 0) return endDiff;
    return (b.start ?? "").localeCompare(a.start ?? "");
  });
}

export function formatExperiencePeriod(item, locale = "en") {
  const start = item.start?.trim() || "";
  const end = item.isCurrent ? (locale === "el" ? "Σήμερα" : "Present") : (item.end?.trim() || "");

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  return end;
}

function getSortDateValue(item) {
  if (item.isCurrent) return Number.MAX_SAFE_INTEGER;
  const endDate = parseMonthYear(item.end);
  if (endDate) return endDate.getTime();
  const startDate = parseMonthYear(item.start);
  return startDate ? startDate.getTime() : 0;
}

function parsePeriod(period) {
  const [start = "", end = ""] = period.split(" - ").map((part) => part.trim());
  const isCurrent = /present|current|today|σήμερα/i.test(end);
  return { start, end: isCurrent ? "" : end, isCurrent };
}

function parseMonthYear(value) {
  if (!value) return null;
  const raw = value.trim().toLowerCase();
  const monthMap = {
    jan: 0, january: 0, ιαν: 0,
    feb: 1, february: 1, φεβ: 1,
    mar: 2, march: 2, μαρ: 2,
    apr: 3, april: 3, απρ: 3,
    may: 4, μαι: 4, μάι: 4, μάϊ: 4,
    jun: 5, june: 5, ιουν: 5,
    jul: 6, july: 6, ιουλ: 6,
    aug: 7, august: 7, αυγ: 7,
    sep: 8, sept: 8, september: 8, σεπ: 8,
    oct: 9, october: 9, οκτ: 9,
    nov: 10, november: 10, νοε: 10,
    dec: 11, december: 11, δεκ: 11,
  };

  const parts = raw.replace(/[.,]/g, "").split(/\s+/).filter(Boolean);
  const year = Number(parts.find((part) => /^\d{4}$/.test(part)));
  if (!year) return null;

  const monthKey = parts.find((part) => monthMap[part] !== undefined);
  const month = monthKey ? monthMap[monthKey] : 11;

  return new Date(year, month, 1);
}

function textToBullets(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function bulletsToText(bullets) {
  return (bullets ?? []).join("\n");
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
