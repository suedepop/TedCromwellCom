"use client";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Photo } from "@/lib/types";

interface Props {
  photos: Photo[];
  featuredId?: string;
  onReorder: (next: Photo[]) => void;
  onSelectFeatured: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function SortablePhotos({
  photos,
  featuredId,
  onReorder,
  onSelectFeatured,
  onRemove,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIndex = photos.findIndex((p) => p.id === e.active.id);
    const newIndex = photos.findIndex((p) => p.id === e.over!.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(photos, oldIndex, newIndex));
  }

  const effectiveFeaturedId = featuredId ?? photos[0]?.id;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((p) => (
            <SortablePhoto
              key={p.id}
              photo={p}
              isFeatured={effectiveFeaturedId === p.id}
              onSelectFeatured={onSelectFeatured}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortablePhoto({
  photo,
  isFeatured,
  onSelectFeatured,
  onRemove,
}: {
  photo: Photo;
  isFeatured: boolean;
  onSelectFeatured: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border rounded overflow-hidden ${isFeatured ? "border-accent ring-2 ring-accent/40" : "border-border"}`}
    >
      <img src={photo.thumbnailUrl} alt="" className="block w-full select-none pointer-events-none" />

      {/* Drag handle — top center */}
      <button
        type="button"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1/2 -translate-x-1/2 text-xs bg-black/60 text-white px-2 py-0.5 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
      >
        ⋮⋮
      </button>

      {/* Featured toggle */}
      <button
        type="button"
        onClick={() => onSelectFeatured(photo.id)}
        title={isFeatured ? "Featured — click to clear" : "Make featured"}
        className={`absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded ${
          isFeatured ? "bg-accent text-bg" : "bg-black/60 text-white opacity-0 group-hover:opacity-100"
        }`}
      >
        {isFeatured ? "★ Featured" : "★"}
      </button>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(photo.id)}
        className="absolute top-1 right-1 text-xs bg-red-600/80 text-white px-1.5 rounded opacity-0 group-hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
