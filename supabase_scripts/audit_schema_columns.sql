-- Audit Schema Columns for CMS Verification
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'hotel_settings',
    'rooms',
    'room_beds',
    'room_media',
    'room_layout_sections',
    'room_layout_amenities',
    'amenities',
    'bookings',
    'booking_holds',
    'blocked_dates',
    'contact_requests',
    'page_content',
    'location_categories',
    'conveniences',
    'faqs',
    'media_assets',
    'profiles',
    'roles',
    'permissions',
    'role_permissions'
  )
ORDER BY table_name, ordinal_position;
