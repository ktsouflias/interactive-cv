import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SectionCard from "./SectionCard";
import SkillBars from "./SkillBars";
import Degrees from "./Degrees";
import ExperienceGrid from "./ExperienceGrid";
import LanguagesRings from "./LanguagesRings";
import Projects from "./Projects";
import { useTranslation } from "react-i18next";
import MotionSection from "./MotionSection";

const DEFAULT_ORDER = ["skills", "education", "experience", "languages", "projects"];

export function getDefaultOrder() {
  return DEFAULT_ORDER;
}

export default function DraggableLayout({ order, setOrder, editMode }) {
  const { t } = useTranslation();

  const cards = {
    skills: (
      <SectionCard title={t("nav.skills")}>
        <SkillBars />
      </SectionCard>
    ),
    education: (
      <SectionCard title={t("nav.education")}>
        <Degrees />
      </SectionCard>
    ),
    experience: (
      <SectionCard title={t("nav.experience")}>
        <ExperienceGrid />
      </SectionCard>
    ),
    languages: (
      <SectionCard title={t("nav.languages")}>
        <LanguagesRings />
      </SectionCard>
    ),
    projects: (
      <SectionCard title={t("nav.projects")}>
        <Projects />
      </SectionCard>
    ),
  };

  const onDragEnd = ({ active, over }) => {
    if (!editMode) return;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);
    setOrder(arrayMove(order, oldIndex, newIndex));
  };

  // Stagger delays (feel free to tweak)
  const delays = {
    skills: 0.05,
    education: 0.10,
    projects: 0.12,
    experience: 0.16,
    languages: 0.20,
  };

  // Helper: wrap children with MotionSection only when NOT in edit mode
  const maybeMotion = (id, node) => {
    if (editMode) return node;
    return <MotionSection delay={delays[id] ?? 0}>{node}</MotionSection>;
  };

  return (
  <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
    <SortableContext items={order} strategy={verticalListSortingStrategy}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-4">
          <MotionSection delay={0.1}>
            <SortableItem id="skills" editMode={editMode}>
              {cards.skills}
            </SortableItem>
          </MotionSection>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <MotionSection delay={0.2}>
              <SortableItem id="education" editMode={editMode}>
                {cards.education}
              </SortableItem>
            </MotionSection>

            <MotionSection delay={0.3}>
              <SortableItem id="projects" editMode={editMode}>
                {cards.projects}
              </SortableItem>
            </MotionSection>

          </div>

          <MotionSection delay={0.4}>
            <SortableItem id="experience" editMode={editMode}>
              {cards.experience}
            </SortableItem>
          </MotionSection>

          <MotionSection delay={0.5}>
            <SortableItem id="languages" editMode={editMode}>
              {cards.languages}
            </SortableItem>
          </MotionSection>

        </div>
      </div>
    </SortableContext>
  </DndContext>
);

}

function SortableItem({ id, children, editMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {editMode ? (
        <button
          {...attributes}
          {...listeners}
          className="absolute -top-3 right-3 z-10 text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--panel)] shadow-soft"
          title="Drag to reorder"
        >
          Drag
        </button>
      ) : null}

      {children}
    </div>
  );
}
