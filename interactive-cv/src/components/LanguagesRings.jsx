import { useTranslation } from "react-i18next";

export default function LanguagesRings(){
  const { t } = useTranslation();
  const langs = t("languages", { returnObjects: true });

  return (
    <div className="flex flex-wrap gap-6">
      {langs.map((l) => (
        <div key={l.name} className="flex flex-col items-center gap-2">
          <Ring pct={l.pct} />
          <div className="text-sm font-extrabold">{l.name}</div>
          <div className="text-xs text-[var(--muted)]">{l.level}</div>
        </div>
      ))}
    </div>
  );
}

function Ring({ pct }){
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} stroke="rgba(15,23,42,.10)" strokeWidth="6" fill="none" />
      <circle
        cx="36"
        cy="36"
        r={r}
        stroke="url(#g)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        transform="rotate(-90 36 36)"
      />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="72" y2="0">
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
