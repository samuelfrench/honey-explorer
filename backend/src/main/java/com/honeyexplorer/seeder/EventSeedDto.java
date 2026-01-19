package com.honeyexplorer.seeder;

import java.time.LocalDate;

/**
 * DTO for reading event seed data from JSON.
 */
public record EventSeedDto(
    String name,
    String description,
    String eventType,
    LocalDate startDate,
    LocalDate endDate,
    String address,
    String city,
    String state,
    Double latitude,
    Double longitude,
    String imageUrl,
    String thumbnailUrl,
    String link
) {}
