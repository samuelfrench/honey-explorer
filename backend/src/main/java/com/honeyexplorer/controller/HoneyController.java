package com.honeyexplorer.controller;

import com.honeyexplorer.dto.HoneyDTO;
import com.honeyexplorer.service.HoneyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST controller for honey endpoints.
 */
@RestController
@RequestMapping("/api/honeys")
@RequiredArgsConstructor
public class HoneyController {

    private final HoneyService honeyService;

    /**
     * Get all honeys with pagination, search, and filtering.
     */
    @GetMapping
    public Page<HoneyDTO> browse(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) List<String> origin,
        @RequestParam(required = false) List<String> floralSource,
        @RequestParam(required = false) List<String> type,
        @RequestParam(required = false) BigDecimal priceMin,
        @RequestParam(required = false) BigDecimal priceMax,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "24") int size,
        @RequestParam(defaultValue = "name") String sort
    ) {
        return honeyService.browse(search, origin, floralSource, type, priceMin, priceMax, page, size, sort);
    }

    /**
     * Get featured honeys for homepage.
     */
    @GetMapping("/featured")
    public List<HoneyDTO> getFeatured() {
        return honeyService.findFeatured();
    }

    /**
     * Get honey by slug.
     */
    @GetMapping("/{slug}")
    public ResponseEntity<HoneyDTO> getBySlug(@PathVariable String slug) {
        return honeyService.findBySlug(slug)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get total count of honeys.
     */
    @GetMapping("/count")
    public long getCount() {
        return honeyService.count();
    }

    /**
     * Get similar honeys based on floral source and flavor profiles.
     */
    @GetMapping("/{slug}/similar")
    public List<HoneyDTO> getSimilar(
        @PathVariable String slug,
        @RequestParam(defaultValue = "4") int limit
    ) {
        return honeyService.findSimilar(slug, limit);
    }
}
