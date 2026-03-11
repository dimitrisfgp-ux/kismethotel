"use client";

import { useState } from "react";
import { HotelSettings } from "@/types";
import { updateSettingsAction } from "@/app/actions/content";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/contexts/ToastContext";
import { Save, Type, ImageIcon } from "lucide-react";
import { usePermission } from "@/contexts/PermissionContext";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
    initialSettings: HotelSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const { can } = usePermission();
    const [settings, setSettings] = useState<HotelSettings>(initialSettings);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Media picker state
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [textPickerOpen, setTextPickerOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await updateSettingsAction(settings);
            if (success) {
                showToast("Settings updated successfully", "success");
            } else {
                showToast("Failed to update settings", "error");
            }
        } catch (_error) {
            showToast("An error occurred", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const updateContact = (field: keyof HotelSettings['contact'], value: string) => {
        setSettings(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
    };

    const updateSocials = (field: keyof HotelSettings['socials'], value: string) => {
        setSettings(prev => ({
            ...prev,
            socials: { ...prev.socials, [field]: value }
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 bg-white p-3 md:p-6 rounded-lg border border-[var(--color-sand)] shadow-sm">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-[var(--color-sand)] pb-4 gap-4">
                <h2 className="text-lg font-bold font-montserrat text-[var(--color-charcoal)]">Global Information</h2>
                {can('content.settings') && (
                    <Button type="submit" isLoading={isLoading} className="gap-2 w-full md:w-auto justify-center">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                )}
            </div>

            {/* Brand Identity Section */}
            <div className="space-y-4">
                <h3 className="font-medium text-[var(--color-aegean-blue)] border-b pb-1">Brand Identity</h3>

                {/* Logo Mode Toggle — Only visible to users with content.branding permission */}
                {can('content.branding') && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-charcoal)]">Logo Display Mode</label>
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
                            <button
                                type="button"
                                onClick={() => setSettings(s => ({ ...s, logoMode: 'text' }))}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                                    settings.logoMode === 'text'
                                        ? "bg-[var(--color-aegean-blue)] text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <Type className="h-4 w-4" />
                                Text
                            </button>
                            <button
                                type="button"
                                onClick={() => setSettings(s => ({ ...s, logoMode: 'image' }))}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-l border-gray-200",
                                    settings.logoMode === 'image'
                                        ? "bg-[var(--color-aegean-blue)] text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <ImageIcon className="h-4 w-4" />
                                Image
                            </button>
                        </div>
                    </div>
                )}

                {/* Pipeline A: Text Fields */}
                {settings.logoMode === 'text' && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <Input
                            label="Hotel Name"
                            value={settings.name}
                            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                            required
                            disabled={!can('content.settings')}
                        />
                        <Input
                            label="Description"
                            value={settings.description}
                            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                            disabled={!can('content.settings')}
                        />
                    </div>
                )}

                {/* Pipeline B: Image Fields */}
                {settings.logoMode === 'image' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        {/* Logo Icon */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-charcoal)]">Logo Icon</label>
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={settings.logoIconUrl}
                                        alt="Logo Icon"
                                        className="h-full w-auto object-contain"
                                    />
                                </div>
                                {can('content.settings') && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIconPickerOpen(true)}
                                        className="text-sm"
                                    >
                                        Browse Media
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Logo Text */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-charcoal)]">Logo Text</label>
                            <div className="flex items-center gap-4">
                                <div className="h-14 bg-white rounded-lg border border-gray-200 flex items-center justify-center px-4 py-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={settings.logoTextUrl}
                                        alt="Logo Text"
                                        className="h-full w-auto object-contain"
                                    />
                                </div>
                                {can('content.settings') && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setTextPickerOpen(true)}
                                        className="text-sm"
                                    >
                                        Browse Media
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-medium text-[var(--color-aegean-blue)] border-b pb-1">Contact Details</h3>

                    <Input
                        label="Address"
                        value={settings.contact.address}
                        onChange={(e) => updateContact('address', e.target.value)}
                        disabled={!can('content.settings')}
                    />

                    <Input
                        label="Phone"
                        value={settings.contact.phone}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        disabled={!can('content.settings')}
                    />

                    <Input
                        label="Email"
                        value={settings.contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        disabled={!can('content.settings')}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-[var(--color-aegean-blue)] border-b pb-1">Social Media</h3>

                    <Input
                        label="WhatsApp URL"
                        value={settings.socials.whatsapp}
                        onChange={(e) => updateSocials('whatsapp', e.target.value)}
                        disabled={!can('content.settings')}
                    />

                    <Input
                        label="Viber URL"
                        value={settings.socials.viber}
                        onChange={(e) => updateSocials('viber', e.target.value)}
                        disabled={!can('content.settings')}
                    />
                </div>
            </div>

            {/* Media Picker Modals */}
            <MediaPickerModal
                isOpen={iconPickerOpen}
                onClose={() => setIconPickerOpen(false)}
                onSelect={(media) => {
                    setSettings(s => ({ ...s, logoIconUrl: media.url }));
                    setIconPickerOpen(false);
                }}
                filterType="image"
            />
            <MediaPickerModal
                isOpen={textPickerOpen}
                onClose={() => setTextPickerOpen(false)}
                onSelect={(media) => {
                    setSettings(s => ({ ...s, logoTextUrl: media.url }));
                    setTextPickerOpen(false);
                }}
                filterType="image"
            />
        </form>
    );
}

