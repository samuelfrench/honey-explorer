-- Create events table for honey-related events
CREATE TABLE events (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    event_type VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    link VARCHAR(500),
    local_source_id UUID,
    slug VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    last_verified_at TIMESTAMP,
    verification_source VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    CONSTRAINT fk_events_local_source FOREIGN KEY (local_source_id) REFERENCES local_sources(id)
);

-- Create indexes for common queries
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_state ON events(state);
CREATE UNIQUE INDEX idx_events_slug ON events(slug);
