export default function SectionCard({ title, children }){
  return (
    <div className="rounded-3xl bg-[var(--panel)] border border-[var(--line)] shadow-soft">
      <div className="p-5">
        <div className="text-xs tracking-[.18em] uppercase text-[var(--muted)] font-semibold mb-4">
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}
