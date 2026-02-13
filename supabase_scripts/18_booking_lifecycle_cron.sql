-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the function that transitions booking statuses based on current time
CREATE OR REPLACE FUNCTION transition_booking_statuses()
RETURNS void AS $$
DECLARE
    activated_count INT;
    completed_count INT;
BEGIN
    -- 1. Activate Bookings (Confirmed -> Active)
    -- Trigger: Current time >= (Check-In Date + Room Check-In Time)
    WITH activated AS (
        UPDATE bookings b
        SET status = 'active'
        FROM rooms r
        WHERE b.room_id = r.id
          AND b.status = 'confirmed'
          AND (b.check_in::timestamp + r.check_in_time::interval) <= (NOW() AT TIME ZONE 'Europe/Athens')
        RETURNING b.id
    )
    SELECT count(1) INTO activated_count FROM activated;

    -- 2. Complete Bookings (Active -> Completed)
    -- Trigger: Current time >= (Check-Out Date + 1 Day + Room Check-Out Time)
    -- Note: check_out date is the last paid night. The room is vacated the next morning.
    WITH completed AS (
        UPDATE bookings b
        SET status = 'completed'
        FROM rooms r
        WHERE b.room_id = r.id
          AND b.status = 'active'
          AND (b.check_out::timestamp + INTERVAL '1 day' + r.check_out_time::interval) <= (NOW() AT TIME ZONE 'Europe/Athens')
        RETURNING b.id
    )
    SELECT count(1) INTO completed_count FROM completed;

    -- Log activity if anything changed (optional, visible in Postgres logs)
    IF activated_count > 0 OR completed_count > 0 THEN
        RAISE NOTICE 'Booking Lifecycle: Activated %, Completed %', activated_count, completed_count;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Schedule the function to run every 30 minutes
-- (Checking existing schedule first to avoid duplicates if re-run)
SELECT cron.schedule(
    'booking-lifecycle',
    '*/30 * * * *',
    $$SELECT transition_booking_statuses()$$
);

COMMENT ON FUNCTION transition_booking_statuses IS 'Transitions bookings from confirmed->active and active->completed based on room check-in/out times in Europe/Athens timezone.';
