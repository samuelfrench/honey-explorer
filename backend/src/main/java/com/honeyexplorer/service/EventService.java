package com.honeyexplorer.service;

import com.honeyexplorer.dto.EventDTO;
import com.honeyexplorer.entity.Event;
import com.honeyexplorer.repository.EventRepository;
import com.honeyexplorer.repository.EventSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for event operations.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;

    /**
     * Get upcoming events with pagination.
     */
    public List<EventDTO> findUpcoming(int limit) {
        return eventRepository.findUpcoming(LocalDate.now())
                .stream()
                .limit(limit)
                .map(EventDTO::from)
                .toList();
    }

    /**
     * Browse events with search and filters.
     */
    public Page<EventDTO> browse(
            String search,
            List<String> eventTypes,
            List<String> states,
            LocalDate fromDate,
            LocalDate toDate,
            boolean activeOnly,
            int page,
            int size,
            String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Specification<Event> spec = EventSpecification.withFilters(
            search, eventTypes, states, fromDate, toDate, activeOnly
        );
        return eventRepository.findAll(spec, pageable).map(EventDTO::from);
    }

    /**
     * Get events for a specific month.
     */
    public List<EventDTO> findByMonth(int year, int month) {
        return eventRepository.findByMonth(year, month)
                .stream()
                .map(EventDTO::from)
                .toList();
    }

    /**
     * Get an event by ID.
     */
    public Optional<EventDTO> findById(UUID id) {
        return eventRepository.findById(id).map(EventDTO::from);
    }

    /**
     * Get an event by slug.
     */
    public Optional<EventDTO> findBySlug(String slug) {
        return eventRepository.findBySlug(slug).map(EventDTO::from);
    }

    /**
     * Get total count of events.
     */
    public long count() {
        return eventRepository.count();
    }
}
