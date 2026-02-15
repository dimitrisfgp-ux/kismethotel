import { createClient, createPublicClient } from "@/lib/supabase/server";
import { Amenity, Attraction, Convenience, FAQ, HotelSettings, PageContent, LocationCategory } from "@/types";
import { unstable_cache } from "next/cache";

// Cached Fetchers
const getCachedSettings = unstable_cache(
    async (): Promise<HotelSettings> => {
        const supabase = createPublicClient();
        const { data, error } = await supabase
            .from('hotel_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data) {
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
    ['settings'],
    { tags: ['settings'] }
);

const getCachedPageContent = unstable_cache(
    async (): Promise<PageContent> => {
        const supabase = createPublicClient();
        const { data, error } = await supabase
            .from('page_content')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data) {
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
    ['page_content'],
    { tags: ['page_content'] }
);

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
            id: String(c.id),
            name: c.name,
            categoryId: String(c.category_id),
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
        const existingIds = (existing || []).map(r => String(r.id)); // Convert DB numbers to strings for comparison

        // Normalize incoming IDs for comparison (handle both strings and numbers)
        const incomingIds = locations.map(c => String(c.id)).filter(Boolean);

        // 2. Delete items that are no longer present
        // existingIds and incomingIds are both strings now
        const toDelete = existingIds.filter(id => !incomingIds.includes(id));

        if (toDelete.length > 0) {
            // Convert back to numbers for DB deletion
            const { error: deleteError } = await supabase.from('conveniences').delete().in('id', toDelete.map(Number));
            if (deleteError) {
                console.error('Service: Convenience Delete Failed:', deleteError);
                return false;
            }
        }

        // 3. Upsert incoming items
        if (locations.length > 0) {
            const upsertPayload = [];

            for (const c of locations) {
                const idStr = String(c.id);
                // Check if it looks like a temp ID
                const isTempId = idStr.startsWith('loc_') || isNaN(Number(idStr));

                // Validate FK
                const catId = Number(c.categoryId);
                if (isNaN(catId)) {
                    console.error("Service: Invalid Category ID for location:", c.name, c.categoryId);
                    continue; // Skip invalid items instead of crashing the whole batch
                }

                const newItem = {
                    ...(isTempId ? {} : { id: Number(idStr) }),
                    name: c.name,
                    category_id: catId,
                    type: c.type || 'Attraction', // Default if missing
                    lat: c.lat,
                    lng: c.lng,
                    distance_label: c.distanceLabel
                };
                upsertPayload.push(newItem);
            }

            console.log('Service: Upserting conveniences payload:', JSON.stringify(upsertPayload, null, 2));

            if (upsertPayload.length > 0) {
                const { error } = await supabase.from('conveniences').upsert(upsertPayload);

                if (error) {
                    console.error('Service: Convenience Upsert Failed (Full Error):', JSON.stringify(error, null, 2));
                    return false;
                }
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
            id: String(c.id),
            label: c.label,
            icon: c.icon,
            color: c.color
        }));
    },

    updateCategories: async (categories: LocationCategory[]): Promise<Record<string, string> | null> => {
        const supabase = await createClient();
        const idMap: Record<string, string> = {};
        const updates: any[] = [];

        // We must process in order to assign specific sort_order
        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];
            // Temp IDs are purely client-side strings (e.g. "cat_123") vs Database IDs (Numbers)
            const isTemp = String(cat.id).startsWith('cat_') || isNaN(Number(cat.id));

            if (isTemp) {
                // Insert New
                const { data, error } = await supabase
                    .from('location_categories')
                    .insert({
                        label: cat.label,
                        icon: cat.icon,
                        color: cat.color,
                        sort_order: i
                    })
                    .select('id')
                    .single();

                if (error || !data) {
                    console.error("Failed to insert category:", cat.label, error);
                    return null;
                }

                idMap[cat.id] = String(data.id);
            } else {
                // Collect for Batch Update
                updates.push({
                    id: Number(cat.id),
                    label: cat.label,
                    icon: cat.icon,
                    color: cat.color,
                    sort_order: i
                });
            }
        }

        // Batch execute updates
        if (updates.length > 0) {
            const { error } = await supabase.from('location_categories').upsert(updates);
            if (error) {
                console.error("Failed to update categories", error);
                return null;
            }
        }

        return idMap;
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
        return getCachedSettings();
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
        return getCachedPageContent();
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

        // Safe Strategy for ID-based entities:
        const toDelete = existingIds.filter(id => !incomingIds.includes(id));

        if (toDelete.length > 0) {
            await supabase.from('faqs').delete().in('id', toDelete);
        }

        if (faqs.length > 0) {
            const { error } = await supabase.from('faqs').upsert(
                faqs.map((f, i) => ({
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
