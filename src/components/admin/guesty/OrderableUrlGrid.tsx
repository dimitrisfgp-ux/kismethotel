'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Play, ImagePlus, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

function youtubeId(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]+)/);
    return m ? m[1] : null;
}

interface OrderableUrlGridProps {
    urls: string[];
    onChange: (urls: string[]) => void;
    disabled?: boolean;
    /** When provided, renders a dashed "add image" tile at the end of the grid. */
    onAdd?: () => void;
    /** When provided, renders a dashed "add YouTube" tile at the end of the grid. */
    onAddYoutube?: () => void;
}

/**
 * Reorderable grid of gallery URLs (images or YouTube links). Native HTML5
 * drag-and-drop; YouTube links show their thumbnail with a play badge.
 */
export function OrderableUrlGrid({ urls, onChange, disabled, onAdd, onAddYoutube }: OrderableUrlGridProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const move = (from: number, to: number) => {
        if (from === to || from < 0 || to < 0) return;
        const next = urls.slice();
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
    };
    const remove = (i: number) => onChange(urls.filter((_, idx) => idx !== i));

    const showAddTiles = !disabled && (onAdd || onAddYoutube);

    // Nothing to show and no way to add → the plain empty hint.
    if (urls.length === 0 && !showAddTiles) {
        return <p className="text-xs text-[var(--color-charcoal)]/40 italic">No gallery images yet.</p>;
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {urls.map((u, i) => {
                const yt = youtubeId(u);
                const thumb = yt ? `https://img.youtube.com/vi/${yt}/mqdefault.jpg` : u;
                return (
                    <div
                        key={`${u}-${i}`}
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
                            'group relative aspect-square rounded-md overflow-hidden border bg-gray-100 transition-all',
                            i === 0 ? 'border-[var(--color-accent-gold)]' : 'border-gray-200',
                            overIndex === i && dragIndex !== null && dragIndex !== i ? 'ring-2 ring-[var(--color-aegean-blue)]' : '',
                            dragIndex === i ? 'opacity-40' : '',
                            disabled ? '' : 'cursor-grab active:cursor-grabbing'
                        )}
                    >
                        <Image src={thumb} alt="" fill className="object-cover pointer-events-none" sizes="15vw" />
                        {yt && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                <Play className="w-5 h-5 text-white fill-current" />
                            </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                            {i + 1}
                        </div>
                        {!disabled && (
                            <button
                                type="button"
                                title="Remove"
                                onClick={() => remove(i)}
                                className="absolute top-1 right-1 p-1 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                );
            })}

            {onAdd && !disabled && (
                <button
                    type="button"
                    onClick={onAdd}
                    title="Add image"
                    className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--color-aegean-blue)] hover:text-[var(--color-aegean-blue)] transition-colors"
                >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px] mt-1 font-medium">Image</span>
                </button>
            )}

            {onAddYoutube && !disabled && (
                <button
                    type="button"
                    onClick={onAddYoutube}
                    title="Add YouTube video"
                    className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                    <Youtube className="w-5 h-5" />
                    <span className="text-[10px] mt-1 font-medium">YouTube</span>
                </button>
            )}
        </div>
    );
}
