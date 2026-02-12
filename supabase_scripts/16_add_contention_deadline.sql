-- Add contention_deadline column to booking_holds
-- This column stores the 7-minute deadline set when UserB triggers contention.
-- It is nullable: null = no contention yet, timestamp = deadline for UserA to complete booking.
ALTER TABLE booking_holds
ADD COLUMN IF NOT EXISTS contention_deadline TIMESTAMPTZ DEFAULT NULL;
