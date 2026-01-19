-- Add slug column to local_sources table for SEO-friendly URLs
ALTER TABLE local_sources ADD COLUMN slug VARCHAR(255);

-- Create unique index on slug
CREATE UNIQUE INDEX idx_local_sources_slug ON local_sources(slug);
