// Applies the version-controlled R2 CORS policy (scripts/r2-cors.json) to the
// bucket, so browser-to-R2 video uploads (GuestyVideoUploader → presigned PUT)
// are not blocked by CORS. Reuses the same R2 credentials the app uses
// (aws4fetch + S3 PutBucketCors API) — no wrangler / Cloudflare API token needed.
//
//   node scripts/set-r2-cors.mjs          # apply scripts/r2-cors.json to the bucket
//   node scripts/set-r2-cors.mjs --get    # print the bucket's current CORS policy
//
// Requires R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
// (read from the real environment, then .env.local, then .env).

import { AwsClient } from 'aws4fetch';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// Next.js-style env precedence: real env wins, then .env.local, then .env.
dotenv.config({ path: '.env.local' });
dotenv.config();

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;

const missing = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']
    .filter((k) => !process.env[k]);
if (missing.length) {
    console.error(`Missing env var(s): ${missing.join(', ')}. Add them to .env.local.`);
    process.exit(1);
}

const client = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
});

const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}?cors`;

const esc = (s) =>
    String(s).replace(/[<>&'"]/g, (c) =>
        ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])
    );

function toCorsXml(rules) {
    const rulesXml = rules
        .map((r) => {
            const parts = [];
            for (const o of r.AllowedOrigins ?? []) parts.push(`<AllowedOrigin>${esc(o)}</AllowedOrigin>`);
            for (const m of r.AllowedMethods ?? []) parts.push(`<AllowedMethod>${esc(m)}</AllowedMethod>`);
            for (const h of r.AllowedHeaders ?? []) parts.push(`<AllowedHeader>${esc(h)}</AllowedHeader>`);
            for (const h of r.ExposeHeaders ?? []) parts.push(`<ExposeHeader>${esc(h)}</ExposeHeader>`);
            if (r.MaxAgeSeconds != null) parts.push(`<MaxAgeSeconds>${r.MaxAgeSeconds}</MaxAgeSeconds>`);
            return `<CORSRule>${parts.join('')}</CORSRule>`;
        })
        .join('');
    return `<?xml version="1.0" encoding="UTF-8"?><CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">${rulesXml}</CORSConfiguration>`;
}

async function get() {
    const res = await client.fetch(endpoint, { method: 'GET' });
    const text = await res.text();
    if (res.status === 404 || /NoSuchCORSConfiguration/.test(text)) {
        console.log('No CORS policy is currently set on this bucket.');
        return;
    }
    if (!res.ok) throw new Error(`GET cors failed (${res.status}): ${text}`);
    console.log(text);
}

async function put() {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const rules = JSON.parse(readFileSync(path.join(dir, 'r2-cors.json'), 'utf8'));
    const body = toCorsXml(rules);
    // S3 PutBucketCors requires a Content-MD5 of the body.
    const contentMd5 = createHash('md5').update(body).digest('base64');
    const res = await client.fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/xml', 'Content-MD5': contentMd5 },
        body,
    });
    if (!res.ok) throw new Error(`PutBucketCors failed (${res.status}): ${await res.text()}`);
    const origins = rules.flatMap((r) => r.AllowedOrigins ?? []);
    console.log(`✓ Applied CORS policy to bucket "${R2_BUCKET}" for: ${origins.join(', ')}`);
}

(process.argv.includes('--get') ? get() : put()).catch((e) => {
    console.error(e.message);
    process.exit(1);
});
