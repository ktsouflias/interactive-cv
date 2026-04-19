export default function Projects({ projects, setProjects, editMode }){
  const updateProject = (id, patch) => {
    setProjects((current) =>
      current.map((project) => (project.id === id ? { ...project, ...patch } : project))
    );
  };

  const addProject = () => {
    setProjects((current) => [
      ...current,
      {
        id: `project-${Date.now()}`,
        name: "New Project",
        desc: "Project description",
        tags: [],
        url: "",
        buttonLabel: "View Project",
        wholeCardClickable: false,
      },
    ]);
  };

  const removeProject = (id) => {
    setProjects((current) => current.filter((project) => project.id !== id));
  };

  const moveProject = (id, direction) => {
    setProjects((current) => moveItem(current, id, direction));
  };

  const addTag = (id, value) => {
    const tag = value.trim();
    if (!tag) return;

    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, tags: [...(project.tags ?? []), tag] } : project
      )
    );
  };

  const removeTag = (id, tagIndex) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? { ...project, tags: (project.tags ?? []).filter((_, index) => index !== tagIndex) }
          : project
      )
    );
  };

  return (
    <div className="projects-grid space-y-3">
      <div className="projects-grid-list grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            editMode={editMode}
            onUpdate={updateProject}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onRemove={removeProject}
            onMove={moveProject}
          />
        ))}
      </div>

      {editMode ? (
        <button
          type="button"
          onClick={addProject}
          className="w-full rounded-2xl border border-dashed border-[var(--line)] bg-[var(--chip)] px-4 py-3 text-sm font-semibold"
        >
          Add project
        </button>
      ) : null}
    </div>
  );
}

function ProjectCard({ project, editMode, onUpdate, onAddTag, onRemoveTag, onRemove, onMove }) {
  const hasUrl = Boolean(project.url?.trim());
  const content = (
    <div className="project-entry rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 h-full">
      {editMode ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onMove(project.id, -1)}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
            >
              Move up
            </button>
            <button
              type="button"
              onClick={() => onMove(project.id, 1)}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
            >
              Move down
            </button>
          </div>
          <input
            type="text"
            value={project.name}
            onChange={(e) => onUpdate(project.id, { name: e.target.value })}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm font-extrabold outline-none"
            placeholder="Project title"
          />

          <textarea
            value={project.desc}
            onChange={(e) => onUpdate(project.id, { desc: e.target.value })}
            className="min-h-[110px] w-full rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-3 text-sm outline-none resize-y"
            placeholder="Project description"
          />

          <div className="rounded-xl border border-[var(--line)] bg-[var(--chip)] p-3 space-y-2">
            <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-[.14em]">Tags</div>
            <TagEditor
              tags={project.tags ?? []}
              onAdd={(value) => onAddTag(project.id, value)}
              onRemove={(index) => onRemoveTag(project.id, index)}
            />
          </div>

          <input
            type="url"
            value={project.url ?? ""}
            onChange={(e) => onUpdate(project.id, { url: e.target.value })}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm outline-none"
            placeholder="https://example.com"
          />

          <input
            type="text"
            value={project.buttonLabel ?? ""}
            onChange={(e) => onUpdate(project.id, { buttonLabel: e.target.value })}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm outline-none"
            placeholder="Button label"
          />

          <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <input
              type="checkbox"
              checked={Boolean(project.wholeCardClickable)}
              onChange={(e) => onUpdate(project.id, { wholeCardClickable: e.target.checked })}
            />
            Whole card clickable
          </label>

          <button
            type="button"
            onClick={() => onRemove(project.id)}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
          >
            Remove project
          </button>
        </div>
      ) : (
        <>
          <div className="text-sm font-extrabold">{project.name}</div>
          <div className="text-sm text-[var(--muted)] mt-1 leading-relaxed whitespace-pre-line break-words">
            {project.desc}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(project.tags ?? []).map((tag, index) => (
              <span key={`${tag}-${index}`} className="cv-tag text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--chip)]">
                {tag}
              </span>
            ))}
          </div>
          {hasUrl && !project.wholeCardClickable ? (
            <div className="mt-4">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-sm font-semibold no-underline"
              >
                {project.buttonLabel?.trim() || "View Project"}
              </a>
            </div>
          ) : null}
        </>
      )}
    </div>
  );

  if (!editMode && hasUrl && project.wholeCardClickable) {
    return (
      <a href={project.url} target="_blank" rel="noreferrer" className="block no-underline h-full">
        {content}
      </a>
    );
  }

  return content;
}

function TagEditor({ tags, onAdd, onRemove }) {
  const draftId = `tag-draft-${Math.random().toString(36).slice(2)}`;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <button
            key={`${tag}-${index}`}
            type="button"
            onClick={() => onRemove(index)}
            className="cv-tag text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--panel)]"
            title="Remove tag"
          >
            {tag} ×
          </button>
        ))}
      </div>
      <TagInput inputId={draftId} onAdd={onAdd} />
    </>
  );
}

function TagInput({ onAdd }) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm outline-none"
        placeholder="Add tag"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const value = e.currentTarget.value;
            onAdd(value);
            e.currentTarget.value = "";
          }
        }}
      />
      <button
        type="button"
        onClick={(e) => {
          const input = e.currentTarget.parentElement?.querySelector("input");
          if (!input) return;
          onAdd(input.value);
          input.value = "";
        }}
        className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold"
      >
        Add
      </button>
    </div>
  );
}

function moveItem(items, id, direction) {
  const current = [...(items ?? [])];
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return current;
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= current.length) return current;
  const [item] = current.splice(index, 1);
  current.splice(nextIndex, 0, item);
  return current;
}
