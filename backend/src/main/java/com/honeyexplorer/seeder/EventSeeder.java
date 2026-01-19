package com.honeyexplorer.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.honeyexplorer.entity.Event;
import com.honeyexplorer.entity.enums.EventType;
import com.honeyexplorer.repository.EventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Seeds the events table from JSON seed data file.
 */
@Component
public class EventSeeder {

    private static final Logger log = LoggerFactory.getLogger(EventSeeder.class);
    private static final String SEED_FILE = "/seed-data/events.json";

    private final EventRepository eventRepository;
    private final ObjectMapper objectMapper;

    public EventSeeder(EventRepository eventRepository, ObjectMapper objectMapper) {
        this.eventRepository = eventRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Seeds events from JSON file if the table is empty.
     *
     * @return number of events seeded (0 if skipped due to existing data)
     */
    public int seedEvents() {
        if (eventRepository.count() > 0) {
            log.info("Event table already has data, skipping seeding");
            return 0;
        }

        try (InputStream inputStream = getClass().getResourceAsStream(SEED_FILE)) {
            if (inputStream == null) {
                log.error("Seed file not found: {}", SEED_FILE);
                return 0;
            }

            List<EventSeedDto> seedData = objectMapper.readValue(
                inputStream,
                new TypeReference<List<EventSeedDto>>() {}
            );

            int count = 0;
            for (EventSeedDto dto : seedData) {
                Event event = mapToEntity(dto);
                eventRepository.save(event);
                count++;
            }

            log.info("Seeded {} events", count);
            return count;

        } catch (IOException e) {
            log.error("Failed to read event seed data", e);
            return 0;
        }
    }

    private Event mapToEntity(EventSeedDto dto) {
        Event event = new Event();
        event.setName(dto.name());
        event.setDescription(dto.description());
        event.setEventType(EventType.valueOf(dto.eventType()));
        event.setStartDate(dto.startDate());
        event.setEndDate(dto.endDate());
        event.setAddress(dto.address());
        event.setCity(dto.city());
        event.setState(dto.state());
        event.setLatitude(dto.latitude());
        event.setLongitude(dto.longitude());
        event.setImageUrl(dto.imageUrl());
        event.setThumbnailUrl(dto.thumbnailUrl());
        event.setLink(dto.link());
        event.setSlug(generateSlug(dto.name()));
        event.setIsActive(true);

        return event;
    }

    /**
     * Generate a URL-friendly slug from a name.
     */
    private String generateSlug(String name) {
        if (name == null) return null;
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
