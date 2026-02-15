SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable, 
    is_identity 
FROM information_schema.columns 
WHERE table_name = 'conveniences';
