'use client';

import { useState } from 'react';
import { OrderableMediaGrid, type GridMedia } from './OrderableMediaGrid';
import { MediaPickerModal } from '@/components/admin/media/MediaPickerModal';
import { setCategoryMediaAction, updateCategoryAction } from '@/app/actions/guesty';
import { useToast } from '@/contexts/ToastContext';
import { usePermission } from '@/contexts/PermissionContext';
import type { AdminGuestyCategory } from '@/services/guestyContentService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function HomepageEditor({ initialCategories }: { initialCategories: AdminGuestyCategory[] }) {
    const [categories, setCategories] = useState<AdminGuestyCategory[]>(initialCategories);
    const [pickerCat, setPickerCat] = useState<string | null>(null);
    const { showToast } = useToast();
    const { can } = usePermission();
    const editable = can('content.pages');

    const updateLocal = (catId: string, fn: (c: AdminGuestyCategory) => AdminGuestyCategory) =>
        setCategories((prev) => prev.map((c) => (c.id === catId ? fn(c) : c)));

    const persistMedia = async (catId: string, media: GridMedia[]) => {
        updateLocal(catId, (c) => ({ ...c, media }));
        try {
            await setCategoryMediaAction(catId, media.map((m) => m.id));
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Failed to save images', 'error');
        }
    };

    const handleReorder = (catId: string, orderedIds: string[]) => {
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return;
        const byId = new Map(cat.media.map((m) => [m.id, m]));
        const media = orderedIds.map((id) => byId.get(id)).filter((m): m is GridMedia => !!m);
        persistMedia(catId, media);
    };

    const handleRemove = (catId: string, id: string) => {
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return;
        persistMedia(catId, cat.media.filter((m) => m.id !== id));
    };

    const handleAddSelected = (catId: string, asset: { id: string; url: string }) => {
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return;
        if (cat.media.some((m) => m.id === asset.id)) {
            showToast('That image is already in this category', 'error');
            return;
        }
        persistMedia(catId, [...cat.media, { id: asset.id, url: asset.url }]);
    };

    const handleSaveDetails = async (cat: AdminGuestyCategory) => {
        try {
            await updateCategoryAction(cat.id, {
                title: cat.title,
                subtitle: cat.subtitle,
                description: cat.description,
                guestyUrl: cat.guestyUrl,
                layout: cat.layout,
            });
            showToast('Details saved', 'success');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Failed to save details', 'error');
        }
    };

    return (
        <div className="space-y-10">
            {categories.map((cat) => (
                <section
                    key={cat.id}
                    className="bg-white border border-[var(--color-sand)] rounded-lg p-5 md:p-6 space-y-5"
                >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <h2 className="text-lg font-bold text-[var(--color-aegean-blue)] font-montserrat">
                            {cat.title || cat.slug}
                        </h2>
                        <span className="text-xs text-gray-400">
                            {cat.media.length} image{cat.media.length === 1 ? '' : 's'} · drag to reorder · first = cover
                        </span>
                    </div>

                    <OrderableMediaGrid
                        media={cat.media}
                        disabled={!editable}
                        onReorder={(ids) => handleReorder(cat.id, ids)}
                        onRemove={(id) => handleRemove(cat.id, id)}
                        onAdd={() => setPickerCat(cat.id)}
                    />

                    {editable && (
                        <details className="group">
                            <summary className="cursor-pointer text-sm font-semibold text-[var(--color-charcoal)]/70 hover:text-[var(--color-charcoal)]">
                                Edit details
                            </summary>
                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Title"
                                    value={cat.title}
                                    onChange={(e) => updateLocal(cat.id, (c) => ({ ...c, title: e.target.value }))}
                                />
                                <Input
                                    label="Subtitle"
                                    value={cat.subtitle}
                                    onChange={(e) => updateLocal(cat.id, (c) => ({ ...c, subtitle: e.target.value }))}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Reserve URL (Guesty)"
                                        value={cat.guestyUrl}
                                        onChange={(e) => updateLocal(cat.id, (c) => ({ ...c, guestyUrl: e.target.value }))}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={cat.description}
                                        onChange={(e) => updateLocal(cat.id, (c) => ({ ...c, description: e.target.value }))}
                                        rows={3}
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--color-aegean-blue)] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                                        Layout
                                    </label>
                                    <select
                                        value={cat.layout}
                                        onChange={(e) =>
                                            updateLocal(cat.id, (c) => ({
                                                ...c,
                                                layout: e.target.value as 'image-left' | 'image-right',
                                            }))
                                        }
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                    >
                                        <option value="image-left">Image left</option>
                                        <option value="image-right">Image right</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <Button type="button" onClick={() => handleSaveDetails(cat)}>
                                        Save details
                                    </Button>
                                </div>
                            </div>
                        </details>
                    )}
                </section>
            ))}

            <MediaPickerModal
                isOpen={pickerCat !== null}
                onClose={() => setPickerCat(null)}
                onSelect={(asset) => {
                    if (pickerCat) handleAddSelected(pickerCat, { id: asset.id, url: asset.url });
                }}
                providerScope={['public', 'r2']}
                uploadVariant="guesty-r2"
                filterType="image"
            />
        </div>
    );
}
