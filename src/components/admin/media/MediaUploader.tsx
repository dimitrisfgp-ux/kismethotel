'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
// Native drag and drop used instead of react-dropzone to avoid dependencies
import { Loader2, Upload, FileVideo, FileImage, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/contexts/ToastContext';
import { Input } from "@/components/ui/Input";
import { usePermission } from '@/contexts/PermissionContext';

// NOTE: We might not have react-dropzone installed. 
// I will implement a custom drop zone to avoid dependency issues if possible, 
// or use a simple file input hidden behind a label.

interface MediaUploaderProps {
    onUploadComplete?: (media: any) => void;
    bucket?: string;
    folder?: string;
    acceptedTypes?: { [key: string]: string[] };
    maxSizeMB?: number;
}

// ... props ...
export function MediaUploader({
    onUploadComplete,
    bucket = 'hotel-media',
    folder: initialFolder = 'uploads',
    acceptedTypes = {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        'video/*': ['.mp4', '.webm']
    },
    maxSizeMB = 50
}: MediaUploaderProps) {
    const { can } = usePermission();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [folder, setFolder] = useState(initialFolder); // Editable folder
    const { showToast } = useToast();
    const supabase = createClient();

    if (!can('media.upload')) {
        return (
            <div className="w-full p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
                <p>You do not have permission to upload media.</p>
            </div>
        );
    }

    const uploadFile = async (file: File, subPath: string = '') => {
        if (!file) return;


        if (acceptedTypes) {
            const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
            const typeGroup = Object.keys(acceptedTypes).find(group =>
                acceptedTypes[group].includes(fileExt)
            );
            if (!typeGroup) {
                // simplify check for now or skip
            }
        }

        setUploading(true);
        // fake progress
        setProgress(10);

        try {
            // Upload to Storage (use dynamic 'folder' state)
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Sanitize folder path (remove leading/trailing slashes)
            const cleanFolder = folder.replace(/^\/+|\/+$/g, '') || 'uploads';

            // Combine user-defined folder with dragged structure
            const fullFolder = subPath ? `${cleanFolder}/${subPath.replace(/\/$/, '')}` : cleanFolder;
            const storagePath = `${fullFolder}/${fileName}`;



            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(storagePath, file, { upsert: false });

            if (uploadError) {
                console.error('❌ Storage Upload Failed:', uploadError);
                throw createError('Storage Upload Failed', uploadError);
            }


            // Get Public URL
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(storagePath);

            // Determine Media Type
            const isVideo = file.type.startsWith('video/');
            const mediaType = isVideo ? 'video' : 'image';

            // Get Dimensions (if image)
            let dimensions = { width: 0, height: 0 };
            if (!isVideo) {
                dimensions = await getImageDimensions(file);
            }

            // Save Metadata to DB
            const { data: mediaAsset, error: dbError } = await supabase
                .from('media_assets')
                .insert({
                    filename: fileName,
                    original_filename: file.name,
                    storage_path: storagePath,
                    url: publicUrl,
                    bucket,
                    folder: fullFolder,
                    media_type: mediaType,
                    mime_type: file.type,
                    size_bytes: file.size,
                    width: dimensions.width || null,
                    height: dimensions.height || null
                })
                .select()
                .single();

            if (dbError) {
                console.error('❌ Database Insert Failed:', dbError);
                throw createError('Database Insert Failed', dbError);
            }


            showToast('Upload successful', 'success');
            if (onUploadComplete) onUploadComplete(mediaAsset);

        } catch (error: any) {
            console.error(error); // Keep simple error log
            showToast(error.message || 'Upload failed', 'error');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const createError = (stage: string, originalError: any) => {
        const err = new Error(`${stage}: ${originalError.message}`);
        (err as any).original = originalError;
        return err;
    };

    const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 0, height: 0 });
            img.src = URL.createObjectURL(file);
        });
    };

    // Drag Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const items = e.dataTransfer.items;
        if (!items) return;

        const files: { file: File; path: string }[] = [];
        const queue: Promise<void>[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const entry = (item as any).webkitGetAsEntry ? (item as any).webkitGetAsEntry() : null;

            if (entry) {
                queue.push(scanFiles(entry, files));
            } else if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file) files.push({ file, path: '' });
            }
        }

        await Promise.all(queue);
        handleFiles(files);
    };

    // Recursive directory scanner
    const scanFiles = async (entry: any, fileList: { file: File; path: string }[], path = '') => {
        if (entry.isFile) {
            return new Promise<void>((resolve) => {
                entry.file((file: File) => {
                    fileList.push({ file, path });
                    resolve();
                });
            });
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const readEntries = async () => {
                const entries = await new Promise<any[]>((resolve, reject) => {
                    reader.readEntries(resolve, reject);
                });

                if (entries.length > 0) {
                    await Promise.all(entries.map((child: any) => scanFiles(child, fileList, `${path}${entry.name}/`)));
                    await readEntries(); // Continue reading (readEntries returns max 100 items)
                }
            };
            await readEntries();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const files = Array.from(e.target.files).map(file => ({ file, path: '' }));
            handleFiles(files);
        }
    };

    // Process files
    const handleFiles = (files: { file: File; path: string }[]) => {
        files.forEach(({ file, path }) => uploadFile(file, path));
    };

    return (
        <div className="w-full space-y-4">
            <Input
                label="Target Folder"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="uploads"
                className="max-w-xs"
            />
            <div
                className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${dragActive ? 'border-[var(--color-aegean-blue)] bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
                    ${uploading ? 'opacity-50 pointer-events-none' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="hidden"
                    id="media-upload"
                    onChange={handleChange}
                    accept="image/*,video/*"
                />

                <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center">
                    {uploading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-[var(--color-aegean-blue)] animate-spin mb-3" />
                            <p className="text-sm font-semibold text-[var(--color-charcoal)]">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-[var(--color-aegean-blue)]" />
                            </div>
                            <p className="text-lg font-medium text-[var(--color-charcoal)] mb-1">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">
                                Images (JPG, PNG, WebP) or Videos (MP4, WebM)
                            </p>
                        </>
                    )}
                </label>
            </div>
        </div>
    );
}
