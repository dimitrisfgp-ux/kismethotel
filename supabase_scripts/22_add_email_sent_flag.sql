-- Add flag to track if pre-checkout email has been sent
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS pre_checkout_email_sent BOOLEAN DEFAULT FALSE;

-- Optional: Create index for performance if table grows large
CREATE INDEX IF NOT EXISTS idx_bookings_pre_checkout_sent ON bookings(pre_checkout_email_sent);
