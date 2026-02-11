-- Remove the legacy images column as the new media system is fully operational
ALTER TABLE rooms DROP COLUMN images;
