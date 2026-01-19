-- Add featured column to honeys table
ALTER TABLE honeys ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for featured honeys query (standard index for H2/PostgreSQL compatibility)
CREATE INDEX idx_honeys_featured ON honeys(featured);
