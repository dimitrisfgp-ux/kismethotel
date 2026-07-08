import { AwsClient } from "aws4fetch";
import https from "node:https";

/**
 * Cloudflare R2 access (S3-compatible) via SigV4. Uploads and signing always use
 * these credentials. Reads are served either through the same-origin /api/media
 * proxy (private bucket) or, when NEXT_PUBLIC_R2_PUBLIC_URL is set, straight from
 * the public bucket's Cloudflare CDN domain — see r2PublicPath().
 */

const ENDPOINT = () => `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const BUCKET = () => process.env.R2_BUCKET as string;

let _client: AwsClient | null = null;
function client(): AwsClient {
    if (!_client) {
        _client = new AwsClient({
            accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            service: "s3",
            region: "auto",
        });
    }
    return _client;
}

export function r2Configured(): boolean {
    return Boolean(
        process.env.R2_ACCOUNT_ID &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY &&
        process.env.R2_BUCKET
    );
}

const objectUrl = (key: string) => `${ENDPOINT()}/${BUCKET()}/${key}`;

export async function r2Put(key: string, body: Uint8Array, contentType: string): Promise<void> {
    // Sign with aws4fetch, but DON'T send via the global fetch: Next.js patches
    // fetch and streams request bodies >64 KB with chunked transfer-encoding,
    // dropping Content-Length — which R2 rejects with 411 MissingContentLength.
    // Transport via node:https with an explicit Content-Length instead.
    const buf = Buffer.from(body);
    const signed = await client().sign(objectUrl(key), {
        method: "PUT",
        body: buf,
        headers: { "Content-Type": contentType },
    });
    const headers: Record<string, string> = {};
    signed.headers.forEach((v, k) => { headers[k] = v; });
    headers["content-length"] = String(buf.byteLength);

    const { status, text } = await new Promise<{ status: number; text: string }>((resolve, reject) => {
        const u = new URL(signed.url);
        const req = https.request(
            { hostname: u.hostname, path: u.pathname + u.search, method: "PUT", headers },
            (res) => {
                const chunks: Buffer[] = [];
                res.on("data", (c) => chunks.push(c as Buffer));
                res.on("end", () => resolve({ status: res.statusCode ?? 0, text: Buffer.concat(chunks).toString() }));
            }
        );
        req.on("error", reject);
        req.end(buf);
    });
    if (status < 200 || status >= 300) {
        throw new Error(`R2 PUT failed (${status}): ${text}`);
    }
}

export async function r2Get(key: string, init?: { headers?: HeadersInit }): Promise<Response> {
    return client().fetch(objectUrl(key), { method: "GET", headers: init?.headers });
}

export async function r2Delete(key: string): Promise<void> {
    const res = await client().fetch(objectUrl(key), { method: "DELETE" });
    // 204 = deleted, 404 = already gone — both fine.
    if (!res.ok && res.status !== 404) {
        throw new Error(`R2 DELETE failed (${res.status})`);
    }
}

/**
 * Presigned PUT URL so the browser can upload large files (videos) straight to
 * R2 without going through the server. The Content-Type is part of the
 * signature, so the client must PUT with the same Content-Type.
 */
export async function r2PresignPut(key: string, contentType: string, expiresSeconds = 600): Promise<string> {
    const url = new URL(objectUrl(key));
    url.searchParams.set("X-Amz-Expires", String(expiresSeconds));
    const signed = await client().sign(url.toString(), {
        method: "PUT",
        headers: { "Content-Type": contentType },
        aws: { signQuery: true },
    });
    return signed.url;
}

/**
 * URL the browser uses to fetch an R2 object.
 *
 * If NEXT_PUBLIC_R2_PUBLIC_URL is set (a public R2 bucket exposed via a Cloudflare
 * custom domain, e.g. https://media.kismetrooms.gr), objects are served straight
 * from Cloudflare's CDN — fast, edge-cached, Range-aware. Otherwise it falls back
 * to the same-origin /api/media proxy route (private bucket).
 *
 * Only affects newly-registered media; URLs already stored in the DB keep whatever
 * they were saved with (re-upload, or run a one-time URL migration, to move them).
 */
export function r2PublicPath(key: string): string {
    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
    return base ? `${base}/${key}` : `/api/media/${key}`;
}
