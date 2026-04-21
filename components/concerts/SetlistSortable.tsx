"use client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Setlist } from "@/lib/types";

interface Props {
  setlists: Setlist[];
  onChange: (next: Setlist[]) => void;
}

function Row({ setlist }: { setlist: Setlist }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: setlist.setlistFmId,
  });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
      className="border border-border rounded px-3 py-2 bg-bg flex items-center gap-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted hover:text-accent select-none"
        aria-label="Drag to reorder"
      >
        ⋮⋮
      </button>
      <div className="flex-1 text-sm">
        <div className="font-medium">{setlist.artist}</div>
        <div className="text-xs text-muted">{setlist.songs.length} songs</div>
      </div>
    </li>
  );
}

export default function SetlistSortable({ setlists, onChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const sorted = [...setlists].sort((a, b) => a.sortOrder - b.sortOrder);

  function handleEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((s) => s.setlistFmId === active.id);
    const newIndex = sorted.findIndex((s) => s.setlistFmId === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(sorted, oldIndex, newIndex).map((s, i) => ({ ...s, sortOrder: i }));
    onChange(reordered);
  }

  if (sorted.length === 0) {
    return <p className="text-muted text-sm">No setlists on this concert.</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEnd}>
      <SortableContext items={sorted.map((s) => s.setlistFmId)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {sorted.map((s) => (
            <Row key={s.setlistFmId} setlist={s} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
