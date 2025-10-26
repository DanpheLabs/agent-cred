-- Refresh schema cache by sending a NOTIFY to PostgREST
-- This ensures PostgREST picks up all column changes
NOTIFY pgrst, 'reload schema';