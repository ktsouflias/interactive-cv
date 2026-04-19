import { useRef, useState } from "react";
import { IconMail, IconPhone, IconPin, IconLink } from "./Icon";

export default function TopHero({ hero, setHero, meta, setMeta, editMode, exportMode = false }){
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileInputRef = useRef(null);
  const avatar = hero.avatar ?? { type: "empty", preset: "initials", image: "", fit: "cover" };

  return (
    <div className="cv-hero-shell rounded-3xl bg-[linear-gradient(135deg,var(--brand),var(--brand2))] text-white shadow-card">
      <div
        className={`p-6 md:p-8 grid gap-8 ${
          exportMode
            ? "grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)] items-center"
            : "xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)] xl:items-center"
        }`}
      >
        <div className="flex items-center gap-5 min-w-0">
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-white/25 p-1">
              <div className="h-full w-full rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <AvatarPreview avatar={avatar} name={hero.name} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarMenu((current) => !current)}
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white/18 border border-white/25 backdrop-blur flex items-center justify-center"
            >
              +
            </button>

            {showAvatarMenu ? (
              <div className="absolute left-0 top-[calc(100%+14px)] z-20 w-[min(16rem,calc(100vw-3rem))] rounded-2xl border border-white/20 bg-[rgba(15,23,42,.82)] p-3 shadow-2xl backdrop-blur-md">
                <div className="text-xs font-semibold uppercase tracking-[.16em] text-white/65">Image or avatar</div>
                <div className="mt-3 space-y-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-left"
                    >
                      Upload image
                    </button>

                    {avatar.type === "upload" ? (
                      <div className="flex rounded-2xl overflow-hidden border border-white/15 bg-white/10">
                        <button
                          type="button"
                          className={`flex-1 px-3 py-2 text-sm font-semibold ${avatar.fit !== "contain" ? "bg-white/12" : ""}`}
                          onClick={() => setHero((current) => ({
                            ...current,
                            avatar: { ...(current.avatar ?? {}), fit: "cover" },
                          }))}
                        >
                          Cover
                        </button>
                        <button
                          type="button"
                          className={`flex-1 px-3 py-2 text-sm font-semibold ${avatar.fit === "contain" ? "bg-white/12" : ""}`}
                          onClick={() => setHero((current) => ({
                            ...current,
                            avatar: { ...(current.avatar ?? {}), fit: "contain" },
                          }))}
                        >
                          Fit
                        </button>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-4 gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setHero((current) => ({
                            ...current,
                            avatar: { type: "icon", preset: preset.id, image: "" },
                          }));
                          setShowAvatarMenu(false);
                        }}
                        className={`rounded-xl border p-1 ${avatar.type === "icon" && avatar.preset === preset.id ? "border-white/70" : "border-white/10"}`}
                        title={preset.label}
                      >
                        <div className="h-12 w-full overflow-hidden rounded-lg flex items-center justify-center bg-[rgba(255,255,255,.08)]">
                          <AvatarPreview avatar={{ type: "icon", preset: preset.id, image: "" }} name={hero.name} small />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setHero((current) => ({
                        ...current,
                        avatar: { type: "empty", preset: "initials", image: "" },
                      }));
                      setShowAvatarMenu(false);
                    }}
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-left"
                  >
                    Remove image
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e, setHero, setShowAvatarMenu)}
                />
              </div>
            ) : null}
          </div>

          <div className="leading-tight min-w-0 max-w-xl flex-1">
            {editMode ? (
              <div className="space-y-3">
                <textarea
                  value={hero.headline}
                  onChange={(e) => setHero((current) => ({ ...current, headline: e.target.value }))}
                  className="min-h-[72px] w-full rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-2xl md:text-3xl font-extrabold tracking-tight text-white outline-none resize-y placeholder:text-white/65"
                  placeholder="Headline"
                />
                <input
                  type="text"
                  value={hero.subheadline}
                  onChange={(e) => setHero((current) => ({ ...current, subheadline: e.target.value }))}
                  className="w-full rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-lg md:text-xl font-bold text-white outline-none placeholder:text-white/65"
                  placeholder="Subheadline"
                />
                <input
                  type="text"
                  value={hero.name}
                  onChange={(e) => setHero((current) => ({ ...current, name: e.target.value }))}
                  className="w-full rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-sm md:text-base font-medium text-white outline-none placeholder:text-white/65"
                  placeholder="Your name"
                />
              </div>
            ) : (
              <>
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight whitespace-pre-line break-words">
                  {hero.headline} <span className="opacity-95">{hero.subheadline}</span>
                </div>
                <div className="mt-2 opacity-90 text-sm md:text-base font-medium break-words">{hero.name}</div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:max-w-[520px] xl:ml-auto">
          {editMode ? (
            <>
              <MetaInput
                icon={<IconMail className="opacity-95" />}
                value={meta.email}
                onChange={(value) => setMeta((current) => ({ ...current, email: value }))}
                placeholder="Email"
                type="email"
              />
              <MetaInput
                icon={<IconPhone className="opacity-95" />}
                value={meta.phone}
                onChange={(value) => setMeta((current) => ({ ...current, phone: value }))}
                placeholder="Phone"
                type="text"
              />
              <MetaInput
                icon={<IconPin className="opacity-95" />}
                value={meta.city}
                onChange={(value) => setMeta((current) => ({ ...current, city: value }))}
                placeholder="City"
                type="text"
              />
              <MetaInput
                icon={<IconLink className="opacity-95" />}
                value={meta.linkedin}
                onChange={(value) => setMeta((current) => ({ ...current, linkedin: value }))}
                placeholder="LinkedIn URL"
                type="url"
              />
            </>
          ) : (
            <>
              <MetaChip icon={<IconMail className="opacity-95" />} text={meta.email} href={`mailto:${meta.email}`} />
              <MetaChip icon={<IconPhone className="opacity-95" />} text={meta.phone} href={`tel:${meta.phone.replace(/\s+/g, "")}`} />
              <MetaChip icon={<IconPin className="opacity-95" />} text={meta.city} />
              <MetaChip icon={<IconLink className="opacity-95" />} text="LinkedIn" href={meta.linkedin} clickable />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const AVATAR_PRESETS = [
  { id: "initials", label: "Initials" },
  { id: "neutral", label: "Avatar" },
];

function AvatarPreview({ avatar, name, small = false }) {
  if (avatar.type === "upload" && avatar.image) {
    return (
      <img
        src={avatar.image}
        alt={name || "Avatar"}
        className={`h-full w-full ${avatar.fit === "contain" ? "object-contain" : "object-cover"}`}
      />
    );
  }

  if (avatar.type === "empty") {
    return (
      <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,.25),transparent_50%)]" />
    );
  }

  const preset = avatar.preset ?? "initials";

  return (
    <div className="h-full w-full bg-[linear-gradient(135deg,var(--brand),var(--brand2))] flex items-center justify-center">
      <span className="text-white">{renderAvatarIcon(preset, name, small)}</span>
    </div>
  );
}

function renderAvatarIcon(preset, name, small) {
  const size = small ? 22 : 42;
  const stroke = small ? 1.7 : 1.5;
  const initials = getInitials(name);

  if (preset === "initials") {
    return <span className={`font-extrabold tracking-tight ${small ? "text-base" : "text-3xl"}`}>{initials}</span>;
  }

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth={stroke} />
      <path d="M6.5 19c.8-3 2.7-4.8 5.5-4.8s4.7 1.8 5.5 4.8" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CV";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function handleAvatarUpload(event, setHero, setShowAvatarMenu) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const image = typeof reader.result === "string" ? reader.result : "";
    setHero((current) => ({
      ...current,
      avatar: { type: "upload", preset: "initials", image, fit: current.avatar?.fit ?? "cover" },
    }));
    setShowAvatarMenu(false);
  };
  reader.readAsDataURL(file);
  event.target.value = "";
}

function MetaChip({ icon, text, clickable, href }){
  const content = (
    <div className="flex min-h-[60px] items-center gap-3 rounded-2xl bg-white/16 border border-white/25 px-4 py-3 backdrop-blur">
      <div className="shrink-0">{icon}</div>
      <div className={`min-w-0 text-sm font-medium leading-snug break-all sm:break-words ${clickable ? "underline underline-offset-4" : ""}`}>
        {text}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="block min-w-0 no-underline">
        {content}
      </a>
    );
  }

  return content;
}

function MetaInput({ icon, value, onChange, placeholder, type }){
  return (
    <div className="flex min-h-[60px] items-center gap-3 rounded-2xl bg-white/16 border border-white/25 px-4 py-3 backdrop-blur">
      <div className="shrink-0">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/65"
      />
    </div>
  );
}
