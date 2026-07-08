'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Image as ImageIcon, Save, ChevronDown } from 'lucide-react';
import { Attraction, MediaAsset } from '@/types';
import { OrderableUrlGrid } from './OrderableUrlGrid';
import { MediaPickerModal } from '@/components/admin/media/MediaPickerModal';
import { updateAttractionsAction, deleteAttractionAction } from '@/app/actions/content';
import { useToast } from '@/contexts/ToastContext';
import { usePermission } from '@/contexts/PermissionContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Collapse } from '@/components/ui/Collapse';
import { cn } from '@/lib/utils';

type Editable = Omit<Attraction, 'gallery'> & { gallery: string[] };

interface AttractionCardProps {
    a: Editable;
    editable: boolean;
    onUpdate: (fn: (a: Editable) => Editable) => void;
    onRemove: () => void;
    onPick: (target: 'cover' | 'gallery') => void;
    onAddYoutube: () => void;
    onSave: () => Promise<void>;
}

function AttractionCard({ a, editable, onUpdate, onRemove, onPick, onAddYoutube, onSave }: AttractionCardProps) {
    const [open, setOpen] = useState(false);
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
        <div className="bg-white border border-[var(--color-sand)] rounded-lg overflow-hidden">
            {/* Header — thumbnail + title + distance; click to expand */}
            <div
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <div className="relative w-16 h-12 shrink-0 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                    {a.image ? (
                        <Image src={a.image} alt="" fill className="object-cover" sizes="64px" />
                    ) : (
                        <ImageIcon className="w-5 h-5 text-gray-300" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-[var(--color-charcoal)] truncate">{a.name || 'New attraction'}</p>
                    {a.distance && <p className="text-xs text-gray-400 truncate">{a.distance}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {open && editable && (
                        <Button type="button" size="sm" onClick={handleSave} isLoading={saving} className="gap-1.5">
                            <Save className="w-4 h-4" /> Save
                        </Button>
                    )}
                    {editable && (
                        <button
                            type="button"
                            title="Remove attraction"
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
                </div>
            </div>

            {/* Body */}
            <Collapse open={open}>
                <div className="border-t border-[var(--color-sand)] p-4 space-y-4">
                    <div className="flex gap-4">
                        {/* Cover */}
                        <button
                            type="button"
                            disabled={!editable}
                            onClick={() => onPick('cover')}
                            className="relative w-32 h-24 shrink-0 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center hover:border-[var(--color-aegean-blue)] transition-colors"
                        >
                            {a.image ? (
                                <Image src={a.image} alt="" fill className="object-cover" sizes="128px" />
                            ) : (
                                <span className="flex flex-col items-center text-gray-400 text-xs">
                                    <ImageIcon className="w-6 h-6 mb-1" /> Cover
                                </span>
                            )}
                        </button>

                        <div className="flex-1 grid md:grid-cols-2 gap-3">
                            <Input label="Name" value={a.name} disabled={!editable} onChange={(e) => onUpdate((x) => ({ ...x, name: e.target.value }))} />
                            <Input label="Distance" value={a.distance} disabled={!editable} onChange={(e) => onUpdate((x) => ({ ...x, distance: e.target.value }))} />
                            <div className="md:col-span-2">
                                <Input label="External link (optional)" value={a.externalUrl ?? ''} disabled={!editable} onChange={(e) => onUpdate((x) => ({ ...x, externalUrl: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">Description</label>
                        <textarea
                            value={a.description}
                            disabled={!editable}
                            onChange={(e) => onUpdate((x) => ({ ...x, description: e.target.value }))}
                            rows={2}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--color-aegean-blue)] focus:outline-none"
                        />
                    </div>

                    <div>
                        <span className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Lightbox gallery — drag to reorder</span>
                        <OrderableUrlGrid
                            urls={a.gallery}
                            disabled={!editable}
                            onChange={(urls) => onUpdate((x) => ({ ...x, gallery: urls }))}
                            onAdd={editable ? () => onPick('gallery') : undefined}
                            onAddYoutube={editable ? onAddYoutube : undefined}
                        />
                    </div>
                </div>
            </Collapse>
        </div>
    );
}

export function AttractionsManager({ initialAttractions }: { initialAttractions: Attraction[] }) {
    const [items, setItems] = useState<Editable[]>(
        initialAttractions.map((a) => ({ ...a, gallery: a.gallery ?? [] }))
    );
    const [picker, setPicker] = useState<{ attrId: number; target: 'cover' | 'gallery' } | null>(null);
    const { showToast } = useToast();
    const { can } = usePermission();
    const editable = can('content.pages');

    const update = (id: number, fn: (a: Editable) => Editable) =>
        setItems((prev) => prev.map((a) => (a.id === id ? fn(a) : a)));

    const addAttraction = () => {
        setItems((prev) => [
            ...prev,
            { id: -Date.now(), name: '', description: '', image: '', distance: '', externalUrl: '', gallery: [] },
        ]);
    };

    const removeAttraction = async (id: number) => {
        if (!confirm('Remove this attraction?')) return;
        setItems((prev) => prev.filter((a) => a.id !== id));
        // New, never-saved attractions (temp negative id) exist only in local state —
        // nothing to delete on the server. Existing ones must persist immediately.
        if (id > 0) {
            try {
                const res = await deleteAttractionAction(id);
                showToast(res.ok ? 'Attraction removed' : res.error, res.ok ? 'success' : 'error');
            } catch (e) {
                showToast(e instanceof Error ? e.message : 'Failed to remove attraction', 'error');
            }
        }
    };

    const onPick = (asset: MediaAsset) => {
        if (!picker) return;
        if (picker.target === 'cover') update(picker.attrId, (a) => ({ ...a, image: asset.url }));
        else update(picker.attrId, (a) => ({ ...a, gallery: [...a.gallery, asset.url] }));
        setPicker(null);
    };

    const addYoutube = (id: number) => {
        const url = window.prompt('Paste a YouTube URL (or any image URL) to add to the gallery:');
        if (url && url.trim()) update(id, (a) => ({ ...a, gallery: [...a.gallery, url.trim()] }));
    };

    // Attractions persist as a whole set, so a per-card Save writes all of them.
    const save = async () => {
        try {
            const ok = await updateAttractionsAction(items);
            showToast(ok ? 'Attractions saved' : 'Failed to save attractions', ok ? 'success' : 'error');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Failed to save attractions', 'error');
        }
    };

    return (
        <div className="space-y-3">
            {items.map((a) => (
                <AttractionCard
                    key={a.id}
                    a={a}
                    editable={editable}
                    onUpdate={(fn) => update(a.id, fn)}
                    onRemove={() => removeAttraction(a.id)}
                    onPick={(target) => setPicker({ attrId: a.id, target })}
                    onAddYoutube={() => addYoutube(a.id)}
                    onSave={save}
                />
            ))}

            {editable && (
                <Button type="button" variant="outline" onClick={addAttraction} className="w-full py-3 border-2 border-dashed text-[var(--color-charcoal)]/60">
                    <Plus className="w-4 h-4 mr-2" /> Add attraction
                </Button>
            )}

            <MediaPickerModal
                isOpen={picker !== null}
                onClose={() => setPicker(null)}
                onSelect={onPick}
                providerScope={['public', 'r2']}
                uploadVariant="guesty-r2"
                filterType="image"
            />
        </div>
    );
}
