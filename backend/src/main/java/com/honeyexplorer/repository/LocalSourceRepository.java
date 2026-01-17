package com.honeyexplorer.repository;

import com.honeyexplorer.entity.LocalSource;
import com.honeyexplorer.entity.enums.SourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for LocalSource entities.
 * Provides data access and query methods for local honey source discovery.
 */
@Repository
public interface LocalSourceRepository extends JpaRepository<LocalSource, UUID> {

    /**
     * Find all local sources by source type for faceted filtering.
     */
    List<LocalSource> findBySourceType(SourceType sourceType);

    /**
     * Find all local sources in a specific state.
     */
    List<LocalSource> findByState(String state);

    /**
     * Find all local sources in a specific city.
     */
    List<LocalSource> findByCity(String city);

    /**
     * Find all active local sources.
     */
    List<LocalSource> findByIsActiveTrue();
}
