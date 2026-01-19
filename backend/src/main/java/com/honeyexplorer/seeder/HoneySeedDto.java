package com.honeyexplorer.seeder;

import java.math.BigDecimal;

/**
 * DTO for honey seed data from JSON file.
 */
public record HoneySeedDto(
    String name,
    String description,
    String floralSource,
    String type,
    String origin,
    String region,
    String flavorProfiles,
    String imageUrl,
    String thumbnailUrl,
    String brand,
    BigDecimal priceMin,
    BigDecimal priceMax,
    String certifications,
    Integer umfRating,
    Integer mgoRating,
    String slug,
    Boolean featured
) {
    /**
     * Returns featured status, defaulting to false if null.
     */
    public boolean isFeatured() {
        return featured != null && featured;
    }
}
