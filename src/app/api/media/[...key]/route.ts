import { NextRequest } from "next/server";
import mime from "mime-types";
import { r2Get } from "@/lib/r2";

/**
 * Public read proxy for the private R2 bucket. The browser (and Next's image
 * optimizer / <video> element) fetch /api/media/<key>; we stream the object
 * from R2 with a long immutable cache and Range support (for video seeking).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
    const { key } = await params;
    const objectKey = (key ?? []).join("/");
    if (!objectKey) {
        return new Response("Not found", { status: 404 });
    }

    const range = req.headers.get("range");
    let res: Response;
    try {
        res = await r2Get(objectKey, range ? { headers: { Range: range } } : undefined);
    } catch {
        return new Response("Bad gateway", { status: 502 });
    }

    if (!res.ok || !res.body) {
        return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    const contentType = mime.lookup(objectKey) || res.headers.get("content-type") || "application/octet-stream";
    headers.set("Content-Type", String(contentType));
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Accept-Ranges", "bytes");
    for (const h of ["content-length", "content-range", "etag", "last-modified"]) {
        const v = res.headers.get(h);
        if (v) headers.set(h, v);
    }

    // res.status is 200 (full) or 206 (partial, when a Range was requested).
    return new Response(res.body, { status: res.status, headers });
}
