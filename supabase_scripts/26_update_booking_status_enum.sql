-- Update the check constraint for booking statuses to include Stripe-related states
-- This MUST be run before deploying code that uses these new statuses

BEGIN;

-- 1. Drop the existing constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- 2. Add the new constraint with extended values
-- Old: 'held','confirmed','active','completed','cancelled','expired' (and 'pending' was there in some versions but cleaning up now)
-- New: 
--   'held'             -> Initial lock (pre-payment)
--   'pending'          -> Stripe Intent Created / Processing
--   'awaiting_payment' -> For async payment methods (Bank Transfer, etc)
--   'payment_failed'   -> Webhook received failure
--   'confirmed'        -> Payment succeeded
--   'active'           -> Checked In
--   'completed'        -> Checked Out
--   'cancelled'        -> Admin cancelled
--   'expired'          -> Hold timed out (if we store expired bookings)

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check CHECK (
  status IN (
    'held',
    'pending',
    'awaiting_payment',
    'payment_failed',
    'confirmed',
    'active',
    'completed',
    'cancelled',
    'expired',
    'refunding' -- Added for future proofing cancellations
  )
);

COMMIT;
