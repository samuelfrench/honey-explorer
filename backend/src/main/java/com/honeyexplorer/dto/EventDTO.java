package com.honeyexplorer.dto;

import com.honeyexplorer.entity.Event;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Data Transfer Object for Event entity.
 * Used for API responses.
 */
public record EventDTO(
    UUID id,
    String name,
    String description,
    String eventType,
    String eventTypeDisplay,
    LocalDate startDate,
    LocalDate endDate,
    String address,
    String city,
    String state,
    Double latitude,
    Double longitude,
    String imageUrl,
    String thumbnailUrl,
    String link,
    UUID localSourceId,
    String localSourceName,
    String slug,
    Boolean isActive
) {
    /**
     * Create an EventDTO from an Event entity.
     */
    public static EventDTO from(Event event) {
        return new EventDTO(
            event.getId(),
            event.getName(),
            event.getDescription(),
            event.getEventType().name(),
            event.getEventType().getDisplayName(),
            event.getStartDate(),
            event.getEndDate(),
            event.getAddress(),
            event.getCity(),
            event.getState(),
            event.getLatitude(),
            event.getLongitude(),
            event.getImageUrl(),
            event.getThumbnailUrl(),
            event.getLink(),
            event.getLocalSource() != null ? event.getLocalSource().getId() : null,
            event.getLocalSource() != null ? event.getLocalSource().getName() : null,
            event.getSlug(),
            event.getIsActive()
        );
    }
}
