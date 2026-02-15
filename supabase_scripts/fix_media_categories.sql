-- Fix PRIMARY images based on is_primary flag
UPDATE room_media
SET category = 'primary'
WHERE is_primary = true;

-- Fix SECONDARY images based on display_order (assuming they are not primary)
-- display_order 1 and 2 are usually the secondary slots
UPDATE room_media
SET category = 'secondary'
WHERE is_primary = false 
  AND display_order IN (1, 2);

-- Ensure remaining images are GALLERY (this is likely already the case, but good to be explicit)
UPDATE room_media
SET category = 'gallery'
WHERE is_primary = false 
  AND display_order > 2
  AND category NOT IN ('primary', 'secondary'); -- Don't overwrite if manual fix was applied

-- Verification query
SELECT 
  r.name as room_name,
  rm.category,
  rm.is_primary,
  rm.display_order
FROM room_media rm
JOIN rooms r ON rm.room_id = r.id
ORDER BY r.name, rm.display_order;
