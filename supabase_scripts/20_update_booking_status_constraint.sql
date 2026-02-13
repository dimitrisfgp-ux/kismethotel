-- Update the check constraint for bookings status to include 'active' and 'expired'
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check CHECK (
  status IN ('held', 'pending', 'confirmed', 'active', 'completed', 'cancelled', 'expired')
);
