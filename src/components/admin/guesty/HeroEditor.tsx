'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Film, Save } from 'lucide-react';
import { updateGuestyHeroAction } from '@/app/actions/guesty';
import { MediaPickerModal } from '@/components/admin/media/MediaPickerModal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { usePermission } from '@/contexts/PermissionContext';

interface GuestyHeroData {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    scrollTargetId?: string;
    poster?: string;
    videos?: { mobile?: string; desktop?: string; ios?: string; android?: string };
}

type PickerTarget = 'poster' | 'videoMobile' | 'videoDesktop';

function VideoField({
    label,
    url,
    editable,
    onPick,
    onClear,
}: {
    label: string;
    url: string;
    editable: boolean;
    onPick: () => void;
    onClear: () => void;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">{label}</label>
            <div className="relative aspect-video w-full rounded-md overflow-hidden border border-gray-200 bg-gray-900 flex items-center justify-center group">
                {url ? (
                    <video src={url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 text-xs flex flex-col items-center">
                        <Film className="w-6 h-6 mb-1" /> No video
                    </span>
                )}
                {url && (
                    <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">video</span>
                )}
                {editable && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button type="button" size="sm" onClick={onPick}>{url ? 'Change' : 'Select'} video</Button>
                        {url && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={onClear}
                                className="border-white text-white hover:bg-white hover:text-[var(--color-charcoal)]"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {url && <p className="text-[10px] text-gray-400 mt-1 truncate">{url}</p>}
        </div>
    );
}

export function HeroEditor({ initialHero }: { initialHero: GuestyHeroData }) {
    const { showToast } = useToast();
    const { can } = usePermission();
    const editable = can('content.pages');

    const [title, setTitle] = useState(initialHero.title ?? '');
    const [subtitle, setSubtitle] = useState(initialHero.subtitle ?? '');
    const [ctaText, setCtaText] = useState(initialHero.ctaText ?? '');
    const [poster, setPoster] = useState(initialHero.poster ?? '');
    const [videoMobile, setVideoMobile] = useState(initialHero.videos?.mobile ?? '');
    const [videoDesktop, setVideoDesktop] = useState(initialHero.videos?.desktop ?? '');
    const [picker, setPicker] = useState<PickerTarget | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const applyPick = (assetUrl: string) => {
        if (picker === 'poster') setPoster(assetUrl);
        else if (picker === 'videoMobile') setVideoMobile(assetUrl);
        else if (picker === 'videoDesktop') setVideoDesktop(assetUrl);
        setPicker(null);
    };

    const save = async () => {
        setIsSaving(true);
        try {
            const hero = {
                ...initialHero,
                title,
                subtitle,
                ctaText,
                poster,
                videos: { ...(initialHero.videos ?? {}), mobile: videoMobile, desktop: videoDesktop },
            };
            await updateGuestyHeroAction(hero as Record<string, unknown>);
            showToast('Hero saved', 'success');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Failed to save hero', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white border border-[var(--color-sand)] rounded-lg p-5 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
                <Input label="Title" value={title} disabled={!editable} onChange={(e) => setTitle(e.target.value)} />
                <Input label="Subtitle" value={subtitle} disabled={!editable} onChange={(e) => setSubtitle(e.target.value)} />
                <Input label="CTA button text" value={ctaText} disabled={!editable} onChange={(e) => setCtaText(e.target.value)} />
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                    Poster image <span className="text-gray-400 font-normal">(shown while the video loads)</span>
                </label>
                <div className="relative aspect-video w-full max-w-xs rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group">
                    {poster ? (
                        <Image src={poster} alt="" fill className="object-cover" sizes="320px" />
                    ) : (
                        <span className="text-gray-400 text-xs flex flex-col items-center"><ImageIcon className="w-6 h-6 mb-1" /> No poster</span>
                    )}
                    {editable && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <Button type="button" size="sm" onClick={() => setPicker('poster')}>{poster ? 'Change' : 'Select'} image</Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <VideoField label="Mobile video (720p)" url={videoMobile} editable={editable} onPick={() => setPicker('videoMobile')} onClear={() => setVideoMobile('')} />
                <VideoField label="Desktop video (1080p)" url={videoDesktop} editable={editable} onPick={() => setPicker('videoDesktop')} onClear={() => setVideoDesktop('')} />
            </div>

            {editable && (
                <Button type="button" onClick={save} isLoading={isSaving} className="gap-2">
                    <Save className="w-4 h-4" /> Save Hero
                </Button>
            )}

            <MediaPickerModal
                isOpen={picker !== null}
                onClose={() => setPicker(null)}
                onSelect={(a) => applyPick(a.url)}
                providerScope={['public', 'r2']}
                filterType={picker === 'poster' ? 'image' : 'video'}
                uploadVariant={picker === 'poster' ? 'guesty-r2' : 'guesty-r2-video'}
            />
        </div>
    );
}
