-- Inspect Tables and Columns
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'hotel_settings'
ORDER BY ordinal_position;

-- Inspect Row Data (id=1)
SELECT * FROM hotel_settings WHERE id = 1;

-- Inspect Constraints
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'hotel_settings'::regclass;
