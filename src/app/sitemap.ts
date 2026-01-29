import { MetadataRoute } from 'next'
import { ROOMS } from '@/data/rooms'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://kismethotel.com'

    // Static Routes
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

    // Dynamic Rooms
    const roomRoutes = ROOMS.map((room) => ({
        url: `${baseUrl}/rooms/${room.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...roomRoutes]
}
