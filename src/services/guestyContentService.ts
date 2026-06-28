import { createClient, createPublicClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import type { Attraction, Convenience, FAQ, LocationCategory } from "@/types";
import {
    GUESTY_HERO,
    GUESTY_ROOM_CATEGORIES,
    GUESTY_ATTRACTIONS,
    GUESTY_CONVENIENCES,
    GUESTY_LOCATION_CATEGORIES,
    GUESTY_FAQS,
    type GuestyRoomCategory,
} from "@/config/guestyMode";

/**
 * Everything the Guesty homepage renders. Currently the room *categories* are
 * DB-backed (editable via the CMS); hero / attractions / map / FAQ still come
 * from the bundled config until their editors land. The bundled config also
 * serves as a safe fallback so the public site renders even if Supabase is
 * unreachable or not yet seeded.
 */
export interface GuestyHomeContent {
    hero: typeof GUESTY_HERO;
    categories: GuestyRoomCategory[];
    attractions: Attraction[];
    conveniences: Convenience[];
    locationCategories: LocationCategory[];
    faqs: FAQ[];
}

/** A category as edited in the admin (includes ids + ordered media for the editor). */
export interface AdminGuestyCategory {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    guestyUrl: string;
    layout: "image-left" | "image-right";
    displayOrder: number;
    media: { id: string; url: string }[]; // ordered; index 0 = cover
}

type CategoryRow = {
    slug: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    guesty_url: string;
    layout: "image-left" | "image-right";
    guesty_category_media: { display_order: number; media_assets: { url: string } | null }[];
};

// DB row -> the shape GuestyCategorySection expects. Purely positional:
// index 0 = cover/main, 1..3 = secondary thumbnails, 4.. = carousel/lightbox extras.
function mapCategory(c: CategoryRow): GuestyRoomCategory {
    const urls = (c.guesty_category_media ?? [])
        .slice()
        .sort((a, b) => a.display_order - b.display_order)
        .map((m) => m.media_assets?.url)
        .filter((u): u is string => !!u);

    const [main = "", ...rest] = urls;
    return {
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle ?? "",
        description: c.description ?? "",
        guestyUrl: c.guesty_url,
        layout: c.layout,
        images: {
            main,
            secondary: [rest[0] ?? "", rest[1] ?? "", rest[2] ?? ""] as [string, string, string],
            extras: rest.slice(3),
        },
    };
}

function mapConvenienceRow(c: Record<string, unknown>): Convenience {
    return {
        id: String(c.id),
        name: c.name as string,
        categoryId: String(c.category_id),
        type: c.type as string,
        lat: Number(c.lat),
        lng: Number(c.lng),
        distanceLabel: (c.distance_label as string) ?? undefined,
        description: (c.description as string) ?? undefined,
        popupImage: (c.popup_image as string) ?? undefined,
        rating: c.rating != null ? Number(c.rating) : undefined,
    };
}
function mapLocationCategoryRow(c: Record<string, unknown>): LocationCategory {
    return { id: String(c.id), label: c.label as string, icon: c.icon as string, color: c.color as string };
}
function mapFaqRow(f: Record<string, unknown>): FAQ {
    return { id: f.id as number, question: f.question as string, answer: f.answer as string, category: f.category as string };
}
function mapAttractionRow(a: Record<string, unknown>): Attraction {
    return {
        id: a.id as number,
        name: a.name as string,
        description: a.description as string,
        image: a.image as string,
        distance: a.distance as string,
        gallery: Array.isArray(a.gallery) ? (a.gallery as string[]) : [],
        externalUrl: (a.external_url as string) ?? undefined,
    };
}

const getHomeCached = unstable_cache(
    async (): Promise<GuestyHomeContent> => {
        try {
            const supabase = createPublicClient();
            const { data: catData } = await supabase
                .from("guesty_categories")
                .select(
                    "slug, title, subtitle, description, guesty_url, layout, guesty_category_media ( display_order, media_assets ( url ) )"
                )
                .eq("is_published", true)
                .order("display_order");

            // The presence of guesty_categories signals that guesty content has
            // been seeded → serve the whole homepage from the DB. Otherwise fall
            // back to the bundled config (keeps prod identical until seeded).
            if (catData && catData.length > 0) {
                const [conv, locCat, faq, attr, pc] = await Promise.all([
                    supabase.from("conveniences").select("*").order("id"),
                    supabase.from("location_categories").select("*").order("sort_order"),
                    supabase.from("faqs").select("*").order("sort_order"),
                    supabase.from("attractions").select("*").order("id"),
                    supabase.from("page_content").select("hero").eq("id", 1).single(),
                ]);
                return {
                    hero: { ...GUESTY_HERO, ...((pc.data?.hero as object) ?? {}) } as typeof GUESTY_HERO,
                    categories: (catData as unknown as CategoryRow[]).map(mapCategory),
                    conveniences: (conv.data ?? []).map(mapConvenienceRow),
                    locationCategories: (locCat.data ?? []).map(mapLocationCategoryRow),
                    faqs: (faq.data ?? []).map(mapFaqRow),
                    attractions: (attr.data ?? []).map(mapAttractionRow),
                };
            }
        } catch {
            // Any failure → fall through to the bundled config below.
        }

        return {
            hero: GUESTY_HERO,
            categories: GUESTY_ROOM_CATEGORIES,
            attractions: GUESTY_ATTRACTIONS,
            conveniences: GUESTY_CONVENIENCES,
            locationCategories: GUESTY_LOCATION_CATEGORIES,
            faqs: GUESTY_FAQS,
        };
    },
    ["guesty-home"],
    { tags: ["guesty-home"] }
);

type AdminCategoryRow = {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    guesty_url: string;
    layout: "image-left" | "image-right";
    display_order: number;
    guesty_category_media: { display_order: number; media_assets: { id: string; url: string } | null }[];
};

// Admin-side read (fresh, authenticated). Returns ids + ordered media for editing.
async function getCategoriesForAdmin(): Promise<AdminGuestyCategory[]> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("guesty_categories")
        .select(
            "id, slug, title, subtitle, description, guesty_url, layout, display_order, guesty_category_media ( display_order, media_assets ( id, url ) )"
        )
        .order("display_order");

    return ((data ?? []) as unknown as AdminCategoryRow[]).map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle ?? "",
        description: c.description ?? "",
        guestyUrl: c.guesty_url,
        layout: c.layout,
        displayOrder: c.display_order,
        media: (c.guesty_category_media ?? [])
            .slice()
            .sort((a, b) => a.display_order - b.display_order)
            .map((m) => (m.media_assets ? { id: m.media_assets.id, url: m.media_assets.url } : null))
            .filter((m): m is { id: string; url: string } => !!m),
    }));
}

export const guestyContentService = {
    getHome: (): Promise<GuestyHomeContent> => getHomeCached(),
    getCategoriesForAdmin,
};
