"use client";

import { useState } from "react";
import { PageContent } from "@/types";
// import { contentService } from "@/services/contentService";
import { updatePageContentAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/admin/TextArea";
import { useToast } from "@/contexts/ToastContext";
import { Save } from "lucide-react";

interface PageContentFormProps {
    initialContent: PageContent;
}

export function PageContentForm({ initialContent }: PageContentFormProps) {
    const [content, setContent] = useState<PageContent>(initialContent);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
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

    return (
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

                    <Input
                        label="Poster Image URL"
                        value={content.hero.poster || ''}
                        onChange={(e) => updateHero('poster', e.target.value)}
                        placeholder="/images/frame-1.webp"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="iOS Video URL"
                            value={content.hero.videos?.ios || ''}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                hero: {
                                    ...prev.hero,
                                    videos: { ...prev.hero.videos, ios: e.target.value }
                                }
                            }))}
                            placeholder="/Videos/ios/hero-ios.mp4"
                        />
                        <Input
                            label="Android Video URL"
                            value={content.hero.videos?.android || ''}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                hero: {
                                    ...prev.hero,
                                    videos: { ...prev.hero.videos, android: e.target.value }
                                }
                            }))}
                            placeholder="/Videos/android/hero-android.mp4"
                        />
                        <Input
                            label="Desktop Video URL"
                            value={content.hero.videos?.desktop || ''}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                hero: {
                                    ...prev.hero,
                                    videos: { ...prev.hero.videos, desktop: e.target.value }
                                }
                            }))}
                            placeholder="/Videos/desktop/hero-desktop.mp4"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
