// Pre-deploy check: every public asset referenced from src/ must exist
// in git at the exact case it's referenced. Catches Linux-deploy 404s
// that Windows hides with its case-insensitive filesystem.
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const srcFiles = execSync('git ls-files src', { encoding: 'utf8' })
    .split('\n')
    .filter(f => f && /\.(tsx?|jsx?|css)$/.test(f));

// quotepath=false → raw UTF-8 paths instead of octal-escaped non-ASCII
const tracked = new Set(
    execSync('git -c core.quotepath=false ls-files public/', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean)
);

// Match /images/... or /hero_videos/... preceded by a string-literal boundary
// so we don't false-positive on CDN URLs (https://example.com/images/...).
const re = /(?<=["'`])\/(?:images|hero_videos)\/[^"'`)<>]+\.(?:jpg|jpeg|png|svg|webp|mp4)/gi;

const refs = new Set();
for (const f of srcFiles) {
    const matches = fs.readFileSync(f, 'utf8').match(re) || [];
    for (const m of matches) refs.add(m);
}

let issues = 0;
for (const ref of refs) {
    const expected = 'public' + decodeURIComponent(ref);
    if (tracked.has(expected)) continue;
    const found = [...tracked].find(t => t.toLowerCase() === expected.toLowerCase());
    console.log(found ? `CASE MISMATCH:\n  code:    ${expected}\n  on disk: ${found}` : `MISSING: ${expected}`);
    issues++;
}
console.log(`---\nRefs scanned: ${refs.size}\nIssues: ${issues}`);
process.exit(issues === 0 ? 0 : 1);
