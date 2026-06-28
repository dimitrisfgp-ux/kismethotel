import { NextRequest } from "next/server";
import { r2Get } from "@/lib/r2";

/**
 * Public read proxy for the private R2 bucket. The browser (and Next's image
 * optimizer) fetch /api/media/<key>; we stream the object from R2 with a long
 * immutable cache (keys are unique per upload).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
    const { key } = await params;
    const objectKey = (key ?? []).join("/");

    if (!objectKey) {
        return new Response("Not found", { status: 404 });
    }

    let res: Response;
    try {
        res = await r2Get(objectKey);
    } catch {
        return new Response("Bad gateway", { status: 502 });
    }

    if (!res.ok || !res.body) {
        return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", res.headers.get("content-type") ?? "application/octet-stream");
    const len = res.headers.get("content-length");
    if (len) headers.set("Content-Length", len);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(res.body, { status: 200, headers });
}
