"use client";

import { useEffect, useState, useTransition } from "react";

export type SortableItem = {
  id: string;
  label: string;
  hint?: string;
};

type SortableListProps = {
  items: SortableItem[];
  onReorder: (ids: string[]) => Promise<void>;
  emptyMessage?: string;
};

export default function SortableList({ items, onReorder, emptyMessage }: SortableListProps) {
  const [order, setOrder] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setOrder(items);
  }, [items]);

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return;

    const next = [...order];
    const fromIndex = next.findIndex((item) => item.id === draggingId);
    const toIndex = next.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrder(next);
    setDraggingId(null);

    startTransition(async () => {
      await onReorder(next.map((item) => item.id));
    });
  }

  if (order.length === 0) {
    return emptyMessage ? <p className="text-sm text-muted">{emptyMessage}</p> : null;
  }

  return (
    <div className="flex flex-col gap-2">
      {pending ? <p className="text-xs text-faint">Salvando ordem…</p> : null}
      {order.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDraggingId(item.id)}
          onDragEnd={() => setDraggingId(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => handleDrop(item.id)}
          className={
            draggingId === item.id
              ? "flex cursor-grab items-center gap-4 border border-brand bg-brand/5 px-4 py-3 opacity-70"
              : "flex cursor-grab items-center gap-4 border border-border px-4 py-3 transition-colors hover:border-brand active:cursor-grabbing"
          }
        >
          <span className="w-6 text-xs text-faint">{index + 1}</span>
          <span className="text-faint" aria-hidden="true">
            ⠿
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{item.label}</p>
            {item.hint ? <p className="truncate text-xs text-muted">{item.hint}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
