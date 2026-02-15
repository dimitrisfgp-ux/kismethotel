import { createClient } from "@/lib/supabase/server";
import { Amenity, Attraction, Convenience, FAQ, HotelSettings, PageContent, LocationCategory } from "@/types";

export const contentService = {
    getAmenities: async (): Promise<Amenity[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('amenities')
            .select('*')
            .order('id');

        if (error) return [];

        return (data || []).map(a => ({
            id: a.id,
            name: a.name,
            iconName: a.icon_name
        }));
    },

    getConveniences: async (): Promise<Convenience[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('conveniences')
            .select('*')
            .order('id');

        if (error) return [];

        return (data || []).map(c => ({
            id: c.id,
            name: c.name,
            categoryId: c.category_id,
            type: c.type,
            lat: parseFloat(c.lat),
            lng: parseFloat(c.lng),
            distanceLabel: c.distance_label
        }));
    },

    updateConveniences: async (locations: Convenience[]): Promise<boolean> => {
        const supabase = await createClient();

        // 1. Get existing IDs to identify deletions
        const { data: existing } = await supabase.from('conveniences').select('id');
        const existingIds = (existing || []).map(r => r.id); // These are numbers from DB

        // Normalize incoming IDs for comparison (handle both strings and numbers)
        const incomingIds = locations.map(c => String(c.id)).filter(Boolean);

        // 2. Delete items that are no longer present
        // Convert existing ID to string for comparison, but keep original ID for deletion
        const toDelete = existingIds.filter(id => !incomingIds.includes(String(id)));

        if (toDelete.length > 0) {
            const { error: deleteError } = await supabase.from('conveniences').delete().in('id', toDelete);
            if (deleteError) {
                console.error('Service: Convenience Delete Failed:', deleteError);
                return false;
            }
        }

        // 3. Upsert incoming items
        if (locations.length > 0) {
            const upsertPayload = locations.map((c: Convenience) => {
                // Determine if ID is a valid existing ID (numeric) or a temp ID (string/loc_...)
                const idStr = String(c.id);
                const isTempId = idStr.startsWith('loc_') || isNaN(Number(idStr));

                // If it's a temp ID, we UNDEFINE it so Postgres generates a new serial ID.
                // If it's a valid ID, we cast to number.
                return {
                    ...(isTempId ? {} : { id: Number(idStr) }),
                    name: c.name,
                    category_id: c.categoryId,
                    type: c.type,
                    lat: c.lat,
                    lng: c.lng,
                    distance_label: c.distanceLabel
                };
            });

            const { error } = await supabase.from('conveniences').upsert(upsertPayload);

            if (error) {
                console.error('Service: Convenience Upsert Failed:', error);
                return false;
            }
        }
        return true;
    },

    getCategories: async (): Promise<LocationCategory[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('location_categories')
            .select('*')
            .order('sort_order');

        if (error) return [];

        return (data || []).map(c => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
            color: c.color
        }));
    },

    updateCategories: async (categories: LocationCategory[]): Promise<boolean> => {
        const supabase = await createClient();

        // Upsert categories
        const { error } = await supabase.from('location_categories').upsert(
            categories.map((c, i) => ({
                id: c.id,
                label: c.label,
                icon: c.icon,
                color: c.color,
                sort_order: i
            }))
        );

        return !error;
    },

    getAttractions: async (): Promise<Attraction[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('attractions')
            .select('*')
            .order('id');

        if (error) return [];

        return (data || []).map(a => ({
            id: a.id,
            name: a.name,
            description: a.description,
            image: a.image,
            distance: a.distance
        }));
    },

    getFAQs: async (): Promise<FAQ[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('sort_order');

        if (error) return [];

        return (data || []).map(f => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category
        }));
    },

    getSettings: async (): Promise<HotelSettings> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('hotel_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data) {
            // Return default settings if not found
            return {
                name: 'Kismet',
                description: 'Boutique Accommodations',
                holdDurationMinutes: 5,
                contact: { address: '', phone: '', email: '' },
                socials: { whatsapp: '', viber: '', googleReviews: '' }
            };
        }

        return {
            name: data.name,
            description: data.description,
            holdDurationMinutes: data.hold_duration_minutes || 5,
            contact: data.contact as HotelSettings['contact'],
            socials: data.socials as HotelSettings['socials']
        };
    },

    updateSettings: async (settings: HotelSettings): Promise<boolean> => {
        const supabase = await createClient();
        console.log('Service: Updating Settings...', settings);

        const { error } = await supabase
            .from('hotel_settings')
            .upsert({
                id: 1,
                name: settings.name,
                description: settings.description,
                hold_duration_minutes: settings.holdDurationMinutes,
                contact: settings.contact,
                socials: settings.socials
            });

        if (error) {
            console.error('Service: Settings Update Failed:', error);
            return false;
        }

        return true;
    },

    getPageContent: async (): Promise<PageContent> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('page_content')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data) {
            // Return default content if not found
            return {
                hero: { title: '', subtitle: '', ctaText: '' },
                locationsSection: { title: '', subtitle: '' },
                sections: {
                    rooms: { title: '', subtitle: '' },
                    location: { title: '', subtitle: '' },
                    attractions: { title: '', subtitle: '' },
                    faq: { title: '', subtitle: '' }
                }
            };
        }

        return {
            hero: data.hero as PageContent['hero'],
            locationsSection: data.locations_section as PageContent['locationsSection'],
            sections: data.sections as PageContent['sections']
        };
    },

    updatePageContent: async (content: PageContent): Promise<boolean> => {
        const supabase = await createClient();
        console.log('Service: Updating Page Content...');

        const payload = {
            id: 1,
            hero: content.hero,
            locations_section: content.locationsSection,
            sections: content.sections
        };

        // Debug payload structure
        // console.log('Payload:', JSON.stringify(payload, null, 2));

        const { error } = await supabase
            .from('page_content')
            .upsert(payload);

        if (error) {
            console.error('Service: Page Content Update Failed:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return false;
        }

        console.log('Service: Update Success');
        return true;
    },

    updateFAQs: async (faqs: FAQ[]): Promise<boolean> => {
        const supabase = await createClient();

        // 1. Get existing IDs
        const { data: existing } = await supabase.from('faqs').select('id');
        const existingIds = (existing || []).map(r => r.id);
        const incomingIds = faqs.map(f => f.id).filter(Boolean); // Assuming FAQs have IDs, if new they might be auto-generated by DB?

        // Note: If FAQs don't have IDs on the client side (e.g. new ones), we can't track them for update vs insert easily without an ID.
        // However, the `delete().not('id', 'is', null)` strategy implied we just wipe and rewrite.
        // If we want to be safe, we should ensure FAQs have IDs or handle "new" ones.
        // Assuming the current UI generates temp IDs or we just want to preserve stability.

        // Actually, for FAQs specifically, often they are just a sorted list. 
        // If we use the "Delete All" strategy, we lose data if insert fails.
        // A safer strategy if IDs are unstable is to use a transaction, but we can't here easily.
        // Let's stick to the same pattern: Delete Missing + Upsert.
        // But wait, if new FAQs rely on serial auto-increment, we can't upsert them with "temp" IDs.
        // The type definition says `id: number`.

        // Safe Strategy for ID-based entities:
        const toDelete = existingIds.filter(id => !incomingIds.includes(id));

        if (toDelete.length > 0) {
            await supabase.from('faqs').delete().in('id', toDelete);
        }

        if (faqs.length > 0) {
            const { error } = await supabase.from('faqs').upsert(
                faqs.map((f, i) => ({
                    // If id is a valid number (existing), use it. If it's a temp/negative number or 0, maybe omit it? 
                    // Supabase upsert needs the PK to match for update.
                    // If the UI passes 0 for new items, we should OMIT id so Postgres generates it.
                    ...(f.id > 0 ? { id: f.id } : {}),
                    question: f.question,
                    answer: f.answer,
                    category: f.category,
                    sort_order: i
                }))
            );
            return !error;
        }
        return true;
    },

    deleteCategory: async (id: string): Promise<boolean> => {
        const supabase = await createClient();

        // 1. Delete associated conveniences first
        await supabase.from('conveniences').delete().eq('category_id', id);

        // 2. Delete the category
        const { error } = await supabase
            .from('location_categories')
            .delete()
            .eq('id', id);

        return !error;
    }
};
