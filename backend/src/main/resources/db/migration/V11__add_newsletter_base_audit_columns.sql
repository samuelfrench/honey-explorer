-- Add missing BaseAuditEntity columns to newsletter_subscriptions
ALTER TABLE newsletter_subscriptions
    ADD COLUMN last_verified_at TIMESTAMP,
    ADD COLUMN verification_source VARCHAR(255),
    ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
