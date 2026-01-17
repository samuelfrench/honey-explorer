package com.honeyexplorer.entity.enums;

/**
 * Simplified flavor profile categories for multi-select filtering.
 * Based on UC Davis Honey Flavor Wheel, simplified for MVP.
 */
public enum FlavorProfile {
    SWEET("Sweet"),
    FLORAL("Floral"),
    FRUITY("Fruity"),
    EARTHY("Earthy"),
    BOLD("Bold"),
    SPICY("Spicy"),
    MILD("Mild"),
    COMPLEX("Complex");

    private final String displayName;

    FlavorProfile(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
