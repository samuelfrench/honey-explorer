-- City landing pages for local SEO
CREATE TABLE city_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    intro_text TEXT,
    honey_facts TEXT,
    buying_tips TEXT,
    best_seasons TEXT,
    faq_json JSONB,
    validated BOOLEAN DEFAULT false,
    validation_score INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_city_content_slug ON city_content(slug);
CREATE INDEX idx_city_content_city_state ON city_content(city, state);
CREATE INDEX idx_city_content_validated ON city_content(validated);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_city_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER city_content_updated_at
    BEFORE UPDATE ON city_content
    FOR EACH ROW
    EXECUTE FUNCTION update_city_content_timestamp();
