// One-shot script: read every room photo, downscale to a sane web size,
// re-encode with mozjpeg, write to a sibling "Optimized" folder so the
// originals stay untouched.
//
// Usage:  node scripts/optimize-room-photos.mjs
// Output: public/images/Kismet_Room_Photos/Optimized/<...same nested layout...>

import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SRC = 'public/images/Kismet_Room_Photos/Room Photos';
const DEST = 'public/images/Kismet_Room_Photos/Optimized';
const MAX_EDGE = 2400;     // longest side, in px — covers 4K retina
const QUALITY = 82;        // mozjpeg quality — visually identical to 85+ at smaller files
const CONCURRENCY = 6;     // parallel encodes; raise if your machine has cores to spare

async function listJpgs(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const out = [];
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
            out.push(...(await listJpgs(full)));
        } else if (
            e.isFile() &&
            /\.jpe?g$/i.test(e.name) &&
            !e.name.startsWith('._')   // macOS resource-fork sidecars
        ) {
            out.push(full);
        }
    }
    return out;
}

async function processOne(src) {
    const rel = path.relative(SRC, src);
    const dest = path.join(DEST, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });

    const oldSize = (await fs.stat(src)).size;

    await sharp(src)
        .rotate() // honour EXIF orientation, then strip it
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(dest);

    const newSize = (await fs.stat(dest)).size;
    return { rel, oldSize, newSize };
}

async function runPool(items, worker, concurrency) {
    const results = [];
    let cursor = 0;
    const runners = Array.from({ length: concurrency }, async () => {
        while (cursor < items.length) {
            const i = cursor++;
            try {
                results.push(await worker(items[i]));
            } catch (err) {
                console.error(`  ✖ ${items[i]} — ${err.message}`);
            }
        }
    });
    await Promise.all(runners);
    return results;
}

async function main() {
    const start = Date.now();
    const files = await listJpgs(SRC);
    if (files.length === 0) {
        console.error('No JPGs found under', SRC);
        process.exit(1);
    }
    console.log(`Found ${files.length} files. Resizing to ${MAX_EDGE}px max edge, JPEG q${QUALITY} (mozjpeg).`);
    console.log(`Source:      ${SRC}`);
    console.log(`Destination: ${DEST}`);
    console.log('');

    let done = 0;
    const results = await runPool(files, async (src) => {
        const r = await processOne(src);
        done++;
        if (done % 25 === 0 || done === files.length) {
            console.log(`  ${done}/${files.length}`);
        }
        return r;
    }, CONCURRENCY);

    const totalOld = results.reduce((s, r) => s + r.oldSize, 0);
    const totalNew = results.reduce((s, r) => s + r.newSize, 0);
    const mb = (n) => (n / 1024 / 1024).toFixed(1);
    const seconds = ((Date.now() - start) / 1000).toFixed(1);

    console.log('');
    console.log(`Done in ${seconds}s.`);
    console.log(`  Source total: ${mb(totalOld)} MB`);
    console.log(`  Output total: ${mb(totalNew)} MB  (${(100 * (1 - totalNew / totalOld)).toFixed(0)}% smaller)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
