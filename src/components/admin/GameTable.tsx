"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import DeleteRowButton from "@/components/admin/DeleteRowButton";
import StatusBadge from "@/components/admin/StatusBadge";
import type { DbGame } from "@/lib/supabase/database.types";

type GameTableProps = {
  games: DbGame[];
  sortable?: boolean;
  onReorder?: (ids: string[]) => Promise<void>;
  onDelete: (formData: FormData) => void | Promise<void>;
};

export default function GameTable({ games, sortable = false, onReorder, onDelete }: GameTableProps) {
  const [order, setOrder] = useState(games);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [prevGames, setPrevGames] = useState(games);
  if (prevGames !== games) {
    setPrevGames(games);
    setOrder(games);
  }

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return;

    const next = [...order];
    const fromIndex = next.findIndex((game) => game.id === draggingId);
    const toIndex = next.findIndex((game) => game.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrder(next);
    setDraggingId(null);

    startTransition(async () => {
      await onReorder?.(next.map((game) => game.id));
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {sortable ? (
        <p className="text-xs text-faint">
          {pending ? "Salvando ordem…" : "Arraste as linhas para mudar a ordem em que os jogos aparecem no site."}
        </p>
      ) : null}
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-faint">
            <tr>
              {sortable ? <th className="w-10 px-4 py-3" aria-label="Arrastar" /> : null}
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Gênero</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {order.map((game) => (
              <tr
                key={game.id}
                draggable={sortable}
                onDragStart={sortable ? () => setDraggingId(game.id) : undefined}
                onDragEnd={sortable ? () => setDraggingId(null) : undefined}
                onDragOver={sortable ? (event) => event.preventDefault() : undefined}
                onDrop={sortable ? () => handleDrop(game.id) : undefined}
                className={
                  "border-b border-border last:border-b-0" +
                  (sortable ? " cursor-grab active:cursor-grabbing" : "") +
                  (draggingId === game.id ? " bg-brand/5 opacity-70" : "")
                }
              >
                {sortable ? (
                  <td className="px-4 py-4 text-faint" aria-hidden="true">
                    ⠿
                  </td>
                ) : null}
                <td className="px-4 py-4">
                  <p className="font-medium">{game.title}</p>
                  <p className="text-xs text-faint">{game.team}</p>
                  {game.student_course ? <p className="text-xs text-faint">{game.student_course}</p> : null}
                  {game.student_email ? <p className="text-xs text-faint">{game.student_email}</p> : null}
                </td>
                <td className="px-4 py-4 text-muted">{game.genre}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={game.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-5">
                    <Link href={`/admin/jogos/${game.id}`} className="text-brand hover:underline">
                      {game.status === "pending" ? "Revisar" : "Editar"}
                    </Link>
                    <DeleteRowButton id={game.id} title={game.title} action={onDelete} />
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
