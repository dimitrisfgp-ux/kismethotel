'use client';

import { useState } from 'react';
import { MediaGallery } from '@/components/admin/media/MediaGallery';
import { MediaUploader } from '@/components/admin/media/MediaUploader';

// Let's make a nice layout.
// Header with "Media Library" and "Upload" button (which opens a drawer or modal? or just inline?)
// Inline uploader is nice for bulk.

export default function MediaLibraryPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-start border-b border-[var(--color-sand)] pb-6">
                <div>
                    <h1 className="text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Media Library</h1>
                    <p className="text-[var(--color-charcoal)]/60 mt-2">Manage all your images and videos in one place.</p>
                </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-sand)] shadow-sm">
                <h2 className="text-lg font-bold font-montserrat text-[var(--color-aegean-blue)] mb-4">Upload New Media</h2>
                <MediaUploader
                    onUploadComplete={() => {
                        setRefreshKey(prev => prev + 1);
                    }}
                />
            </div>

            {/* Gallery Area */}
            <div>
                <h2 className="text-lg font-bold font-montserrat text-[var(--color-aegean-blue)] mb-6">All Files</h2>
                <MediaGallery key={refreshKey} selectable={false} />
            </div>
        </div>
    );
}
