-- Enable Supabase Realtime for booking_holds table
-- Without this, neither UserA nor UserB receive realtime events for hold changes
ALTER PUBLICATION supabase_realtime ADD TABLE booking_holds;
