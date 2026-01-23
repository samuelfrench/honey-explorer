package com.honeyexplorer.controller;

import com.honeyexplorer.dto.CityContentDTO;
import com.honeyexplorer.dto.LocalSourceDTO;
import com.honeyexplorer.dto.EventDTO;
import com.honeyexplorer.entity.CityContent;
import com.honeyexplorer.repository.CityContentRepository;
import com.honeyexplorer.service.LocalSourceService;
import com.honeyexplorer.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for city landing page content.
 * Provides endpoints for city-specific SEO pages.
 */
@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityContentRepository cityContentRepository;
    private final LocalSourceService localSourceService;
    private final EventService eventService;

    private static final double DEFAULT_RADIUS_MILES = 50.0;

    /**
     * Get all available city landing pages.
     */
    @GetMapping
    public List<CityContentDTO> getAllCities() {
        return cityContentRepository.findAllValidatedOrderByCity()
            .stream()
            .map(CityContentDTO::summary)
            .collect(Collectors.toList());
    }

    /**
     * Get city content by slug.
     * Returns full content with nearby sources and events count.
     */
    @GetMapping("/{slug}")
    public ResponseEntity<CityContentDTO> getBySlug(@PathVariable String slug) {
        Optional<CityContent> cityOpt = cityContentRepository.findBySlug(slug);

        if (cityOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CityContent city = cityOpt.get();

        // Get counts for nearby sources and events
        int nearbySourcesCount = 0;
        int upcomingEventsCount = 0;

        if (city.getLatitude() != null && city.getLongitude() != null) {
            Page<LocalSourceDTO> nearbySources = localSourceService.findNearby(
                city.getLatitude().doubleValue(),
                city.getLongitude().doubleValue(),
                DEFAULT_RADIUS_MILES,
                null, 0, 1
            );
            nearbySourcesCount = (int) nearbySources.getTotalElements();

            // Get upcoming events in the state
            List<EventDTO> events = eventService.findByState(city.getState());
            upcomingEventsCount = events.size();
        }

        return ResponseEntity.ok(CityContentDTO.from(city, nearbySourcesCount, upcomingEventsCount));
    }

    /**
     * Get nearby local sources for a city.
     */
    @GetMapping("/{slug}/sources")
    public ResponseEntity<Page<LocalSourceDTO>> getNearbySources(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "50") double radius
    ) {
        Optional<CityContent> cityOpt = cityContentRepository.findBySlug(slug);

        if (cityOpt.isEmpty() || cityOpt.get().getLatitude() == null) {
            return ResponseEntity.notFound().build();
        }

        CityContent city = cityOpt.get();
        Page<LocalSourceDTO> sources = localSourceService.findNearby(
            city.getLatitude().doubleValue(),
            city.getLongitude().doubleValue(),
            radius,
            null,
            page,
            size
        );

        return ResponseEntity.ok(sources);
    }

    /**
     * Get upcoming events in a city's state.
     */
    @GetMapping("/{slug}/events")
    public ResponseEntity<List<EventDTO>> getCityEvents(@PathVariable String slug) {
        Optional<CityContent> cityOpt = cityContentRepository.findBySlug(slug);

        if (cityOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CityContent city = cityOpt.get();
        List<EventDTO> events = eventService.findByState(city.getState());

        return ResponseEntity.ok(events);
    }

    /**
     * Get count of validated cities.
     */
    @GetMapping("/count")
    public long getCount() {
        return cityContentRepository.countByValidatedTrue();
    }
}
