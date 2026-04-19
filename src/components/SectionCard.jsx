export default function SectionCard({ title, children, editMode = false, onHide, onReset }){
  return (
    <div className="cv-section-card rounded-3xl bg-[var(--panel)] border border-[var(--line)] shadow-soft">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-xs tracking-[.18em] uppercase text-[var(--muted)] font-semibold">
            {title}
          </div>
          {editMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReset}
                className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-2.5 py-1 text-[11px] font-semibold shadow-soft"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onHide}
                className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-2.5 py-1 text-[11px] font-semibold shadow-soft"
              >
                Hide
              </button>
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
