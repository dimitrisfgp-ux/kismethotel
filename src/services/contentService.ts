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

        // NOTE: Non-atomic delete+insert. At this scale (boutique hotel CMS), the risk
        // of partial failure is acceptable. For higher-scale apps, use a Postgres function.
        await supabase.from('conveniences').delete().not('id', 'is', null);

        if (locations.length > 0) {
            const { error } = await supabase.from('conveniences').insert(
                locations.map((c: Convenience) => ({
                    id: c.id,
                    name: c.name,
                    category_id: c.categoryId,
                    type: c.type,
                    lat: c.lat,
                    lng: c.lng,
                    distance_label: c.distanceLabel
                }))
            );
            return !error;
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
                websiteUrl: 'https://kismethotel.com',
                holdDurationMinutes: 5,
                contact: { address: '', phone: '', email: '' },
                socials: { whatsapp: '', viber: '', instagram: '', facebook: '', googleReviews: '' }
            };
        }

        return {
            name: data.name,
            description: data.description,
            websiteUrl: data.website_url || 'https://kismethotel.com',
            holdDurationMinutes: data.hold_duration_minutes || 5,
            contact: data.contact as HotelSettings['contact'],
            socials: data.socials as HotelSettings['socials']
        };
    },

    updateSettings: async (settings: HotelSettings): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('hotel_settings')
            .upsert({
                id: 1,
                name: settings.name,
                description: settings.description,
                website_url: settings.websiteUrl,
                hold_duration_minutes: settings.holdDurationMinutes,
                contact: settings.contact,
                socials: settings.socials
            });

        return !error;
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
        const { error } = await supabase
            .from('page_content')
            .upsert({
                id: 1,
                hero: content.hero,
                locations_section: content.locationsSection,
                sections: content.sections
            });

        return !error;
    },

    updateFAQs: async (faqs: FAQ[]): Promise<boolean> => {
        const supabase = await createClient();

        // NOTE: Non-atomic delete+insert (acceptable at boutique hotel scale).
        await supabase.from('faqs').delete().not('id', 'is', null);

        if (faqs.length > 0) {
            const { error } = await supabase.from('faqs').insert(
                faqs.map((f, i) => ({
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
