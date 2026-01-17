-- V2__create_honey_tables.sql
-- Creates core honey and local_sources tables for Honey Explorer

-- Honeys table: stores honey varieties with taxonomy and pricing
CREATE TABLE honeys (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    floral_source VARCHAR(50) NOT NULL,
    type VARCHAR(30) NOT NULL,
    origin VARCHAR(30) NOT NULL,
    region VARCHAR(100),
    flavor_profiles VARCHAR(200),
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    brand VARCHAR(100),
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    certifications VARCHAR(200),
    umf_rating INT,
    mgo_rating INT,
    slug VARCHAR(200),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_verified_at TIMESTAMP,
    verification_source VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE
);

-- Local sources table: stores beekeepers, farms, markets, etc.
CREATE TABLE local_sources (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(30) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    hours_json TEXT,
    hero_image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    instagram_handle VARCHAR(100),
    facebook_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_verified_at TIMESTAMP,
    verification_source VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE
);

-- Indexes for common filter queries on honeys
CREATE INDEX idx_honeys_floral_source ON honeys(floral_source);
CREATE INDEX idx_honeys_type ON honeys(type);
CREATE INDEX idx_honeys_origin ON honeys(origin);
CREATE INDEX idx_honeys_slug ON honeys(slug);

-- Indexes for local source discovery
CREATE INDEX idx_local_sources_source_type ON local_sources(source_type);
CREATE INDEX idx_local_sources_state ON local_sources(state);
CREATE INDEX idx_local_sources_location ON local_sources(latitude, longitude);
