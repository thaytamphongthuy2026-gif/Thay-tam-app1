-- Add profile fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS birth_date_type VARCHAR(10) DEFAULT 'lunar' CHECK (birth_date_type IN ('lunar', 'solar')),
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_profile_completed ON users(profile_completed);
CREATE INDEX IF NOT EXISTS idx_users_birth_date ON users(birth_date);

-- Add comment
COMMENT ON COLUMN users.birth_date IS 'User birth date (can be lunar or solar calendar)';
COMMENT ON COLUMN users.birth_date_type IS 'Type of birth date: lunar (âm lịch) or solar (dương lịch)';
COMMENT ON COLUMN users.gender IS 'User gender: male, female, or other';
COMMENT ON COLUMN users.profile_completed IS 'Whether user has completed onboarding profile setup';
