import { useTranslation } from "react-i18next";
import { IconMail, IconPhone, IconPin, IconLink } from "./Icon";
import { motion } from "framer-motion";

export default function TopHero() {
  const { t } = useTranslation();
  const meta = t("meta", { returnObjects: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-3xl bg-[linear-gradient(135deg,var(--brand),var(--brand2))] text-white shadow-card"
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-white/25 p-1">
              <div className="h-full w-full rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {/* Placeholder avatar */}
                <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,.25),transparent_50%)]" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white/18 border border-white/25 backdrop-blur flex items-center justify-center">
              ✦
            </div>
          </div>

          <div className="leading-tight">
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("headline")} <span className="opacity-95">{t("subheadline")}</span>
            </div>
            <div className="mt-2 opacity-90 text-sm md:text-base font-medium">
              {t("name")}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          <MetaChip icon={<IconMail className="opacity-95" />} text={meta.email} />
          <MetaChip icon={<IconPhone className="opacity-95" />} text={meta.phone} />
          <MetaChip icon={<IconPin className="opacity-95" />} text={meta.city} />
          <a href={meta.linkedin} target="_blank" rel="noreferrer" className="no-underline">
            <MetaChip icon={<IconLink className="opacity-95" />} text={"LinkedIn"} clickable />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function MetaChip({ icon, text, clickable }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/18 border border-white/25 px-3 py-2 backdrop-blur">
      <div className="shrink-0">{icon}</div>
      <div className={`text-xs md:text-sm font-medium ${clickable ? "underline underline-offset-4" : ""}`}>
        {text}
      </div>
    </div>
  );
}
