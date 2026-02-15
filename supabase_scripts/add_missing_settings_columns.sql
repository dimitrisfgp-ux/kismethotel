-- Add missing website_url column to hotel_settings table
ALTER TABLE hotel_settings 
ADD COLUMN IF NOT EXISTS website_url text DEFAULT 'https://kismethotel.com';

-- Verify the addition
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'hotel_settings' AND column_name = 'website_url';
