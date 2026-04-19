import { useTranslation } from "react-i18next";
import { getLanguageLevel } from "./LanguagesRings";
import { formatExperiencePeriod } from "./ExperienceGrid";
import { formatDegreePeriod } from "./Degrees";

export default function PrintView({ hero, meta, skills, languages, experience, projects, education, template = "modern" }){
  const { t, i18n } = useTranslation();
  const printableMeta = meta ?? t("meta", { returnObjects: true });
  const edu = education?.length ? education : t("education", { returnObjects: true });
  const printableSkills = skills?.length ? skills : t("skills", { returnObjects: true });
  const printableLanguages = languages?.length ? languages : t("languages", { returnObjects: true });
  const printableExperience = experience?.length ? experience : t("experience", { returnObjects: true });
  const printableProjects = projects?.length ? projects : t("projects", { returnObjects: true });
  const printableHero = hero ?? {
    name: t("name"),
    headline: t("headline"),
    subheadline: t("subheadline"),
  };

  if (template === "classic") {
    return (
      <div style={{ width: "794px", padding: "34px 36px", background: "#fff", color: "#111", fontFamily: "Georgia, serif" }}>
        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{printableHero.name}</div>
          <div style={{ marginTop: 6, fontSize: 15 }}>{printableHero.headline} {printableHero.subheadline}</div>
          <div style={{ marginTop: 10, color: "#444", fontSize: 12, lineHeight: 1.7 }}>
            {printableMeta.email} | {printableMeta.phone} | {printableMeta.city}
          </div>
          <div style={{ color: "#444", fontSize: 12 }}>{printableMeta.linkedin}</div>
        </div>

        <Section title="Summary">
          <div style={{ color: "#222", lineHeight: 1.6 }}>{t("summary")}</div>
        </Section>

        <Section title={t("nav.experience")}>
          {printableExperience.map((item, index) => (
            <div key={item.id ?? index} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 700 }}>{item.role} - {item.company}</div>
                <div style={{ color: "#555", fontSize: 12 }}>{item.start ? formatExperiencePeriod(item, i18n.language) : item.period}</div>
              </div>
              {renderExperienceDetails(item)}
            </div>
          ))}
        </Section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Section title={t("nav.education")}>
            {edu.map((d, i) => (
              <div key={d.id ?? i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>{d.title}</div>
                <div style={{ fontSize: 12 }}>{d.subtitle}</div>
                <div style={{ color: "#555", fontSize: 12 }}>{formatDegreePeriod(d)}</div>
              </div>
            ))}
          </Section>

          <Section title={t("nav.projects")}>
            {printableProjects.map((project, index) => (
              <div key={project.id ?? index} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>{project.name}</div>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>{project.desc}</div>
              </div>
            ))}
          </Section>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Section title={t("nav.skills")}>
            <div style={{ fontSize: 12, lineHeight: 1.7 }}>
              {printableSkills.map((s) => `${s.name} (${s.level}%)`).join(" | ")}
            </div>
          </Section>
          <Section title={t("nav.languages")}>
            <div style={{ fontSize: 12, lineHeight: 1.7 }}>
              {printableLanguages.map((l) => `${l.name} (${getLanguageLevel(l.pct, i18n.language)})`).join(" | ")}
            </div>
          </Section>
        </div>
      </div>
    );
  }

  if (template === "compact") {
    return (
      <div style={{ width: "794px", padding: "24px", background: "#fff", color: "#111", fontFamily: "Arial" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{printableHero.name}</div>
            <div style={{ marginTop: 4, color: "#444", fontSize: 13 }}>{printableHero.headline} {printableHero.subheadline}</div>
          </div>
          <div style={{ textAlign: "right", color: "#444", fontSize: 11, lineHeight: 1.6 }}>
            <div>{printableMeta.email}</div>
            <div>{printableMeta.phone}</div>
            <div>{printableMeta.city}</div>
          </div>
        </div>

        <div style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>{t("summary")}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>{t("nav.experience")}</div>
            {printableExperience.map((item, index) => (
              <div key={item.id ?? index} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{item.role} - {item.company}</div>
                <div style={{ color: "#555", fontSize: 11 }}>{item.start ? formatExperiencePeriod(item, i18n.language) : item.period}</div>
                {renderExperienceDetails(item)}
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>{t("nav.education")}</div>
            {edu.map((d, i) => (
              <div key={d.id ?? i} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{d.title}</div>
                <div style={{ fontSize: 11 }}>{d.subtitle}</div>
                <div style={{ color: "#555", fontSize: 11 }}>{formatDegreePeriod(d)}</div>
              </div>
            ))}

            <div style={{ fontWeight: 800, margin: "12px 0 6px" }}>{t("nav.skills")}</div>
            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
              {printableSkills.map((s) => `${s.name} (${s.level}%)`).join(" • ")}
            </div>

            <div style={{ fontWeight: 800, margin: "12px 0 6px" }}>{t("nav.languages")}</div>
            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
              {printableLanguages.map((l) => `${l.name} (${getLanguageLevel(l.pct, i18n.language)})`).join(" • ")}
            </div>

            <div style={{ fontWeight: 800, margin: "12px 0 6px" }}>{t("nav.projects")}</div>
            <div style={{ fontSize: 11, lineHeight: 1.7 }}>
              {printableProjects.map((project) => project.name).join(" • ")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "794px", padding: "28px", background: "#fff", color: "#111", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{printableHero.name}</div>
          <div style={{ marginTop: 6, color: "#444" }}>{printableHero.headline} {printableHero.subheadline}</div>
        </div>
        <div style={{ textAlign: "right", color: "#444", fontSize: 12, lineHeight: 1.6 }}>
          <div>{printableMeta.email}</div>
          <div>{printableMeta.phone}</div>
          <div>{printableMeta.city}</div>
          <div>{printableMeta.linkedin}</div>
        </div>
      </div>

      <hr style={{ margin: "16px 0", border: 0, borderTop: "1px solid #ddd" }} />

      <div style={{ fontWeight: 800, marginBottom: 6 }}>Summary</div>
      <div style={{ color: "#222", lineHeight: 1.55 }}>{t("summary")}</div>

      <hr style={{ margin: "16px 0", border: 0, borderTop: "1px solid #eee" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
        <div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>{t("nav.experience")}</div>
          {printableExperience.map((item, index) => (
            <div key={item.id ?? index} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{item.role} - {item.company}</div>
              <div style={{ color: "#555", fontSize: 12 }}>{item.start ? formatExperiencePeriod(item, i18n.language) : item.period}</div>
              {item.detailsMode === "plain" ? (
                item.detailsText?.trim() ? (
                  <div style={{ marginTop: 6, fontSize: 12, color: "#222", whiteSpace: "pre-line", lineHeight: 1.55 }}>
                    {item.detailsText}
                  </div>
                ) : null
              ) : item.bullets?.length ? (
                <ul style={{ marginTop: 6, marginLeft: 18 }}>
                  {item.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} style={{ fontSize: 12, color: "#222" }}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>{t("nav.education")}</div>
          {edu.map((d, i) => (
            <div key={d.id ?? i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{d.title}</div>
              <div style={{ color: "#222", fontSize: 12 }}>{d.subtitle}</div>
              <div style={{ color: "#555", fontSize: 12 }}>{formatDegreePeriod(d)}</div>
            </div>
          ))}

          <div style={{ fontWeight: 800, margin: "14px 0 8px" }}>{t("nav.skills")}</div>
          <div style={{ fontSize: 12, color: "#222", lineHeight: 1.6 }}>
            {printableSkills.map((s) => `${s.name} (${s.level}%)`).join(" · ")}
          </div>

          <div style={{ fontWeight: 800, margin: "14px 0 8px" }}>{t("nav.languages")}</div>
          <div style={{ fontSize: 12, color: "#222", lineHeight: 1.6 }}>
            {printableLanguages.map((l) => `${l.name} (${getLanguageLevel(l.pct, i18n.language)})`).join(" · ")}
          </div>

          <div style={{ fontWeight: 800, margin: "14px 0 8px" }}>{t("nav.projects")}</div>
          <div style={{ fontSize: 12, color: "#222", lineHeight: 1.7 }}>
            {printableProjects.map((project) => project.name).join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function renderExperienceDetails(item) {
  if (item.detailsMode === "plain") {
    if (!item.detailsText?.trim()) return null;
    return (
      <div style={{ marginTop: 6, fontSize: 12, color: "#222", whiteSpace: "pre-line", lineHeight: 1.55 }}>
        {item.detailsText}
      </div>
    );
  }

  if (!item.bullets?.length) return null;
  return (
    <ul style={{ marginTop: 6, marginLeft: 18 }}>
      {item.bullets.map((bullet, bulletIndex) => (
        <li key={bulletIndex} style={{ fontSize: 12, color: "#222" }}>{bullet}</li>
      ))}
    </ul>
  );
}
