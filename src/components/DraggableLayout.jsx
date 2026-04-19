import { DndContext, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard";
import SkillBars from "./SkillBars";
import Degrees from "./Degrees";
import ExperienceGrid from "./ExperienceGrid";
import LanguagesRings from "./LanguagesRings";
import Projects from "./Projects";
import MotionSection from "./MotionSection";

const ALL_CARD_IDS = ["skills", "education", "projects", "experience", "languages"];

const DEFAULT_LAYOUT = {
  left: ["skills", "languages"],
  right: ["experience", "projects", "education"],
};

export function getDefaultLayout() {
  return DEFAULT_LAYOUT;
}

function normalizeLayout(layout) {
  if (!layout || Array.isArray(layout)) {
    return DEFAULT_LAYOUT;
  }

  const left = Array.isArray(layout.left) ? layout.left.filter((id) => ALL_CARD_IDS.includes(id)) : [];
  const right = Array.isArray(layout.right) ? layout.right.filter((id) => ALL_CARD_IDS.includes(id)) : [];
  const used = new Set([...left, ...right]);
  const missing = ALL_CARD_IDS.filter((id) => !used.has(id));

  return {
    left: [...left, ...missing],
    right,
  };
}

function findContainer(layout, id) {
  if (id === "left" || id === "right") return id;
  if (layout.left.includes(id)) return "left";
  if (layout.right.includes(id)) return "right";
  return null;
}

export default function DraggableLayout({
  layout,
  setLayout,
  editMode,
  skills,
  setSkills,
  languages,
  setLanguages,
  experience,
  setExperience,
  projects,
  setProjects,
  education,
  setEducation,
  sectionVisibility,
  onToggleSection,
  onResetSection,
  disableMotion = false,
  exportMode = false,
}) {
  const { t, i18n } = useTranslation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const normalizedLayout = normalizeLayout(layout);

  const cards = {
    skills: {
      title: t("nav.skills"),
      content: <SkillBars skills={skills} setSkills={setSkills} editMode={editMode} />,
    },
    education: {
      title: t("nav.education"),
      content: <Degrees education={education} setEducation={setEducation} editMode={editMode} />,
    },
    projects: {
      title: t("nav.projects"),
      content: <Projects projects={projects} setProjects={setProjects} editMode={editMode} />,
    },
    experience: {
      title: t("nav.experience"),
      content: (
        <ExperienceGrid
          experience={experience}
          setExperience={setExperience}
          editMode={editMode}
          locale={i18n.language}
          exportMode={exportMode}
        />
      ),
    },
    languages: {
      title: t("nav.languages"),
      content: (
        <LanguagesRings
          languages={languages}
          setLanguages={setLanguages}
          editMode={editMode}
          locale={i18n.language}
        />
      ),
    },
  };

  const delays = {
    skills: 0.05,
    languages: 0.1,
    experience: 0.15,
    projects: 0.2,
    education: 0.25,
  };

  const moveCard = (currentLayout, activeId, overId) => {
    const activeContainer = findContainer(currentLayout, activeId);
    const overContainer = findContainer(currentLayout, overId);

    if (!activeContainer || !overContainer) return currentLayout;

    if (activeContainer === overContainer) {
      const items = currentLayout[activeContainer];
      const oldIndex = items.indexOf(activeId);
      const newIndex = overId === overContainer ? items.length - 1 : items.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return currentLayout;

      return {
        ...currentLayout,
        [activeContainer]: arrayMove(items, oldIndex, newIndex),
      };
    }

    const sourceItems = [...currentLayout[activeContainer]];
    const targetItems = [...currentLayout[overContainer]];
    const sourceIndex = sourceItems.indexOf(activeId);
    const targetIndex = overId === overContainer ? targetItems.length : targetItems.indexOf(overId);

    if (sourceIndex === -1) return currentLayout;

    sourceItems.splice(sourceIndex, 1);
    targetItems.splice(targetIndex, 0, activeId);

    return {
      ...currentLayout,
      [activeContainer]: sourceItems,
      [overContainer]: targetItems,
    };
  };

  const onDragEnd = ({ active, over }) => {
    if (!editMode || !over) return;
    setLayout((current) => moveCard(normalizeLayout(current), active.id, over.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div
        className={`cv-layout-grid grid gap-4 items-start ${
          exportMode
            ? "grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)]"
            : "grid-cols-1 lg:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)]"
        }`}
      >
        <Column
          id="left"
          items={normalizedLayout.left}
          cards={cards}
          delays={delays}
          editMode={editMode}
          disableMotion={disableMotion}
          sectionVisibility={sectionVisibility}
          onToggleSection={onToggleSection}
          onResetSection={onResetSection}
        />
        <Column
          id="right"
          items={normalizedLayout.right}
          cards={cards}
          delays={delays}
          editMode={editMode}
          disableMotion={disableMotion}
          sectionVisibility={sectionVisibility}
          onToggleSection={onToggleSection}
          onResetSection={onResetSection}
        />
      </div>
    </DndContext>
  );
}

function Column({ id, items, cards, delays, editMode, disableMotion, sectionVisibility, onToggleSection, onResetSection }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const visibleItems = items.filter((itemId) => sectionVisibility?.[itemId] ?? true);

  return (
    <SortableContext items={visibleItems} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={`min-h-[120px] space-y-4 rounded-3xl transition-colors ${editMode && isOver ? "bg-[rgba(123,132,214,.06)]" : ""}`}
      >
        {visibleItems.map((itemId) => {
          const card = cards[itemId];
          const node = (
            <SortableItem key={itemId} id={itemId} editMode={editMode}>
              <SectionCard
                title={card.title}
                editMode={editMode}
                onHide={() => onToggleSection(itemId)}
                onReset={() => onResetSection(itemId)}
              >
                {card.content}
              </SectionCard>
            </SortableItem>
          );

          return editMode || disableMotion ? node : (
            <MotionSection key={itemId} delay={delays[itemId] ?? 0}>
              {node}
            </MotionSection>
          );
        })}
      </div>
    </SortableContext>
  );
}

function SortableItem({ id, children, editMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
    zIndex: isDragging ? 20 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {editMode ? (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute -top-3 right-3 z-10 cursor-grab active:cursor-grabbing text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--panel)] shadow-soft"
          title="Drag to reorder"
        >
          Drag
        </button>
      ) : null}
      {children}
    </div>
  );
}
