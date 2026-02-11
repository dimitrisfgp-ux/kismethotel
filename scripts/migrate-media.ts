
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'hotel-media';
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

// Map legacy folders to storage folders
// e.g. "Room Imagery/Room 1" -> "rooms/Room 1"
// But user wants to preserve structure.
// So we will upload as: "rooms/Room 1/file.jpg"

async function main() {
    console.log('🚀 Starting Smart Media Migration...');

    // 1. Fetch Rooms to Map Current Usage
    console.log('📦 Fetching Room Data...');
    const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('id, slug, name, images');

    if (roomsError) {
        console.error('❌ Error fetching rooms:', roomsError);
        process.exit(1);
    }
    console.log(`✅ Found ${rooms.length} rooms.`);

    // 2. Scan "Room Imagery"
    const roomImageryPath = path.join(PUBLIC_DIR, 'images', 'Room Imagery');
    if (fs.existsSync(roomImageryPath)) {
        console.log('📂 Scanning Room Imagery...');
        const roomFolders = fs.readdirSync(roomImageryPath).filter(f => fs.statSync(path.join(roomImageryPath, f)).isDirectory());

        for (const roomFolder of roomFolders) {
            console.log(`\n🔹 Processing Room Folder: ${roomFolder}`);
            // Find Matching Room Definition
            // We match broadly (e.g. if room.name contains "Room 1" or similar?)
            // OR we rely on the `images` array values.

            const localFolderPath = path.join(roomImageryPath, roomFolder);
            const files = fs.readdirSync(localFolderPath).filter(f => !f.startsWith('.'));

            // Find which room uses these images
            // Check if any room has an image path containing "Room Imagery/[roomFolder]"
            const matchedRoom = rooms.find(r =>
                r.images && r.images.some((img: string) => img.includes(`Room Imagery/${roomFolder}`))
            );

            if (matchedRoom) {
                console.log(`   🔗 Linked to Room: "${matchedRoom.name}" (${matchedRoom.slug})`);
            } else {
                console.log(`   ⚠️ No direct DB link found for folder "${roomFolder}". Assets will still be uploaded.`);
            }

            for (const file of files) {
                const localFilePath = path.join(localFolderPath, file);
                const fileStat = fs.statSync(localFilePath);

                if (fileStat.isDirectory()) continue;

                const mimeType = mime.lookup(file) || 'application/octet-stream';
                const mediaType = mimeType.startsWith('video') ? 'video' : 'image';

                // Target Path: rooms/[RoomFolder]/[File]
                const storageFolder = `rooms/${roomFolder}`;
                const storagePath = `${storageFolder}/${file}`;

                // 1. Upload / Check Existence
                const publicUrl = await uploadFile(localFilePath, storagePath, mimeType);

                // 2. Upsert Asset
                const asset = await upsertMediaAsset({
                    filename: file,
                    original_filename: file,
                    storage_path: storagePath,
                    url: publicUrl,
                    bucket: BUCKET,
                    folder: storageFolder,
                    media_type: mediaType,
                    mime_type: mimeType,
                    size_bytes: fileStat.size
                });

                if (asset && matchedRoom) {
                    // 3. Link to Room
                    // Check if this specific file was in the legacy list
                    const isLegacyPrimary = matchedRoom.images && matchedRoom.images[0] && matchedRoom.images[0].includes(file);
                    // Or if it's just in the list
                    const legacyIndex = matchedRoom.images ? matchedRoom.images.findIndex((img: string) => img.includes(file)) : -1;

                    const isPrimary = legacyIndex === 0;
                    // Sort order: if legacy, use index. If new, append to end (999)
                    const sortOrder = legacyIndex >= 0 ? legacyIndex : 999;

                    await linkRoomMedia(matchedRoom.id, asset.id, isPrimary, sortOrder);
                }
            }
        }
    }

    // 3. Scan Videos
    const videosPath = path.join(PUBLIC_DIR, 'Videos');
    if (fs.existsSync(videosPath)) {
        console.log('\n🎬 Scanning Videos...');
        // Only recurse one level deep (e.g. ios/file.mp4)
        const platforms = ['ios', 'android', 'desktop'];
        for (const platform of platforms) {
            const platformPath = path.join(videosPath, platform);
            if (fs.existsSync(platformPath)) {
                const videoFiles = fs.readdirSync(platformPath).filter(f => !f.startsWith('.'));
                for (const file of videoFiles) {
                    const localFilePath = path.join(platformPath, file);
                    const mimeType = mime.lookup(file) || 'video/mp4';

                    // Target: videos/[platform]/[file]
                    const storageFolder = `videos/${platform}`;
                    const storagePath = `${storageFolder}/${file}`;

                    const publicUrl = await uploadFile(localFilePath, storagePath, mimeType);

                    await upsertMediaAsset({
                        filename: file,
                        original_filename: file,
                        storage_path: storagePath,
                        url: publicUrl,
                        bucket: BUCKET,
                        folder: storageFolder,
                        media_type: 'video',
                        mime_type: mimeType,
                        size_bytes: fs.statSync(localFilePath).size
                    });
                    // Note: Not linking videos to rooms automatically yet as mapping is unclear
                }
            }
        }
    }

    console.log('\n✨ Migration Complete!');
}

async function uploadFile(localPath: string, storagePath: string, contentType: string) {
    const fileContent = fs.readFileSync(localPath);

    // Check if exists first to save bandwidth? 
    // Just upsert (overwrite) to be safe/idempotent
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileContent, {
            contentType,
            upsert: true
        });

    if (error) {
        console.error(`   ❌ Upload failed for ${storagePath}:`, error.message);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    console.log(`   ✅ Uploaded: ${storagePath}`);
    return publicUrl;
}

async function upsertMediaAsset(assetData: any) {
    // Check if exists
    const { data: existing } = await supabase
        .from('media_assets')
        .select('id')
        .eq('storage_path', assetData.storage_path)
        .single();

    if (existing) {
        console.log(`   🔄 Asset already exists (ID: ${existing.id})`);
        return existing;
    }

    const { data, error } = await supabase
        .from('media_assets')
        .insert(assetData)
        .select()
        .single();

    if (error) {
        console.error('   ❌ DB Insert Failed:', error.message);
        return null;
    }
    console.log(`   ✨ Created Asset (ID: ${data.id})`);
    return data;
}

async function linkRoomMedia(roomId: string, mediaId: string, isPrimary: boolean, sortOrder: number) {
    // Check link
    const { data: existing } = await supabase
        .from('room_media')
        .select('id')
        .eq('room_id', roomId)
        .eq('media_id', mediaId)
        .single();

    if (existing) {
        // Update usage (primary/sort)
        await supabase.from('room_media').update({ is_primary: isPrimary, display_order: sortOrder }).eq('id', existing.id);
        console.log(`   🔗 Link updated (Primary: ${isPrimary})`);
        return;
    }

    const { error } = await supabase
        .from('room_media')
        .insert({
            room_id: roomId,
            media_id: mediaId,
            is_primary: isPrimary,
            display_order: sortOrder
        });

    if (error) {
        console.error('   ❌ Link Failed:', error.message);
    } else {
        console.log(`   🔗 Linked to Room (Primary: ${isPrimary})`);
    }
}

main().catch(console.error);
