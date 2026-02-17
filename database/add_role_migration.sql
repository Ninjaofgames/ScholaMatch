-- Add role column to accounts_user (Django-managed table)
ALTER TABLE accounts_user
ADD COLUMN IF NOT EXISTS role VARCHAR(10) NOT NULL DEFAULT 'user'
CHECK (role IN ('admin', 'user'));

CREATE INDEX IF NOT EXISTS idx_accounts_user_role ON accounts_user(role);
