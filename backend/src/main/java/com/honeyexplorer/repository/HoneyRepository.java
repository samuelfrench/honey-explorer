package com.honeyexplorer.repository;

import com.honeyexplorer.entity.Honey;
import com.honeyexplorer.entity.enums.FloralSource;
import com.honeyexplorer.entity.enums.HoneyOrigin;
import com.honeyexplorer.entity.enums.HoneyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Honey entities.
 * Provides data access and query methods for honey variety discovery.
 */
@Repository
public interface HoneyRepository extends JpaRepository<Honey, UUID> {

    /**
     * Find honey by SEO-friendly slug.
     */
    Optional<Honey> findBySlug(String slug);

    /**
     * Find all honeys by floral source for faceted filtering.
     */
    List<Honey> findByFloralSource(FloralSource floralSource);

    /**
     * Find all honeys by origin for faceted filtering.
     */
    List<Honey> findByOrigin(HoneyOrigin origin);

    /**
     * Find all honeys by type for faceted filtering.
     */
    List<Honey> findByType(HoneyType type);
}
