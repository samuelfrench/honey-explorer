package com.honeyexplorer.repository;

import com.honeyexplorer.entity.Event;
import com.honeyexplorer.entity.enums.EventType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;

/**
 * JPA Specifications for dynamic Event queries.
 */
public class EventSpecification {

    private EventSpecification() {}

    /**
     * Build a specification with multiple optional filters.
     */
    public static Specification<Event> withFilters(
            String search,
            List<String> eventTypes,
            List<String> states,
            LocalDate fromDate,
            LocalDate toDate,
            boolean activeOnly
    ) {
        Specification<Event> spec = Specification.where(null);

        if (search != null && !search.isBlank()) {
            spec = spec.and(nameOrDescriptionContains(search));
        }

        if (eventTypes != null && !eventTypes.isEmpty()) {
            spec = spec.and(eventTypeIn(eventTypes));
        }

        if (states != null && !states.isEmpty()) {
            spec = spec.and(stateIn(states));
        }

        if (fromDate != null) {
            spec = spec.and(startDateFrom(fromDate));
        }

        if (toDate != null) {
            spec = spec.and(startDateTo(toDate));
        }

        if (activeOnly) {
            spec = spec.and(isActive());
        }

        return spec;
    }

    private static Specification<Event> nameOrDescriptionContains(String search) {
        String pattern = "%" + search.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
            cb.like(cb.lower(root.get("name")), pattern),
            cb.like(cb.lower(root.get("description")), pattern),
            cb.like(cb.lower(root.get("city")), pattern)
        );
    }

    private static Specification<Event> eventTypeIn(List<String> types) {
        List<EventType> eventTypes = types.stream()
            .map(EventType::valueOf)
            .toList();
        return (root, query, cb) -> root.get("eventType").in(eventTypes);
    }

    private static Specification<Event> stateIn(List<String> states) {
        return (root, query, cb) -> root.get("state").in(states);
    }

    private static Specification<Event> startDateFrom(LocalDate date) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("startDate"), date);
    }

    private static Specification<Event> startDateTo(LocalDate date) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("startDate"), date);
    }

    private static Specification<Event> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("isActive"));
    }
}
