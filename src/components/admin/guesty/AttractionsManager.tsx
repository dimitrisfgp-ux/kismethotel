'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Image as ImageIcon, Youtube, Save } from 'lucide-react';
import { Attraction, MediaAsset } from '@/types';
import { OrderableUrlGrid } from './OrderableUrlGrid';
import { MediaPickerModal } from '@/components/admin/media/MediaPickerModal';
import { updateAttractionsAction } from '@/app/actions/content';
import { useToast } from '@/contexts/ToastContext';
import { usePermission } from '@/contexts/PermissionContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Editable = Omit<Attraction, 'gallery'> & { gallery: string[] };

export function AttractionsManager({ initialAttractions }: { initialAttractions: Attraction[] }) {
    const [items, setItems] = useState<Editable[]>(
        initialAttractions.map((a) => ({ ...a, gallery: a.gallery ?? [] }))
    );
    const [picker, setPicker] = useState<{ attrId: number; target: 'cover' | 'gallery' } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
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

    const removeAttraction = (id: number) => {
        if (confirm('Remove this attraction?')) setItems((prev) => prev.filter((a) => a.id !== id));
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

    const save = async () => {
        setIsSaving(true);
        try {
            const ok = await updateAttractionsAction(items);
            showToast(ok ? 'Attractions saved' : 'Failed to save attractions', ok ? 'success' : 'error');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Failed to save attractions', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {editable && (
                <div className="flex justify-end">
                    <Button onClick={save} isLoading={isSaving} className="gap-2">
                        <Save className="w-4 h-4" /> Save Attractions
                    </Button>
                </div>
            )}

            {items.map((a) => (
                <div key={a.id} className="bg-white border border-[var(--color-sand)] rounded-lg p-4 space-y-4">
                    <div className="flex gap-4">
                        {/* Cover */}
                        <button
                            type="button"
                            disabled={!editable}
                            onClick={() => setPicker({ attrId: a.id, target: 'cover' })}
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
                            <Input label="Name" value={a.name} disabled={!editable} onChange={(e) => update(a.id, (x) => ({ ...x, name: e.target.value }))} />
                            <Input label="Distance" value={a.distance} disabled={!editable} onChange={(e) => update(a.id, (x) => ({ ...x, distance: e.target.value }))} />
                            <div className="md:col-span-2">
                                <Input label="External link (optional)" value={a.externalUrl ?? ''} disabled={!editable} onChange={(e) => update(a.id, (x) => ({ ...x, externalUrl: e.target.value }))} />
                            </div>
                        </div>

                        {editable && (
                            <button type="button" title="Remove attraction" onClick={() => removeAttraction(a.id)} className="self-start p-2 text-red-500 hover:bg-red-50 rounded-md">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">Description</label>
                        <textarea
                            value={a.description}
                            disabled={!editable}
                            onChange={(e) => update(a.id, (x) => ({ ...x, description: e.target.value }))}
                            rows={2}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--color-aegean-blue)] focus:outline-none"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-[var(--color-charcoal)]/70">Lightbox gallery — drag to reorder</span>
                            {editable && (
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => setPicker({ attrId: a.id, target: 'gallery' })}>
                                        <ImageIcon className="w-4 h-4 mr-1" /> Add image
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => addYoutube(a.id)}>
                                        <Youtube className="w-4 h-4 mr-1" /> Add YouTube
                                    </Button>
                                </div>
                            )}
                        </div>
                        <OrderableUrlGrid
                            urls={a.gallery}
                            disabled={!editable}
                            onChange={(urls) => update(a.id, (x) => ({ ...x, gallery: urls }))}
                        />
                    </div>
                </div>
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
