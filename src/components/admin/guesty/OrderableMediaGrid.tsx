'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GridMedia {
    id: string;
    url: string;
}

interface OrderableMediaGridProps {
    media: GridMedia[];
    onReorder: (orderedIds: string[]) => void;
    onRemove: (id: string) => void;
    onAdd: () => void;
    disabled?: boolean;
}

/**
 * Native HTML5 drag-and-drop reorderable image grid. The first tile is the
 * cover; "Set as cover" moves a tile to index 0. No external dependencies.
 */
export function OrderableMediaGrid({ media, onReorder, onRemove, onAdd, disabled }: OrderableMediaGridProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const move = (from: number, to: number) => {
        if (from === to || from < 0 || to < 0) return;
        const next = media.slice();
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onReorder(next.map((m) => m.id));
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {media.map((m, i) => (
                <div
                    key={m.id}
                    draggable={!disabled}
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (overIndex !== i) setOverIndex(i);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (dragIndex !== null) move(dragIndex, i);
                        setDragIndex(null);
                        setOverIndex(null);
                    }}
                    onDragEnd={() => {
                        setDragIndex(null);
                        setOverIndex(null);
                    }}
                    className={cn(
                        'group relative aspect-square rounded-lg overflow-hidden border bg-gray-100 transition-all',
                        i === 0
                            ? 'border-[var(--color-accent-gold)] ring-2 ring-[var(--color-accent-gold)]/40'
                            : 'border-gray-200',
                        overIndex === i && dragIndex !== null && dragIndex !== i
                            ? 'ring-2 ring-[var(--color-aegean-blue)]'
                            : '',
                        dragIndex === i ? 'opacity-40' : '',
                        disabled ? '' : 'cursor-grab active:cursor-grabbing'
                    )}
                >
                    <Image src={m.url} alt="" fill className="object-cover pointer-events-none" sizes="20vw" />

                    {/* Cover badge */}
                    {i === 0 && (
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-[var(--color-accent-gold)] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shadow">
                            <Star className="w-3 h-3 fill-current" /> Cover
                        </div>
                    )}

                    {/* Order index */}
                    <div className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                        {i + 1}
                    </div>

                    {!disabled && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-start justify-end p-1.5 opacity-0 group-hover:opacity-100">
                            <div className="flex gap-1">
                                {i !== 0 && (
                                    <button
                                        type="button"
                                        title="Set as cover"
                                        onClick={() => move(i, 0)}
                                        className="p-1.5 bg-white/85 hover:bg-white text-[var(--color-accent-gold)] rounded-full"
                                    >
                                        <Star className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    title="Remove"
                                    onClick={() => onRemove(m.id)}
                                    className="p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {!disabled && (
                <button
                    type="button"
                    onClick={onAdd}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--color-aegean-blue)] hover:text-[var(--color-aegean-blue)] transition-colors"
                >
                    <Plus className="w-7 h-7" />
                    <span className="text-xs mt-1 font-medium">Add images</span>
                </button>
            )}
        </div>
    );
}
