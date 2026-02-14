import { useTranslation } from "react-i18next";

export default function Degrees(){
  const { t } = useTranslation();
  const degrees = t("education", { returnObjects: true });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {degrees.map((d, idx) => (
        <div key={idx} className="rounded-2xl border border-[var(--line)] bg-[var(--chip)] p-4">
          <div className="text-sm font-extrabold text-[color:var(--brand)]">{d.title}</div>
          <div className="text-sm mt-1 font-semibold">{d.subtitle}</div>
          <div className="text-xs text-[var(--muted)] mt-2">{d.period}</div>
        </div>
      ))}
    </div>
  );
}
