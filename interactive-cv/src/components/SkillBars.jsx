import { useTranslation } from "react-i18next";

export default function SkillBars(){
  const { t } = useTranslation();
  const skills = t("skills", { returnObjects: true });

  return (
    <div className="space-y-4">
      {skills.map((s) => (
        <div key={s.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{s.name}</div>
            <div className="text-xs text-[var(--muted)]">{s.level}%</div>
          </div>
          <div className="h-2 rounded-full bg-[rgba(15,23,42,.06)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand),var(--brand2))]"
              style={{ width: `${s.level}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
