'use client';

import { useState } from 'react';
import { Loader2, Film } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { createVideoUploadUrlAction, registerR2VideoAction } from '@/app/actions/media';
import { MediaAsset } from '@/types';

const MAX_VIDEO_BYTES = 25 * 1024 * 1024; // 25 MB

export function GuestyVideoUploader({ onUploadComplete }: { onUploadComplete?: (m: MediaAsset) => void }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const { showToast } = useToast();

    async function handleFile(file: File) {
        const contentType = file.type || 'video/mp4';
        if (!contentType.startsWith('video/')) {
            showToast('Please select a video file (MP4 or WebM).', 'error');
            return;
        }
        if (file.size > MAX_VIDEO_BYTES) {
            showToast('Video is too large (max 25 MB).', 'error');
            return;
        }

        setUploading(true);
        setProgress(0);
        try {
            const presign = await createVideoUploadUrlAction(contentType);
            if (!presign.success) {
                showToast(presign.error, 'error');
                return;
            }

            // Upload straight to R2 with progress.
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', presign.uploadUrl);
                xhr.setRequestHeader('Content-Type', contentType);
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
                };
                xhr.onload = () =>
                    xhr.status >= 200 && xhr.status < 300
                        ? resolve()
                        : reject(new Error(`Upload failed (${xhr.status})`));
                xhr.onerror = () => reject(new Error('Upload failed — check the R2 CORS policy.'));
                xhr.send(file);
            });

            const reg = await registerR2VideoAction({
                key: presign.key,
                originalFilename: file.name,
                sizeBytes: file.size,
                mimeType: contentType,
            });
            if (reg.success) {
                showToast('Video uploaded', 'success');
                onUploadComplete?.(reg.asset);
            } else {
                showToast(reg.error, 'error');
            }
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Upload failed', 'error');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }

    return (
        <div className="w-full space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${dragActive ? 'border-[var(--color-aegean-blue)] bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
                    ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            >
                <input
                    type="file"
                    className="hidden"
                    id="guesty-video-upload"
                    accept="video/mp4,video/webm"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
                />
                <label htmlFor="guesty-video-upload" className="cursor-pointer flex flex-col items-center">
                    {uploading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-[var(--color-aegean-blue)] animate-spin mb-3" />
                            <p className="text-sm font-semibold text-[var(--color-charcoal)]">Uploading… {progress}%</p>
                            <div className="w-48 h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-[var(--color-aegean-blue)] transition-all" style={{ width: `${progress}%` }} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                <Film className="w-6 h-6 text-[var(--color-aegean-blue)]" />
                            </div>
                            <p className="text-lg font-medium text-[var(--color-charcoal)] mb-1">Click to upload or drag &amp; drop</p>
                            <p className="text-sm text-gray-500">MP4 / WebM</p>
                        </>
                    )}
                </label>
            </div>

            <div className="rounded-lg bg-[var(--color-warm-white)] border border-[var(--color-sand)] p-3 text-xs text-[var(--color-charcoal)]/70 space-y-1">
                <p className="font-semibold text-[var(--color-charcoal)]">Optimal video guidelines</p>
                <ul className="list-disc list-inside space-y-0.5">
                    <li>Format: <strong>MP4 (H.264)</strong> — most compatible</li>
                    <li>Use 720p for the mobile clip, 1080p for desktop</li>
                    <li>Keep it short &amp; compressed — under ~<strong>10 MB</strong> for fast loads (25 MB hard limit)</li>
                </ul>
            </div>
        </div>
    );
}
