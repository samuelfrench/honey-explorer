package com.honeyexplorer.repository;

import com.honeyexplorer.entity.CityContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for CityContent entities.
 * Provides data access for city landing pages.
 */
@Repository
public interface CityContentRepository extends JpaRepository<CityContent, UUID> {

    /**
     * Find city content by slug.
     */
    Optional<CityContent> findBySlug(String slug);

    /**
     * Find city content by city and state.
     */
    Optional<CityContent> findByCityAndState(String city, String state);

    /**
     * Find all validated city content.
     */
    List<CityContent> findByValidatedTrue();

    /**
     * Find all cities in a specific state.
     */
    List<CityContent> findByState(String state);

    /**
     * Find all cities ordered by city name.
     */
    @Query("SELECT c FROM CityContent c WHERE c.validated = true ORDER BY c.city ASC")
    List<CityContent> findAllValidatedOrderByCity();

    /**
     * Count validated cities.
     */
    long countByValidatedTrue();
}
