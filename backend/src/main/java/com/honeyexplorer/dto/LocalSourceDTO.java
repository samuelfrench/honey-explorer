package com.honeyexplorer.dto;

import com.honeyexplorer.entity.LocalSource;

import java.util.UUID;

/**
 * Data Transfer Object for LocalSource entity.
 * Used for API responses.
 */
public record LocalSourceDTO(
    UUID id,
    String name,
    String sourceType,
    String sourceTypeDisplay,
    String description,
    String address,
    String city,
    String state,
    String zipCode,
    Double latitude,
    Double longitude,
    String phone,
    String email,
    String website,
    String hoursJson,
    String heroImageUrl,
    String thumbnailUrl,
    String instagramHandle,
    String facebookUrl,
    Boolean isActive,
    String slug,
    Double distance
) {
    /**
     * Create a LocalSourceDTO from a LocalSource entity.
     */
    public static LocalSourceDTO from(LocalSource source) {
        return from(source, null);
    }

    /**
     * Create a LocalSourceDTO from a LocalSource entity with distance.
     */
    public static LocalSourceDTO from(LocalSource source, Double distance) {
        return new LocalSourceDTO(
            source.getId(),
            source.getName(),
            source.getSourceType().name(),
            source.getSourceType().getDisplayName(),
            source.getDescription(),
            source.getAddress(),
            source.getCity(),
            source.getState(),
            source.getZipCode(),
            source.getLatitude(),
            source.getLongitude(),
            source.getPhone(),
            source.getEmail(),
            source.getWebsite(),
            source.getHoursJson(),
            source.getHeroImageUrl(),
            source.getThumbnailUrl(),
            source.getInstagramHandle(),
            source.getFacebookUrl(),
            source.getIsActive(),
            source.getSlug(),
            distance
        );
    }
}
