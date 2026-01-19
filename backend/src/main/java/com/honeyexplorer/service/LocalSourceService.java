package com.honeyexplorer.service;

import com.honeyexplorer.dto.LocalSourceDTO;
import com.honeyexplorer.entity.LocalSource;
import com.honeyexplorer.repository.LocalSourceRepository;
import com.honeyexplorer.repository.LocalSourceSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for local source operations.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocalSourceService {

    private static final double EARTH_RADIUS_MILES = 3958.8;

    private final LocalSourceRepository localSourceRepository;

    /**
     * Get all local sources with pagination.
     */
    public Page<LocalSourceDTO> findAll(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return localSourceRepository.findAll(pageable).map(LocalSourceDTO::from);
    }

    /**
     * Browse local sources with search and filters.
     */
    public Page<LocalSourceDTO> browse(
            String search,
            List<String> sourceTypes,
            List<String> states,
            boolean activeOnly,
            int page,
            int size,
            String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Specification<LocalSource> spec = LocalSourceSpecification.withFilters(search, sourceTypes, states, activeOnly);
        return localSourceRepository.findAll(spec, pageable).map(LocalSourceDTO::from);
    }

    /**
     * Find local sources near a given location.
     * Uses Haversine formula to calculate distances.
     *
     * @param latitude Center latitude
     * @param longitude Center longitude
     * @param radiusMiles Search radius in miles
     * @param sourceTypes Optional filter by source types
     * @param page Page number
     * @param size Page size
     * @return Page of local sources with distance
     */
    public Page<LocalSourceDTO> findNearby(
            double latitude,
            double longitude,
            double radiusMiles,
            List<String> sourceTypes,
            int page,
            int size
    ) {
        // First, get all active sources (optionally filtered by type)
        Specification<LocalSource> spec = LocalSourceSpecification.withFilters(null, sourceTypes, null, true);
        List<LocalSource> allSources = localSourceRepository.findAll(spec);

        // Calculate distance for each and filter by radius
        List<LocalSourceDTO> nearbyWithDistance = allSources.stream()
                .map(source -> {
                    double distance = haversineDistance(
                            latitude, longitude,
                            source.getLatitude(), source.getLongitude()
                    );
                    return LocalSourceDTO.from(source, distance);
                })
                .filter(dto -> dto.distance() <= radiusMiles)
                .sorted(Comparator.comparing(LocalSourceDTO::distance))
                .toList();

        // Manual pagination
        int start = page * size;
        int end = Math.min(start + size, nearbyWithDistance.size());

        if (start >= nearbyWithDistance.size()) {
            return new PageImpl<>(List.of(), PageRequest.of(page, size), nearbyWithDistance.size());
        }

        List<LocalSourceDTO> pageContent = nearbyWithDistance.subList(start, end);
        return new PageImpl<>(pageContent, PageRequest.of(page, size), nearbyWithDistance.size());
    }

    /**
     * Get all local sources (no pagination) for map display.
     */
    public List<LocalSourceDTO> findAllForMap(List<String> sourceTypes, boolean activeOnly) {
        Specification<LocalSource> spec = LocalSourceSpecification.withFilters(null, sourceTypes, null, activeOnly);
        return localSourceRepository.findAll(spec).stream()
                .map(LocalSourceDTO::from)
                .toList();
    }

    /**
     * Get a local source by ID.
     */
    public Optional<LocalSourceDTO> findById(UUID id) {
        return localSourceRepository.findById(id).map(LocalSourceDTO::from);
    }

    /**
     * Get a local source by slug.
     */
    public Optional<LocalSourceDTO> findBySlug(String slug) {
        return localSourceRepository.findBySlug(slug).map(LocalSourceDTO::from);
    }

    /**
     * Get total count of local sources.
     */
    public long count() {
        return localSourceRepository.count();
    }

    /**
     * Calculate the distance between two points using Haversine formula.
     *
     * @param lat1 First point latitude
     * @param lon1 First point longitude
     * @param lat2 Second point latitude
     * @param lon2 Second point longitude
     * @return Distance in miles
     */
    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_MILES * c;
    }
}
