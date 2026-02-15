
SELECT 
    table_name, 
    column_name, 
    data_type, 
    column_default, 
    is_identity
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name = 'id'
ORDER BY table_name;
