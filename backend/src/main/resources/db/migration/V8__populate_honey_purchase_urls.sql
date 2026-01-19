-- Populate purchase URLs for existing honeys with Amazon search links
-- Uses brand and name to create a search URL

UPDATE honeys
SET purchase_url = 'https://www.amazon.com/s?k=' ||
    REPLACE(
        REPLACE(
            COALESCE(brand || ' ', '') || name || ' honey',
            ' ', '+'
        ),
        '''', ''
    )
WHERE purchase_url IS NULL;
