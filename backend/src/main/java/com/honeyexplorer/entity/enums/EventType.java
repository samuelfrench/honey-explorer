package com.honeyexplorer.entity.enums;

/**
 * Types of honey-related events.
 */
public enum EventType {
    FESTIVAL("Festival"),
    MARKET("Market"),
    CLASS("Class"),
    TASTING("Tasting"),
    TOUR("Tour"),
    FAIR("Fair"),
    EXPO("Expo"),
    CONFERENCE("Conference");

    private final String displayName;

    EventType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
