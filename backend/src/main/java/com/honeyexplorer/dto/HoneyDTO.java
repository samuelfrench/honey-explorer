package com.honeyexplorer.dto;

import com.honeyexplorer.entity.Honey;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Data Transfer Object for Honey entity.
 * Used for API responses.
 */
public record HoneyDTO(
    UUID id,
    String name,
    String description,
    String floralSource,
    String floralSourceDisplay,
    String type,
    String typeDisplay,
    String origin,
    String originDisplay,
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
    boolean featured
) {
    /**
     * Create a HoneyDTO from a Honey entity.
     */
    public static HoneyDTO from(Honey honey) {
        return new HoneyDTO(
            honey.getId(),
            honey.getName(),
            honey.getDescription(),
            honey.getFloralSource().name(),
            honey.getFloralSource().getDisplayName(),
            honey.getType().name(),
            honey.getType().getDisplayName(),
            honey.getOrigin().name(),
            honey.getOrigin().getDisplayName(),
            honey.getRegion(),
            honey.getFlavorProfiles(),
            honey.getImageUrl(),
            honey.getThumbnailUrl(),
            honey.getBrand(),
            honey.getPriceMin(),
            honey.getPriceMax(),
            honey.getCertifications(),
            honey.getUmfRating(),
            honey.getMgoRating(),
            honey.getSlug(),
            honey.isFeatured()
        );
    }
}
