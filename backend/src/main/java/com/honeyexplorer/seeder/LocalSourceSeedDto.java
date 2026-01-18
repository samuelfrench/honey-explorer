package com.honeyexplorer.seeder;

/**
 * DTO for local source seed data from JSON file.
 */
public record LocalSourceSeedDto(
    String name,
    String sourceType,
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
    String facebookUrl
) {}
