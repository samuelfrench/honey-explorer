package com.honeyexplorer.entity.enums;

/**
 * Controlled vocabulary for honey country/region origins.
 */
public enum HoneyOrigin {
    USA("USA"),
    NEW_ZEALAND("New Zealand"),
    AUSTRALIA("Australia"),
    ARGENTINA("Argentina"),
    MEXICO("Mexico"),
    CANADA("Canada"),
    BRAZIL("Brazil"),
    GREECE("Greece"),
    TURKEY("Turkey"),
    SPAIN("Spain"),
    FRANCE("France"),
    ITALY("Italy"),
    HUNGARY("Hungary"),
    GERMANY("Germany"),
    UK("United Kingdom"),
    OTHER("Other");

    private final String displayName;

    HoneyOrigin(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
