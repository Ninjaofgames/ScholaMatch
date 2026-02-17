-- Reference SQL for EmailVerificationCode, PasswordResetCode, UserActivity, Profile
-- Django migrations handle this automatically. Run: python manage.py migrate

CREATE TABLE IF NOT EXISTS accounts_profile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES accounts_user(id) ON DELETE CASCADE,
    avatar VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts_emailverificationcode (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES accounts_user(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts_passwordresetcode (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES accounts_user(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts_useractivity (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES accounts_user(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
