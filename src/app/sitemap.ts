import { MetadataRoute } from 'next'
import { roomService } from '@/services/roomService'
import { getMode } from '@/lib/mode'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://kismethotel.com'
    const mode = await getMode()

    // In Guesty mode the per-room pages redirect off-site and Supabase
    // (which serves room data) may be paused — only emit the routes
    // that actually render their own content.
    if (mode === 'guesty') {
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 1,
            },
        ]
    }

    const rooms = await roomService.getRooms()

    const routes = [
        '',
        '/book',
        '/rooms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    const roomRoutes = rooms.map((room) => ({
        url: `${baseUrl}/rooms/${room.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...roomRoutes]
}
