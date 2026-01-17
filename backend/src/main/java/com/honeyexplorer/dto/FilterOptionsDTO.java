package com.honeyexplorer.dto;

import java.util.List;

/**
 * Response DTO containing all available filter options for faceted search.
 * Each field represents a filterable attribute with its possible values.
 */
public record FilterOptionsDTO(
    List<EnumOption> floralSources,
    List<EnumOption> origins,
    List<EnumOption> types,
    List<EnumOption> flavorProfiles,
    List<EnumOption> sourceTypes,
    List<EnumOption> certifications
) {}
