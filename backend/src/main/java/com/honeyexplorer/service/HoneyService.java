package com.honeyexplorer.service;

import com.honeyexplorer.dto.HoneyDTO;
import com.honeyexplorer.entity.Honey;
import com.honeyexplorer.repository.HoneyRepository;
import com.honeyexplorer.repository.HoneySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for honey-related operations.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HoneyService {

    private final HoneyRepository honeyRepository;

    /**
     * Get all honeys with pagination.
     */
    public Page<HoneyDTO> findAll(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return honeyRepository.findAll(pageable).map(HoneyDTO::from);
    }

    /**
     * Browse honeys with search and filters.
     */
    public Page<HoneyDTO> browse(
            String search,
            List<String> origins,
            List<String> floralSources,
            List<String> types,
            int page,
            int size,
            String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Specification<Honey> spec = HoneySpecification.withFilters(search, origins, floralSources, types);
        return honeyRepository.findAll(spec, pageable).map(HoneyDTO::from);
    }

    /**
     * Get featured honeys for the homepage.
     */
    public List<HoneyDTO> findFeatured() {
        return honeyRepository.findByFeaturedTrue()
            .stream()
            .map(HoneyDTO::from)
            .toList();
    }

    /**
     * Get a honey by its slug.
     */
    public Optional<HoneyDTO> findBySlug(String slug) {
        return honeyRepository.findBySlug(slug).map(HoneyDTO::from);
    }

    /**
     * Get total count of honeys.
     */
    public long count() {
        return honeyRepository.count();
    }
}
