import { contentService } from "@/services/contentService";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";

export default async function SettingsPage() {
    const settings = await contentService.getSettings();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="border-b border-[var(--color-sand)] pb-6">
                <h1 className="text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Global Settings</h1>
                <p className="text-[var(--color-charcoal)]/60 mt-2">Manage hotel configuration and contact details.</p>
            </div>

            <SettingsForm initialSettings={settings} />
        </div>
    );
}
