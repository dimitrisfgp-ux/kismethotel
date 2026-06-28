/**
 * Emits idempotent SQL that transfers the bundled Guesty config (the content
 * currently shown on the live front-end) into the database, EXACTLY:
 *   - room categories + their ordered imagery (provider='public' media)
 *   - map pins (conveniences) + their categories  -- byte-exact, incl. description/popup/rating
 *   - FAQs
 *   - attractions (incl. lightbox galleries + external links)
 *
 *   npx tsx scripts/seed-guesty-content.ts > /tmp/guesty_seed.sql
 *   psql "$SUPABASE_DB_URL" -f /tmp/guesty_seed.sql
 *
 * The config is the single source of truth, so the transfer can't drift.
 * This REPLACES the dormant self_contained content in the shared tables
 * (conveniences / location_categories / faqs / attractions), which is intended.
 * media_assets touched only for provider='public' rows (the /public images).
 */
import {
    GUESTY_HERO,
    GUESTY_ROOM_CATEGORIES,
    GUESTY_LOCATION_CATEGORIES,
    GUESTY_CONVENIENCES,
    GUESTY_FAQS,
    GUESTY_ATTRACTIONS,
} from "../src/config/guestyMode";

const esc = (s: string) => s.replace(/'/g, "''");
const basename = (u: string) => decodeURIComponent(u.split("/").pop() || u);
const dirname = (u: string) => decodeURIComponent(u.split("/").slice(0, -1).join("/"));
const uniq = <T,>(xs: T[]) => Array.from(new Set(xs));
const sStr = (s: string | undefined | null) => (s == null ? "null" : `'${esc(String(s))}'`);
const sNum = (n: number | undefined | null) => (n == null ? "null" : String(n));
const sJson = (v: unknown) => `'${esc(JSON.stringify(v ?? []))}'::jsonb`;

const out: string[] = [];
out.push("begin;");
out.push("");

// ─── Room categories + imagery ──────────────────────────────────────────────
const categories = GUESTY_ROOM_CATEGORIES.map((c, i) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    guestyUrl: c.guestyUrl,
    layout: c.layout,
    order: i,
    images: uniq([c.images.main, ...c.images.secondary, ...(c.images.extras ?? [])]),
}));
const allUrls = uniq(categories.flatMap((c) => c.images));

out.push("delete from public.guesty_category_media;");
out.push("delete from public.guesty_categories;");
out.push("delete from public.media_assets where provider = 'public';");
out.push("");
out.push("insert into public.media_assets (filename, original_filename, storage_path, url, bucket, folder, media_type, provider) values");
out.push(
    allUrls
        .map((u) => `  (${sStr(basename(u))}, ${sStr(basename(u))}, ${sStr(u)}, ${sStr(u)}, 'public', ${sStr(dirname(u))}, 'image', 'public')`)
        .join(",\n") + ";"
);
out.push("");
out.push("insert into public.guesty_categories (slug, title, subtitle, description, guesty_url, layout, display_order, is_published) values");
out.push(
    categories
        .map((c) => `  (${sStr(c.slug)}, ${sStr(c.title)}, ${sStr(c.subtitle)}, ${sStr(c.description)}, ${sStr(c.guestyUrl)}, ${sStr(c.layout)}, ${c.order}, true)`)
        .join(",\n") + ";"
);
out.push("");
const catMediaRows: string[] = [];
for (const c of categories) c.images.forEach((u, ord) => catMediaRows.push(`  (${sStr(c.slug)}, ${sStr(u)}, ${ord})`));
out.push("insert into public.guesty_category_media (category_id, media_id, display_order)");
out.push("select cat.id, m.id, v.ord");
out.push(`from (values\n${catMediaRows.join(",\n")}\n) as v(slug, url, ord)`);
out.push("join public.guesty_categories cat on cat.slug = v.slug");
out.push("join public.media_assets m on m.url = v.url and m.provider = 'public';");
out.push("");

// ─── Map pins (conveniences) + categories ───────────────────────────────────
const catIdToLabel = new Map(GUESTY_LOCATION_CATEGORIES.map((c) => [c.id, c.label]));

out.push("delete from public.conveniences;");
out.push("delete from public.location_categories;");
out.push("");
out.push("insert into public.location_categories (label, icon, color, sort_order) values");
out.push(
    GUESTY_LOCATION_CATEGORIES
        .map((c, i) => `  (${sStr(c.label)}, ${sStr(c.icon)}, ${sStr(c.color)}, ${i})`)
        .join(",\n") + ";"
);
out.push("");
const convRows = GUESTY_CONVENIENCES.map((c) => {
    const label = catIdToLabel.get(c.categoryId);
    if (!label) throw new Error(`Convenience '${c.name}' has unknown categoryId '${c.categoryId}'`);
    return `  (${sStr(c.name)}, ${sStr(label)}, ${sStr(c.type)}, ${sNum(c.lat)}, ${sNum(c.lng)}, ${sStr(c.distanceLabel)}, ${sStr(c.description)}, ${sStr(c.popupImage)}, ${sNum(c.rating)})`;
});
out.push("insert into public.conveniences (name, category_id, type, lat, lng, distance_label, description, popup_image, rating)");
out.push("select v.name, lc.id, v.type, v.lat::numeric(9,6), v.lng::numeric(9,6), v.distance_label, v.description, v.popup_image, v.rating::numeric(2,1)");
out.push(`from (values\n${convRows.join(",\n")}\n) as v(name, cat_label, type, lat, lng, distance_label, description, popup_image, rating)`);
out.push("join public.location_categories lc on lc.label = v.cat_label;");
out.push("");

// ─── FAQs ───────────────────────────────────────────────────────────────────
out.push("delete from public.faqs;");
out.push("insert into public.faqs (question, answer, category, sort_order) values");
out.push(
    GUESTY_FAQS
        .map((f, i) => `  (${sStr(f.question)}, ${sStr(f.answer)}, ${sStr(f.category)}, ${i})`)
        .join(",\n") + ";"
);
out.push("");

// ─── Attractions (incl. galleries + external links) ─────────────────────────
out.push("delete from public.attractions;");
out.push("insert into public.attractions (name, description, image, distance, external_url, gallery) values");
out.push(
    GUESTY_ATTRACTIONS
        .map((a) => `  (${sStr(a.name)}, ${sStr(a.description)}, ${sStr(a.image)}, ${sStr(a.distance)}, ${sStr(a.externalUrl)}, ${sJson(a.gallery)})`)
        .join(",\n") + ";"
);
out.push("");

// ─── Hero (media assets + document) ──────────────────────────────────────────
const heroMedia = [
    { url: GUESTY_HERO.poster, type: "image", mime: "image/jpeg" },
    { url: GUESTY_HERO.videos.mobile, type: "video", mime: "video/mp4" },
    { url: GUESTY_HERO.videos.desktop, type: "video", mime: "video/mp4" },
].filter((m) => !!m.url);
if (heroMedia.length) {
    out.push("-- Hero media (poster + videos) so they appear in the pickers; referenced from /public.");
    out.push("insert into public.media_assets (filename, original_filename, storage_path, url, bucket, folder, media_type, mime_type, provider) values");
    out.push(
        heroMedia
            .map((m) => `  (${sStr(basename(m.url))}, ${sStr(basename(m.url))}, ${sStr(m.url)}, ${sStr(m.url)}, 'public', ${sStr(dirname(m.url))}, ${sStr(m.type)}, ${sStr(m.mime)}, 'public')`)
            .join(",\n") + ";"
    );
    out.push("");
}
out.push("-- Hero document (page_content singleton).");
out.push(`insert into public.page_content (id, hero) values (1, ${sJson(GUESTY_HERO)})`);
out.push("on conflict (id) do update set hero = excluded.hero;");
out.push("");
out.push("commit;");

process.stdout.write(out.join("\n") + "\n");
