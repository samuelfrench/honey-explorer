package com.honeyexplorer.entity.enums;

/**
 * Controlled vocabulary for local honey source types.
 */
public enum SourceType {
    BEEKEEPER("Beekeeper"),
    FARM("Farm"),
    FARMERS_MARKET("Farmers Market"),
    STORE("Store"),
    APIARY("Apiary"),
    COOPERATIVE("Cooperative");

    private final String displayName;

    SourceType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
