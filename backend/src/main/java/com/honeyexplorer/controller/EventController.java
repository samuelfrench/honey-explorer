package com.honeyexplorer.controller;

import com.honeyexplorer.dto.EventDTO;
import com.honeyexplorer.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for event endpoints.
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /**
     * Get upcoming events.
     */
    @GetMapping("/upcoming")
    public List<EventDTO> getUpcoming(@RequestParam(defaultValue = "6") int limit) {
        return eventService.findUpcoming(limit);
    }

    /**
     * Browse events with pagination, search, and filtering.
     */
    @GetMapping
    public Page<EventDTO> browse(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> eventType,
            @RequestParam(required = false) List<String> state,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "true") boolean activeOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(defaultValue = "startDate") String sort
    ) {
        return eventService.browse(search, eventType, state, fromDate, toDate, activeOnly, page, size, sort);
    }

    /**
     * Get events for calendar view (specific month).
     */
    @GetMapping("/calendar")
    public List<EventDTO> getCalendar(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return eventService.findByMonth(year, month);
    }

    /**
     * Get an event by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getById(@PathVariable UUID id) {
        return eventService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get an event by slug.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<EventDTO> getBySlug(@PathVariable String slug) {
        return eventService.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get total count of events.
     */
    @GetMapping("/count")
    public long getCount() {
        return eventService.count();
    }
}
