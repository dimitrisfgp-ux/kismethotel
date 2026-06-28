import { AwsClient } from "aws4fetch";

/**
 * Cloudflare R2 access (S3-compatible) via SigV4. The bucket is PRIVATE —
 * objects are served to the browser through the /api/media proxy route, so no
 * public bucket URL or custom domain is required.
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
    const res = await client().fetch(objectUrl(key), {
        method: "PUT",
        body: body as BodyInit,
        headers: { "Content-Type": contentType },
    });
    if (!res.ok) {
        throw new Error(`R2 PUT failed (${res.status}): ${await res.text().catch(() => "")}`);
    }
}

export async function r2Get(key: string): Promise<Response> {
    return client().fetch(objectUrl(key), { method: "GET" });
}

export async function r2Delete(key: string): Promise<void> {
    const res = await client().fetch(objectUrl(key), { method: "DELETE" });
    // 204 = deleted, 404 = already gone — both fine.
    if (!res.ok && res.status !== 404) {
        throw new Error(`R2 DELETE failed (${res.status})`);
    }
}

/** The same-origin path the browser uses to fetch an R2 object (via the proxy route). */
export function r2PublicPath(key: string): string {
    return `/api/media/${key}`;
}
