package com.honeyexplorer.entity.enums;

/**
 * Controlled vocabulary for honey processing types.
 */
public enum HoneyType {
    RAW("Raw"),
    FILTERED("Filtered"),
    PASTEURIZED("Pasteurized"),
    CREAMED("Creamed"),
    COMB("Comb"),
    INFUSED("Infused"),
    ORGANIC("Organic");

    private final String displayName;

    HoneyType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
