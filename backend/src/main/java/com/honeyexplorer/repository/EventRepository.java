package com.honeyexplorer.repository;

import com.honeyexplorer.entity.Event;
import com.honeyexplorer.entity.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Event entities.
 * Provides data access for honey-related events.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, UUID>, JpaSpecificationExecutor<Event> {

    /**
     * Find upcoming events (starting today or later), ordered by start date.
     */
    @Query("SELECT e FROM Event e WHERE e.startDate >= :today AND e.isActive = true ORDER BY e.startDate ASC")
    List<Event> findUpcoming(@Param("today") LocalDate today);

    /**
     * Find events for a specific month.
     */
    @Query("SELECT e FROM Event e WHERE " +
           "(YEAR(e.startDate) = :year AND MONTH(e.startDate) = :month) OR " +
           "(e.endDate IS NOT NULL AND YEAR(e.endDate) = :year AND MONTH(e.endDate) = :month) " +
           "AND e.isActive = true " +
           "ORDER BY e.startDate ASC")
    List<Event> findByMonth(@Param("year") int year, @Param("month") int month);

    /**
     * Find events by type.
     */
    List<Event> findByEventTypeAndIsActiveTrue(EventType eventType);

    /**
     * Find event by slug.
     */
    Optional<Event> findBySlug(String slug);

    /**
     * Find events by state.
     */
    List<Event> findByStateAndIsActiveTrue(String state);
}
