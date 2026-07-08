// One-time migration: rewrite stored media URLs from the same-origin proxy
// (/api/media/<key>) to the public R2 CDN domain (NEXT_PUBLIC_R2_PUBLIC_URL/<key>),
// so existing content is served straight from Cloudflare instead of the Vercel proxy.
//
// ONLY run this AFTER the CDN domain (e.g. https://media.kismetrooms.gr) is live and
// actually serving objects — otherwise you'll point existing media at a dead host.
//
//   node scripts/migrate-media-urls.mjs            # DRY RUN — reports what would change
//   node scripts/migrate-media-urls.mjs --apply    # actually writes the changes
//   node scripts/migrate-media-urls.mjs --revert --apply   # roll back CDN -> /api/media
//
// Reads NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and
// NEXT_PUBLIC_R2_PUBLIC_URL from .env.local. Idempotent: re-running finds nothing
// left to change. Uses the service-role key (bypasses RLS) via PostgREST.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const REVERT = process.argv.includes('--revert');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const base = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');

if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}
if (!base) {
    console.error('Missing NEXT_PUBLIC_R2_PUBLIC_URL in .env.local (e.g. https://media.kismetrooms.gr)');
    process.exit(1);
}

const PROXY = '/api/media/';
const CDN = `${base}/`;
const FROM = REVERT ? CDN : PROXY;
const TO = REVERT ? PROXY : CDN;

const supabase = createClient(url, key, { auth: { persistSession: false } });

// Tables and which columns hold media URLs (plain text vs JSON blobs).
const TARGETS = [
    { table: 'media_assets', text: ['url'], json: [] },
    { table: 'page_content', text: [], json: ['hero', 'sections'] },
    { table: 'attractions', text: ['image'], json: ['gallery'] },
    { table: 'conveniences', text: ['popup_image'], json: [] },
];

const rewrite = (s) => (typeof s === 'string' && s.includes(FROM) ? s.split(FROM).join(TO) : s);

let totalChanged = 0;

for (const { table, text, json } of TARGETS) {
    const cols = ['id', ...text, ...json].join(', ');
    const { data, error } = await supabase.from(table).select(cols);
    if (error) {
        console.error(`  ${table}: read failed — ${error.message}`);
        continue;
    }

    let changed = 0;
    for (const row of data) {
        const patch = {};

        for (const c of text) {
            const next = rewrite(row[c]);
            if (next !== row[c]) patch[c] = next;
        }
        for (const c of json) {
            if (row[c] == null) continue;
            const str = JSON.stringify(row[c]);
            if (str.includes(FROM)) patch[c] = JSON.parse(str.split(FROM).join(TO));
        }

        if (Object.keys(patch).length === 0) continue;
        changed++;
        totalChanged++;

        if (APPLY) {
            const { error: upErr } = await supabase.from(table).update(patch).eq('id', row.id);
            if (upErr) console.error(`  ${table}#${row.id}: update failed — ${upErr.message}`);
        } else {
            console.log(`  [dry-run] ${table}#${row.id} → ${Object.keys(patch).join(', ')}`);
        }
    }
    console.log(`${table}: ${changed} row(s) ${APPLY ? 'updated' : 'would change'}`);
}

console.log(
    `\n${REVERT ? 'REVERT' : 'MIGRATE'} ${FROM} -> ${TO}` +
    `\n${totalChanged} row(s) ${APPLY ? 'changed.' : 'would change. Re-run with --apply to write.'}`
);
