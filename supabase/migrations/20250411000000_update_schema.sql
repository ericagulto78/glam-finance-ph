
-- Add icon column to service_types table
ALTER TABLE service_types ADD COLUMN IF NOT EXISTS icon TEXT;

-- Add persons, transportation_fee, and early_morning_fee columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS persons INTEGER DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transportation_fee INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS early_morning_fee INTEGER DEFAULT 0;
