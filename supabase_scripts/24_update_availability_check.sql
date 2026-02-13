-- Replaces the check_room_availability function to ensure it accounts for 'active' bookings.
-- Previously it might have only checked for 'confirmed'.

CREATE OR REPLACE FUNCTION check_room_availability(
    p_room_id UUID,
    p_start DATE,
    p_end DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    -- Check for conflicting bookings
    -- Statuses that block a room: 'confirmed', 'active' (checked-in)
    SELECT COUNT(*)
    INTO conflict_count
    FROM bookings
    WHERE room_id = p_room_id
      AND status IN ('confirmed', 'active')
      AND (
          (check_in < p_end AND check_out > p_start)
      );

    IF conflict_count > 0 THEN
        RETURN FALSE;
    END IF;

    -- Check for blocked dates (Maintenance, Renovations, etc.)
    SELECT COUNT(*)
    INTO conflict_count
    FROM blocked_dates
    WHERE room_id = p_room_id
      AND (
          (from_date < p_end AND to_date > p_start)
      );

    IF conflict_count > 0 THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$;
