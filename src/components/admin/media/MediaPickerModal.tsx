'use client';

import { useState } from 'react';
import { MediaGallery } from './MediaGallery';
import { MediaUploader } from './MediaUploader';
import { X, Image as ImageIcon, Upload } from 'lucide-react';
import { MediaAsset } from '@/types';

interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: MediaAsset) => void;
    acceptedTypes?: { [key: string]: string[] }; // Passed to uploader
    filterType?: 'all' | 'image' | 'video';
}

export function MediaPickerModal({ isOpen, onClose, onSelect, acceptedTypes, filterType = 'all' }: MediaPickerModalProps) {
    const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold font-montserrat text-[var(--color-aegean-blue)]">
                        Select Media
                    </h3>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab('library')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'library'
                            ? 'bg-white text-[var(--color-aegean-blue)] border-b-2 border-[var(--color-aegean-blue)]'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <ImageIcon className="w-4 h-4" /> Media Library
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'upload'
                            ? 'bg-white text-[var(--color-aegean-blue)] border-b-2 border-[var(--color-aegean-blue)]'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Upload className="w-4 h-4" /> Upload New
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white min-h-[400px]">
                    {activeTab === 'library' ? (
                        <MediaGallery
                            selectable={true}
                            filterType={filterType}
                            onSelect={(media) => {
                                onSelect(media);
                                onClose();
                            }}
                        />
                    ) : (
                        <div className="max-w-xl mx-auto py-8">
                            <MediaUploader
                                acceptedTypes={acceptedTypes}
                                onUploadComplete={(media) => {
                                    // Switch to library to show it, or just select it immediately?
                                    // Let's select it immediately for convenience
                                    onSelect(media);
                                    onClose();
                                }}
                            />
                            <div className="mt-8 text-center text-sm text-gray-500">
                                <p>Files are securely stored in the cloud.</p>
                                <p>Supported formats: JPG, PNG, WebP, MP4, WebM</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
