-- Populate slug values for existing local sources
-- Generates URL-friendly slugs from name: "Sweet Valley Apiaries" -> "sweet-valley-apiaries"

UPDATE local_sources
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),  -- Remove special characters
            '\s+', '-', 'g'                                      -- Replace spaces with hyphens
        ),
        '-+', '-', 'g'                                           -- Replace multiple hyphens with single
    )
)
WHERE slug IS NULL;
