-- Initial schema setup for Honey Explorer
-- This migration validates Flyway is working correctly
-- Actual schema will be added in Phase 2

CREATE TABLE schema_version_check (
    id INT PRIMARY KEY,
    initialized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255)
);

INSERT INTO schema_version_check (id, description) VALUES (1, 'Initial schema setup - Flyway working');
