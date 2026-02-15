SELECT 
  rm.room_id,
  r.name as room_name,
  m.url as media_url,
  rm.category,
  rm.is_primary,
  rm.display_order
FROM room_media rm
JOIN rooms r ON rm.room_id = r.id
JOIN media_assets m ON rm.media_id = m.id
ORDER BY r.name, rm.display_order;
