package com.honeyexplorer.controller;

import com.honeyexplorer.dto.EnumOption;
import com.honeyexplorer.dto.FilterOptionsDTO;
import com.honeyexplorer.entity.enums.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

/**
 * REST controller for filter options API.
 * Provides available filter values for faceted search UI.
 */
@RestController
@RequestMapping("/api/filters")
public class FilterController {

    /**
     * Returns all available filter options with display names.
     * Counts are currently 0 and will be populated after Phase 3 data seeding.
     */
    @GetMapping("/options")
    public FilterOptionsDTO getFilterOptions() {
        return new FilterOptionsDTO(
            mapEnumToOptions(FloralSource.values()),
            mapEnumToOptions(HoneyOrigin.values()),
            mapEnumToOptions(HoneyType.values()),
            mapEnumToOptions(FlavorProfile.values()),
            mapEnumToOptions(SourceType.values()),
            mapEnumToOptions(Certification.values())
        );
    }

    /**
     * Helper method to convert enum values to EnumOption list.
     */
    private <E extends Enum<E>> List<EnumOption> mapEnumToOptions(E[] values) {
        return Arrays.stream(values)
            .map(e -> new EnumOption(
                e.name(),
                getDisplayName(e),
                0L
            ))
            .toList();
    }

    /**
     * Extracts displayName from enum using reflection.
     * All honey-related enums have getDisplayName() method.
     */
    private <E extends Enum<E>> String getDisplayName(E enumValue) {
        try {
            var method = enumValue.getClass().getMethod("getDisplayName");
            return (String) method.invoke(enumValue);
        } catch (Exception e) {
            // Fallback to formatted enum name if getDisplayName not available
            return enumValue.name().replace("_", " ");
        }
    }
}
