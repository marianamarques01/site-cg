"use client";

import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";
import DeleteRowButton from "@/components/admin/DeleteRowButton";

export type AdminListRow = {
  id: string;
  /** Nome mostrado na confirmação de exclusão. */
  title: string;
  editHref: string;
  editLabel?: string;
  cells: ReactNode[];
};

type AdminListTableProps = {
  headers: string[];
  rows: AdminListRow[];
  sortable?: boolean;
  onReorder?: (ids: string[]) => Promise<void>;
  onDelete: (formData: FormData) => void | Promise<void>;
  minWidth?: string;
};

export default function AdminListTable({
  headers,
  rows,
  sortable = false,
  onReorder,
  onDelete,
  minWidth = "min-w-[640px]",
}: AdminListTableProps) {
  const [order, setOrder] = useState(rows);
  const [prevRows, setPrevRows] = useState(rows);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (prevRows !== rows) {
    setPrevRows(rows);
    setOrder(rows);
  }

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return;

    const next = [...order];
    const fromIndex = next.findIndex((row) => row.id === draggingId);
    const toIndex = next.findIndex((row) => row.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrder(next);
    setDraggingId(null);

    startTransition(async () => {
      await onReorder?.(next.map((row) => row.id));
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {sortable ? (
        <p className="text-xs text-faint">
          {pending ? "Salvando ordem…" : "Arraste as linhas para mudar a ordem em que aparecem no site."}
        </p>
      ) : null}
      <div className="overflow-x-auto border border-border">
        <table className={`w-full ${minWidth} text-left text-sm`}>
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-faint">
            <tr>
              {sortable ? <th className="w-10 px-4 py-3" aria-label="Arrastar" /> : null}
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {order.map((row) => (
              <tr
                key={row.id}
                draggable={sortable}
                onDragStart={sortable ? () => setDraggingId(row.id) : undefined}
                onDragEnd={sortable ? () => setDraggingId(null) : undefined}
                onDragOver={sortable ? (event) => event.preventDefault() : undefined}
                onDrop={sortable ? () => handleDrop(row.id) : undefined}
                className={
                  "border-b border-border last:border-b-0" +
                  (sortable ? " cursor-grab active:cursor-grabbing" : "") +
                  (draggingId === row.id ? " bg-brand/5 opacity-70" : "")
                }
              >
                {sortable ? (
                  <td className="px-4 py-4 text-faint" aria-hidden="true">
                    ⠿
                  </td>
                ) : null}
                {row.cells.map((cell, index) => (
                  <td key={index} className="px-4 py-4">
                    {cell}
                  </td>
                ))}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-5">
                    <Link href={row.editHref} className="text-brand hover:underline">
                      {row.editLabel ?? "Editar"}
                    </Link>
                    <DeleteRowButton id={row.id} title={row.title} action={onDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
