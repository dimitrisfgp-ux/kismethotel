'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { Loader2, Trash2, Check, ExternalLink, Film, X } from 'lucide-react';
import { PaginationControls } from '@/components/ui/admin/PaginationControls';
import { useToast } from '@/contexts/ToastContext';
import { MediaAsset } from '@/types';
import { format } from 'date-fns';

interface MediaGalleryProps {
    onSelect?: (media: MediaAsset) => void;
    selectable?: boolean;
    filterType?: 'all' | 'image' | 'video';
    initialSelection?: string[]; // IDs of selected items
}

export function MediaGallery({
    onSelect,
    selectable = false,
    filterType = 'all',
    initialSelection = []
}: MediaGalleryProps) {
    const [media, setMedia] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'image' | 'video'>(filterType);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);

    const { showToast } = useToast();
    const supabase = createClient();

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    useEffect(() => {
        fetchMedia();
    }, [filter, currentPage, pageSize]);

    async function fetchMedia() {
        setLoading(true);
        try {
            const from = (currentPage - 1) * pageSize;
            const to = from + pageSize - 1;

            let query = supabase
                .from('media_assets')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);

            if (filter !== 'all') {
                query = query.eq('media_type', filter);
            }

            const { data, error, count } = await query;
            if (error) throw error;

            setTotalItems(count || 0);

            // Map raw data to MediaAsset type (ensure type safety)
            const assets: MediaAsset[] = (data || []).map(item => ({
                id: item.id,
                filename: item.filename,
                originalFilename: item.original_filename,
                storagePath: item.storage_path,
                url: item.url,
                bucket: item.bucket,
                folder: item.folder,
                mediaType: item.media_type as 'image' | 'video',
                mimeType: item.mime_type,
                sizeBytes: item.size_bytes,
                width: item.width,
                height: item.height,
                altText: item.alt_text,
                caption: item.caption,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            }));

            setMedia(assets);
        } catch (error) {
            console.error(error);
            showToast('Failed to load media', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(e: React.MouseEvent, asset: MediaAsset) {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            // Delete from Storage
            const { error: storageError } = await supabase.storage
                .from(asset.bucket)
                .remove([asset.storagePath]);

            if (storageError) throw storageError;

            // Delete from DB
            const { error: dbError } = await supabase
                .from('media_assets')
                .delete()
                .eq('id', asset.id);

            if (dbError) throw dbError;

            showToast('File deleted', 'success');
            setMedia(prev => prev.filter(m => m.id !== asset.id));
        } catch (error: any) {
            console.error(error);
            showToast('Failed to delete file', 'error');
        }
    }

    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    // ... existing state ...

    // ... useEffect ...

    // ... fetchMedia ...

    // Derive Folders
    const folders = ['all', ...Array.from(new Set(media.map(m => m.folder || 'uploads'))).sort()];

    // Filtered Media
    const filteredMedia = media.filter(m => {
        if (selectedFolder !== 'all' && (m.folder || 'uploads') !== selectedFolder) return false;
        return true;
    });

    // ... handleDelete ...

    // Lightbox State
    const [lightboxAsset, setLightboxAsset] = useState<MediaAsset | null>(null);

    // ... handle delete ...

    return (
        <div className="space-y-4">
            {/* Filters ... */}

            {/* ... Filters JSX ... */}
            <div className="flex flex-col gap-4 pb-4 border-b border-gray-100">
                {/* Folder Filters */}
                <div className="flex gap-2 flex-wrap">
                    {folders.map(folder => (
                        <button
                            key={folder}
                            type="button"
                            onClick={() => setSelectedFolder(folder)}
                            className={`
                                px-3 py-1 rounded-full text-xs font-semibold
                                ${selectedFolder === folder
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                            `}
                        >
                            {folder === 'all' ? 'All Folders' : `📂 ${folder}`}
                        </button>
                    ))}
                </div>

                {/* Type Filters */}
                <div className="flex gap-2">
                    {(['all', 'image', 'video'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setFilter(t)}
                            className={`
                                px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                                ${filter === t
                                    ? 'bg-[var(--color-aegean-blue)] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                            `}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}s
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[var(--color-aegean-blue)] animate-spin" />
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p>No media found in this folder.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredMedia.map(asset => {
                        const isSelected = initialSelection.includes(asset.id);
                        return (
                            <div
                                key={asset.id}
                                onClick={() => {
                                    if (selectable && onSelect) {
                                        onSelect(asset);
                                    } else {
                                        setLightboxAsset(asset);
                                    }
                                }}
                                className={`
                                    group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border transition-all cursor-pointer
                                    ${isSelected ? 'ring-4 ring-[var(--color-aegean-blue)] border-transparent' : 'border-gray-200 hover:border-[var(--color-aegean-blue)]'}
                                `}
                            >
                                {asset.mediaType === 'image' ? (
                                    <Image
                                        src={asset.url}
                                        alt={asset.altText || asset.originalFilename}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                                        <Film className="w-8 h-8 opacity-50" />
                                        <video
                                            src={asset.url}
                                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                                            muted
                                            loop
                                            onMouseOver={e => (e.target as HTMLVideoElement).play()}
                                            onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                                        />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 pointer-events-none">
                                    <div className="flex justify-end gap-2 pointer-events-auto">
                                        {/* View Button (for selectable mode) */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLightboxAsset(asset);
                                            }}
                                            className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-sm"
                                            title="View Full Size"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(e, asset)}
                                            className="p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-xs text-white truncate drop-shadow-md">
                                        {asset.originalFilename}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="absolute top-2 left-2 bg-[var(--color-aegean-blue)] text-white rounded-full p-1 shadow-lg">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && media.length > 0 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalItems / pageSize)}
                    totalItems={totalItems}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setPageSize}
                />
            )}

            {/* Lightbox Modal */}
            {lightboxAsset && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center animate-in fade-in duration-200"
                    onClick={() => setLightboxAsset(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                        onClick={() => setLightboxAsset(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div
                        className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                        onClick={e => e.stopPropagation()}
                    >
                        {lightboxAsset.mediaType === 'image' ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={lightboxAsset.url}
                                    alt={lightboxAsset.altText || lightboxAsset.originalFilename}
                                    fill
                                    className="object-contain"
                                    sizes="90vw"
                                    priority
                                />
                            </div>
                        ) : (
                            <video
                                src={lightboxAsset.url}
                                controls
                                autoPlay
                                className="max-w-full max-h-full"
                            />
                        )}

                        {/* Metadata Footer */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm">
                            {lightboxAsset.originalFilename} • {(lightboxAsset.sizeBytes / 1024).toFixed(1)} KB
                            {lightboxAsset.width && ` • ${lightboxAsset.width}x${lightboxAsset.height}`}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
