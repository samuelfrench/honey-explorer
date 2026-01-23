package com.honeyexplorer.dto;

import com.honeyexplorer.entity.CityContent;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Data Transfer Object for CityContent entity.
 * Used for API responses for city landing pages.
 */
public record CityContentDTO(
    UUID id,
    String city,
    String state,
    String slug,
    BigDecimal latitude,
    BigDecimal longitude,
    String introText,
    String honeyFacts,
    String buyingTips,
    String bestSeasons,
    String faqJson,
    Boolean validated,
    Integer validationScore,
    // Additional computed fields
    int nearbySourcesCount,
    int upcomingEventsCount
) {
    /**
     * Create a CityContentDTO from a CityContent entity.
     */
    public static CityContentDTO from(CityContent city) {
        return from(city, 0, 0);
    }

    /**
     * Create a CityContentDTO from a CityContent entity with counts.
     */
    public static CityContentDTO from(CityContent city, int nearbySourcesCount, int upcomingEventsCount) {
        return new CityContentDTO(
            city.getId(),
            city.getCity(),
            city.getState(),
            city.getSlug(),
            city.getLatitude(),
            city.getLongitude(),
            city.getIntroText(),
            city.getHoneyFacts(),
            city.getBuyingTips(),
            city.getBestSeasons(),
            city.getFaqJson(),
            city.getValidated(),
            city.getValidationScore(),
            nearbySourcesCount,
            upcomingEventsCount
        );
    }

    /**
     * Create a summary DTO for list views.
     */
    public static CityContentDTO summary(CityContent city) {
        return new CityContentDTO(
            city.getId(),
            city.getCity(),
            city.getState(),
            city.getSlug(),
            city.getLatitude(),
            city.getLongitude(),
            null,  // Don't include full text in list views
            null,
            null,
            null,
            null,
            city.getValidated(),
            city.getValidationScore(),
            0,
            0
        );
    }
}
