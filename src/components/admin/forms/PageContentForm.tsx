"use client";

import { useState } from "react";
import { PageContent, MediaAsset } from "@/types";
import { updatePageContentAction } from "@/app/actions/content";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/admin/TextArea";
import { useToast } from "@/contexts/ToastContext";
import { Save, Image as ImageIcon, Video, X } from "lucide-react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";

interface PageContentFormProps {
    initialContent: PageContent;
}

export function PageContentForm({ initialContent }: PageContentFormProps) {
    const [content, setContent] = useState<PageContent>(initialContent);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Media Picker State
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickingField, setPickingField] = useState<'poster' | 'ios' | 'android' | 'desktop' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        // ... same ...
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await updatePageContentAction(content);
            if (success) {
                showToast("Page content updated successfully", "success");
            } else {
                showToast("Failed to update content", "error");
            }
        } catch (_error) {
            showToast("An error occurred", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const updateHero = (field: keyof PageContent['hero'], value: string) => {
        setContent(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const openPicker = (field: 'poster' | 'ios' | 'android' | 'desktop') => {
        setPickingField(field);
        setIsPickerOpen(true);
    };

    const handleMediaSelect = (asset: MediaAsset) => {
        if (!pickingField) return;

        if (pickingField === 'poster') {
            updateHero('poster', asset.url);
        } else {
            setContent(prev => ({
                ...prev,
                hero: {
                    ...prev.hero,
                    videos: { ...prev.hero.videos, [pickingField]: asset.url }
                }
            }));
        }
        setIsPickerOpen(false);
    };

    const clearMedia = (field: 'poster' | 'ios' | 'android' | 'desktop') => {
        if (field === 'poster') {
            updateHero('poster', '');
        } else {
            setContent(prev => ({
                ...prev,
                hero: {
                    ...prev.hero,
                    videos: { ...prev.hero.videos, [field]: '' }
                }
            }));
        }
    };

    const renderMediaSlot = (label: string, field: 'poster' | 'ios' | 'android' | 'desktop', value: string, type: 'image' | 'video') => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative aspect-video w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden group hover:border-[var(--color-aegean-blue)] transition-colors">
                {value ? (
                    <>
                        {type === 'image' ? (
                            <Image src={value} alt={label} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                <Video className="w-8 h-8 text-white/50" />
                                <video src={value} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => clearMedia(field)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 text-white text-xs truncate rounded">
                            {value.split('/').pop()}
                        </div>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => openPicker(field)}
                        className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2"
                    >
                        {type === 'image' ? <ImageIcon className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                        <span className="text-xs">Select {label}</span>
                    </button>
                )}
            </div>
            {value && (
                <button
                    type="button"
                    onClick={() => openPicker(field)}
                    className="text-xs text-[var(--color-aegean-blue)] hover:underline"
                >
                    Change {label}
                </button>
            )}
        </div>
    );

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border border-[var(--color-sand)] shadow-sm mt-8">
                <div className="flex items-center justify-between border-b border-[var(--color-sand)] pb-4">
                    <h2 className="text-lg font-bold font-montserrat text-[var(--color-charcoal)]">Home Page Content</h2>
                    <Button type="submit" isLoading={isLoading} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-medium text-[var(--color-aegean-blue)] border-b pb-1">Hero Section</h3>

                        <Input
                            label="Hero Title"
                            value={content.hero.title}
                            onChange={(e) => updateHero('title', e.target.value)}
                            required
                        />

                        <TextArea
                            label="Hero Subtitle"
                            value={content.hero.subtitle}
                            onChange={(e) => updateHero('subtitle', e.target.value)}
                            rows={3}
                        />

                        <Input
                            label="CTA Text"
                            value={content.hero.ctaText}
                            onChange={(e) => updateHero('ctaText', e.target.value)}
                        />
                    </div>

                    {/* Hero Media Section */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-[var(--color-aegean-blue)] border-b pb-1">Hero Media</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderMediaSlot('Poster Image', 'poster', content.hero.poster || '', 'image')}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {renderMediaSlot('iOS Video', 'ios', content.hero.videos?.ios || '', 'video')}
                            {renderMediaSlot('Android Video', 'android', content.hero.videos?.android || '', 'video')}
                            {renderMediaSlot('Desktop Video', 'desktop', content.hero.videos?.desktop || '', 'video')}
                        </div>
                    </div>
                </div>
            </form>

            <MediaPickerModal
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={handleMediaSelect}
                filterType={pickingField === 'poster' ? 'image' : 'video'}
            />
        </>
    );
}
