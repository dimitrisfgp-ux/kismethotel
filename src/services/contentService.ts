import { createServerClient } from "@/lib/supabase";
import { Amenity, Attraction, Convenience, FAQ, HotelSettings, PageContent, LocationCategory } from "@/types";

export const contentService = {
    getAmenities: async (): Promise<Amenity[]> => {
        const supabase = createServerClient();
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
        const supabase = createServerClient();
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
        const supabase = createServerClient();

        // Delete existing and re-insert (simpler than individual updates)
        await supabase.from('conveniences').delete().neq('id', 0);

        if (locations.length > 0) {
            const { error } = await supabase.from('conveniences').insert(
                locations.map(c => ({
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
        const supabase = createServerClient();
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
        const supabase = createServerClient();

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
        const supabase = createServerClient();
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
        const supabase = createServerClient();
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
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from('hotel_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data) {
            // Return default settings if not found
            return {
                name: 'Kismet Hotel',
                description: 'Boutique Accommodations',
                contact: { address: '', phone: '', email: '' },
                socials: { whatsapp: '', viber: '', instagram: '', facebook: '' }
            };
        }

        return {
            name: data.name,
            description: data.description,
            contact: data.contact as HotelSettings['contact'],
            socials: data.socials as HotelSettings['socials']
        };
    },

    updateSettings: async (settings: HotelSettings): Promise<boolean> => {
        const supabase = createServerClient();
        const { error } = await supabase
            .from('hotel_settings')
            .upsert({
                id: 1,
                name: settings.name,
                description: settings.description,
                contact: settings.contact,
                socials: settings.socials
            });

        return !error;
    },

    getPageContent: async (): Promise<PageContent> => {
        const supabase = createServerClient();
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
        const supabase = createServerClient();
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
        const supabase = createServerClient();

        // Delete and re-insert
        await supabase.from('faqs').delete().neq('id', 0);

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
    }
};
