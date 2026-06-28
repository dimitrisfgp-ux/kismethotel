'use client';

import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { uploadGuestyMediaAction } from '@/app/actions/media';
import { MediaAsset } from '@/types';

function readDimensions(file: File): Promise<{ w: number; h: number } | null> {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => resolve(null);
        img.src = URL.createObjectURL(file);
    });
}

export function GuestyMediaUploader({ onUploadComplete }: { onUploadComplete?: (m: MediaAsset) => void }) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const { showToast } = useToast();

    async function handleFile(file: File) {
        const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
        if (!isWebp) {
            showToast('Only WebP images are allowed — please convert it first.', 'error');
            return;
        }
        setUploading(true);
        try {
            const dims = await readDimensions(file);
            const fd = new FormData();
            fd.set('file', file);
            if (dims) {
                fd.set('width', String(dims.w));
                fd.set('height', String(dims.h));
            }
            const res = await uploadGuestyMediaAction(fd);
            if (res.success) {
                showToast('Image uploaded', 'success');
                onUploadComplete?.(res.asset);
            } else {
                showToast(res.error, 'error');
            }
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="w-full space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${dragActive ? 'border-[var(--color-aegean-blue)] bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
                    ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={onDrop}
            >
                <input
                    type="file"
                    className="hidden"
                    id="guesty-media-upload"
                    accept="image/webp,.webp"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
                />
                <label htmlFor="guesty-media-upload" className="cursor-pointer flex flex-col items-center">
                    {uploading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-[var(--color-aegean-blue)] animate-spin mb-3" />
                            <p className="text-sm font-semibold text-[var(--color-charcoal)]">Uploading…</p>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-[var(--color-aegean-blue)]" />
                            </div>
                            <p className="text-lg font-medium text-[var(--color-charcoal)] mb-1">Click to upload or drag &amp; drop</p>
                            <p className="text-sm text-gray-500"><strong>WebP only</strong></p>
                        </>
                    )}
                </label>
            </div>

            <div className="rounded-lg bg-[var(--color-warm-white)] border border-[var(--color-sand)] p-3 text-xs text-[var(--color-charcoal)]/70 space-y-1">
                <p className="font-semibold text-[var(--color-charcoal)]">Optimal image guidelines</p>
                <ul className="list-disc list-inside space-y-0.5">
                    <li>Format: <strong>WebP</strong> only (convert JPG/PNG before uploading)</li>
                    <li>Orientation: landscape, roughly <strong>3:2</strong></li>
                    <li>Resolution: ~<strong>2000 × 1333 px</strong></li>
                    <li>File size: under ~<strong>400 KB</strong> (2 MB hard limit)</li>
                </ul>
            </div>
        </div>
    );
}
