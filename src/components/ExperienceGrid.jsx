import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ExperienceGrid(){
  const { t } = useTranslation();
  const items = t("experience", { returnObjects: true });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((it, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-2xl border border-[var(--line)] bg-white/60 dark:bg-white/5 p-4"
          style={{ background: "var(--panel)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold">{it.role}</div>
              <div className="text-xs text-[var(--muted)] mt-1">{it.company}</div>
            </div>
            <div className="text-[11px] text-[var(--muted)] whitespace-nowrap">{it.period}</div>
          </div>

          {it.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {it.tags.map((x) => (
                <span key={x} className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--chip)]">
                  {x}
                </span>
              ))}
            </div>
          ) : null}

          {it.bullets?.length ? (
            <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
              {it.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}
