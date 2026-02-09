import { MetadataRoute } from 'next'
import { roomService } from '@/services/roomService'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://kismethotel.com'

    // Fetch rooms from database
    const rooms = await roomService.getRooms()

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
    const roomRoutes = rooms.map((room) => ({
        url: `${baseUrl}/rooms/${room.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...roomRoutes]
}
