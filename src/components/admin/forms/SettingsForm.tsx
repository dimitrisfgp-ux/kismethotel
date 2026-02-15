"use client";

import { useState } from "react";
import { HotelSettings } from "@/types";
// import { contentService } from "@/services/contentService"; // Removed client-side service
import { updateSettingsAction } from "@/app/actions/content";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/contexts/ToastContext";
import { Save } from "lucide-react";
import { usePermission } from "@/contexts/PermissionContext";

interface SettingsFormProps {
    initialSettings: HotelSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const { can } = usePermission();
    const [settings, setSettings] = useState<HotelSettings>(initialSettings);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-medium text-[var(--color-aegean-blue)] border-b pb-1">Contact Details</h3>

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
        </form>
    );
}
