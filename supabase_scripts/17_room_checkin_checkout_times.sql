-- Add check-in and check-out time columns to the rooms table
-- These define the standard arrival/departure times for each room type
-- Used by the booking lifecycle cron to trigger status transitions

ALTER TABLE rooms
    ADD COLUMN check_in_time TIME DEFAULT '15:00:00',
    ADD COLUMN check_out_time TIME DEFAULT '11:00:00';

-- Comment on columns for clarity in DB tools
COMMENT ON COLUMN rooms.check_in_time IS 'Standard check-in time (e.g. 15:00). Bookings become active at check_in_date + this time.';
COMMENT ON COLUMN rooms.check_out_time IS 'Standard check-out time (e.g. 11:00). Bookings become completed at (check_out_date + 1 day) + this time.';
