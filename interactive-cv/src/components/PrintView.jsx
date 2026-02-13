import { useTranslation } from "react-i18next";

export default function PrintView(){
  const { t } = useTranslation();
  const meta = t("meta", { returnObjects: true });
  const exp = t("experience", { returnObjects: true });
  const edu = t("education", { returnObjects: true });
  const skills = t("skills", { returnObjects: true });
  const langs = t("languages", { returnObjects: true });

  return (
    <div style={{ width: "794px", padding: "28px", background: "#fff", color: "#111", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{t("name")}</div>
          <div style={{ marginTop: 6, color: "#444" }}>{t("subheadline")}</div>
        </div>
        <div style={{ textAlign: "right", color: "#444", fontSize: 12, lineHeight: 1.6 }}>
          <div>{meta.email}</div>
          <div>{meta.phone}</div>
          <div>{meta.city}</div>
          <div>{meta.linkedin}</div>
        </div>
      </div>

      <hr style={{ margin: "16px 0", border: 0, borderTop: "1px solid #ddd" }} />

      <div style={{ fontWeight: 800, marginBottom: 6 }}>Summary</div>
      <div style={{ color: "#222", lineHeight: 1.55 }}>{t("summary")}</div>

      <hr style={{ margin: "16px 0", border: 0, borderTop: "1px solid #eee" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
        <div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Experience</div>
          {exp.map((e, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{e.role} — {e.company}</div>
              <div style={{ color: "#555", fontSize: 12 }}>{e.period}</div>
              {e.bullets?.length ? (
                <ul style={{ marginTop: 6, marginLeft: 18 }}>
                  {e.bullets.map((b, j) => <li key={j} style={{ fontSize: 12, color:"#222" }}>{b}</li>)}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Education</div>
          {edu.map((d, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{d.title}</div>
              <div style={{ color: "#222", fontSize: 12 }}>{d.subtitle}</div>
              <div style={{ color: "#555", fontSize: 12 }}>{d.period}</div>
            </div>
          ))}

          <div style={{ fontWeight: 800, margin: "14px 0 8px" }}>Skills</div>
          <div style={{ fontSize: 12, color: "#222", lineHeight: 1.6 }}>
            {skills.map(s => s.name).join(" · ")}
          </div>

          <div style={{ fontWeight: 800, margin: "14px 0 8px" }}>Languages</div>
          <div style={{ fontSize: 12, color: "#222", lineHeight: 1.6 }}>
            {langs.map(l => `${l.name} (${l.level})`).join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}
