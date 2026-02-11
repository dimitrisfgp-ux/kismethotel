-- Add contention_cleared column to booking_holds table
-- This enables bidirectional communication between UserA (holder) and UserB (observer)
-- When UserB clicks "I'll check other dates", contention_cleared is set to true
-- UserA's realtime subscription picks this up and updates the contention notification

ALTER TABLE booking_holds
ADD COLUMN IF NOT EXISTS contention_cleared BOOLEAN DEFAULT FALSE;
