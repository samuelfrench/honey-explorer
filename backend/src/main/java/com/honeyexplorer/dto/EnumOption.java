package com.honeyexplorer.dto;

/**
 * Represents a filter option derived from an enum value.
 * Used in faceted filtering UI to display available filter choices.
 */
public record EnumOption(
    String value,       // Enum name (e.g., "ORANGE_BLOSSOM")
    String displayName, // Human readable (e.g., "Orange Blossom")
    Long count          // Number of matching items (0 for now)
) {}
