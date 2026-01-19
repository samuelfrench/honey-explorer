package com.honeyexplorer.controller;

import com.honeyexplorer.dto.LocalSourceDTO;
import com.honeyexplorer.service.LocalSourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for local source endpoints.
 */
@RestController
@RequestMapping("/api/local-sources")
@RequiredArgsConstructor
public class LocalSourceController {

    private final LocalSourceService localSourceService;

    /**
     * Get all local sources with pagination, search, and filtering.
     */
    @GetMapping
    public Page<LocalSourceDTO> browse(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> sourceType,
            @RequestParam(required = false) List<String> state,
            @RequestParam(defaultValue = "true") boolean activeOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(defaultValue = "name") String sort
    ) {
        return localSourceService.browse(search, sourceType, state, activeOnly, page, size, sort);
    }

    /**
     * Get all local sources for map display (no pagination).
     */
    @GetMapping("/map")
    public List<LocalSourceDTO> getAllForMap(
            @RequestParam(required = false) List<String> sourceType,
            @RequestParam(defaultValue = "true") boolean activeOnly
    ) {
        return localSourceService.findAllForMap(sourceType, activeOnly);
    }

    /**
     * Find local sources near a given location.
     */
    @GetMapping("/nearby")
    public Page<LocalSourceDTO> findNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50") double radius,
            @RequestParam(required = false) List<String> sourceType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size
    ) {
        return localSourceService.findNearby(lat, lng, radius, sourceType, page, size);
    }

    /**
     * Get a local source by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LocalSourceDTO> getById(@PathVariable UUID id) {
        return localSourceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get a local source by slug.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<LocalSourceDTO> getBySlug(@PathVariable String slug) {
        return localSourceService.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get total count of local sources.
     */
    @GetMapping("/count")
    public long getCount() {
        return localSourceService.count();
    }
}
