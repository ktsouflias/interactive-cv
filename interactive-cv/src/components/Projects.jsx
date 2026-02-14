import { useTranslation } from "react-i18next";

export default function Projects(){
  const { t } = useTranslation();
  const items = t("projects", { returnObjects: true });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((p) => (
        <div key={p.name} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
          <div className="text-sm font-extrabold">{p.name}</div>
          <div className="text-sm text-[var(--muted)] mt-1 leading-relaxed">{p.desc}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags.map((x) => (
              <span key={x} className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--chip)]">
                {x}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
