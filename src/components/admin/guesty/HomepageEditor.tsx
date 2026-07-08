'use client';

import { useState } from 'react';
import { ChevronDown, Save } from 'lucide-react';
import { OrderableMediaGrid, type GridMedia } from './OrderableMediaGrid';
import { MediaPickerModal } from '@/components/admin/media/MediaPickerModal';
import { setCategoryMediaAction, updateCategoryAction } from '@/app/actions/guesty';
import { useToast } from '@/contexts/ToastContext';
import { usePermission } from '@/contexts/PermissionContext';
import type { AdminGuestyCategory } from '@/services/guestyContentService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Collapse } from '@/components/ui/Collapse';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
    cat: AdminGuestyCategory;
    editable: boolean;
    onReorder: (ids: string[]) => void;
    onRemove: (id: string) => void;
    onAdd: () => void;
    onField: (fn: (c: AdminGuestyCategory) => AdminGuestyCategory) => void;
    onSave: () => Promise<void>;
}

function CategoryCard({ cat, editable, onReorder, onRemove, onAdd, onField, onSave }: CategoryCardProps) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<'images' | 'details'>('images');
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setSaving(true);
        try {
            await onSave();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="border border-[var(--color-sand)] rounded-lg overflow-hidden bg-white">
            <div
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <span className="font-semibold text-[var(--color-aegean-blue)] font-montserrat truncate">{cat.title || cat.slug}</span>
                    {open && editable && (
                        <Button type="button" size="sm" onClick={handleSave} isLoading={saving} className="shrink-0 gap-1.5">
                            <Save className="w-4 h-4" /> Save
                        </Button>
                    )}
                </div>
                <span className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
                    {cat.media.length} image{cat.media.length === 1 ? '' : 's'}
                    <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
                </span>
            </div>

            <Collapse open={open}>
                <div className="border-t border-[var(--color-sand)] p-4">
                    <div className="flex gap-1 mb-4 border-b border-gray-200">
                        {(['images', 'details'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTab(t)}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors',
                                    tab === t
                                        ? 'border-[var(--color-aegean-blue)] text-[var(--color-aegean-blue)]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                )}
                            >
                                {t === 'images' ? 'Images' : 'Details'}
                            </button>
                        ))}
                    </div>

                    {tab === 'images' ? (
                        <OrderableMediaGrid
                            media={cat.media}
                            disabled={!editable}
                            onReorder={onReorder}
                            onRemove={onRemove}
                            onAdd={onAdd}
                        />
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input label="Title" value={cat.title} disabled={!editable} onChange={(e) => onField((c) => ({ ...c, title: e.target.value }))} />
                            <Input label="Subtitle" value={cat.subtitle} disabled={!editable} onChange={(e) => onField((c) => ({ ...c, subtitle: e.target.value }))} />
                            <div className="md:col-span-2">
                                <Input label="Reserve URL (Guesty)" value={cat.guestyUrl} disabled={!editable} onChange={(e) => onField((c) => ({ ...c, guestyUrl: e.target.value }))} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">Description</label>
                                <textarea
                                    value={cat.description}
                                    disabled={!editable}
                                    onChange={(e) => onField((c) => ({ ...c, description: e.target.value }))}
                                    rows={3}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--color-aegean-blue)] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">Layout</label>
                                <select
                                    value={cat.layout}
                                    disabled={!editable}
                                    onChange={(e) => onField((c) => ({ ...c, layout: e.target.value as 'image-left' | 'image-right' }))}
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                >
                                    <option value="image-left">Image left</option>
                                    <option value="image-right">Image right</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </Collapse>
        </div>
    );
}

export function HomepageEditor({ initialCategories }: { initialCategories: AdminGuestyCategory[] }) {
    const [categories, setCategories] = useState<AdminGuestyCategory[]>(initialCategories);
    const [pickerCat, setPickerCat] = useState<string | null>(null);
    const { showToast } = useToast();
    const { can } = usePermission();
    const editable = can('content.pages');

    const updateLocal = (catId: string, fn: (c: AdminGuestyCategory) => AdminGuestyCategory) =>
        setCategories((prev) => prev.map((c) => (c.id === catId ? fn(c) : c)));

    // Gallery edits update local state only; nothing persists until the card's
    // Save button, which writes both the image order and the details together.
    const updateMediaLocal = (catId: string, media: GridMedia[]) =>
        updateLocal(catId, (c) => ({ ...c, media }));

    const handleReorder = (catId: string, orderedIds: string[]) => {
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return;
        const byId = new Map(cat.media.map((m) => [m.id, m]));
        const media = orderedIds.map((id) => byId.get(id)).filter((m): m is GridMedia => !!m);
        updateMediaLocal(catId, media);
    };

    const handleRemove = (catId: string, id: string) => {
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return;
        updateMediaLocal(catId, cat.media.filter((m) => m.id !== id));
    };

    const handleAddSelected = (catId: string, asset: { id: string; url: string }) => {
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return;
        if (cat.media.some((m) => m.id === asset.id)) {
            showToast('That image is already in this category', 'error');
            return;
        }
        updateMediaLocal(catId, [...cat.media, { id: asset.id, url: asset.url }]);
    };

    // Persist BOTH the gallery (image order) and the details in one save.
    const handleSave = async (catId: string) => {
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return;
        try {
            await Promise.all([
                setCategoryMediaAction(cat.id, cat.media.map((m) => m.id)),
                updateCategoryAction(cat.id, {
                    title: cat.title,
                    subtitle: cat.subtitle,
                    description: cat.description,
                    guestyUrl: cat.guestyUrl,
                    layout: cat.layout,
                }),
            ]);
            showToast('Saved', 'success');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Failed to save', 'error');
        }
    };

    return (
        <div className="space-y-3">
            {categories.map((cat) => (
                <CategoryCard
                    key={cat.id}
                    cat={cat}
                    editable={editable}
                    onReorder={(ids) => handleReorder(cat.id, ids)}
                    onRemove={(id) => handleRemove(cat.id, id)}
                    onAdd={() => setPickerCat(cat.id)}
                    onField={(fn) => updateLocal(cat.id, fn)}
                    onSave={() => handleSave(cat.id)}
                />
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
