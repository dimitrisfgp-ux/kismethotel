import { RoomMedia, RoomMediaCategory, MediaAsset } from "@/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";

interface RoomMediaManagerProps {
    attachedMedia: RoomMedia[];
    getMediaByCategory: (cat: 'primary' | 'secondary' | 'gallery') => RoomMedia[];
    removeMedia: (id: string) => void;
    openPickerFor: (category: RoomMediaCategory) => void;

    // modal props
    isMediaPickerOpen: boolean;
    setIsMediaPickerOpen: (v: boolean) => void;
    pickingCategory: RoomMediaCategory | null;
    handleAddMediaToCategory: (asset: MediaAsset, cat: RoomMediaCategory) => void;
}

export function RoomMediaManager(props: RoomMediaManagerProps) {
    const {
        attachedMedia, getMediaByCategory, removeMedia, openPickerFor,
        isMediaPickerOpen, setIsMediaPickerOpen, pickingCategory, handleAddMediaToCategory
    } = props;

    return (
        <div className="space-y-6 md:space-y-8 bg-white p-3 md:p-6 rounded-lg border border-[var(--color-sand)] shadow-sm animate-in fade-in duration-300">

            {/* Primary Image Slot */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-1">
                    <h3 className="text-lg font-bold text-[var(--color-aegean-blue)]">Primary Image</h3>
                    <span className="text-xs text-gray-500">Appears in Hero background (Desktop)</span>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-center">
                    {(() => {
                        const primary = getMediaByCategory('primary')[0];
                        return primary ? (
                            <div className="relative aspect-video w-full max-w-2xl bg-gray-200 rounded-lg overflow-hidden group">
                                <Image src={primary.url} alt="Primary" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeMedia(primary.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Primary</div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => openPickerFor('primary')}
                                className="aspect-video w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            >
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <span className="font-medium">Select Primary Image</span>
                            </button>
                        );
                    })()}
                </div>
            </div>

            {/* Secondary Images Slots */}
            <div className="space-y-4 pt-6 border-t">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-1">
                    <h3 className="text-lg font-bold text-[var(--color-charcoal)]">Secondary Images</h3>
                    <span className="text-xs text-gray-500">Appear next to Hero (Desktop)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map(i => {
                        const secondaries = getMediaByCategory('secondary');
                        const item = secondaries[i];
                        return (
                            <div key={i} className="aspect-[4/3] bg-gray-50 border border-gray-200 rounded-lg relative group">
                                {item ? (
                                    <>
                                        <Image src={item.url} alt="Secondary" fill className="object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(item.id)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => openPickerFor('secondary')}
                                        className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                                    >
                                        <Plus className="w-8 h-8 mb-1" />
                                        <span className="text-xs font-medium">Add Secondary</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="space-y-4 pt-6 border-t">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[var(--color-charcoal)]">Gallery</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => openPickerFor('gallery')}>
                        <Plus className="h-4 w-4 mr-2" /> Add Photos
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {getMediaByCategory('gallery').map(m => (
                        <div key={m.id} className="aspect-square relative group rounded-lg overflow-hidden bg-gray-100">
                            <Image src={m.url} alt="Gallery" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => removeMedia(m.id)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => openPickerFor('gallery')}
                        className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                        <Plus className="w-8 h-8" />
                    </button>
                </div>
            </div>

            <MediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={(media) => pickingCategory && handleAddMediaToCategory(media, pickingCategory)}
            />
        </div>
    );
}
