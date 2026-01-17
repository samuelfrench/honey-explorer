package com.honeyexplorer.entity.enums;

/**
 * Controlled vocabulary for honey floral sources.
 * Based on UC Davis Honey Flavor Wheel and industry standards.
 */
public enum FloralSource {
    CLOVER("Clover"),
    WILDFLOWER("Wildflower"),
    MANUKA("Manuka"),
    ORANGE_BLOSSOM("Orange Blossom"),
    BUCKWHEAT("Buckwheat"),
    ACACIA("Acacia"),
    LAVENDER("Lavender"),
    TUPELO("Tupelo"),
    SAGE("Sage"),
    SOURWOOD("Sourwood"),
    EUCALYPTUS("Eucalyptus"),
    BLUEBERRY("Blueberry"),
    AVOCADO("Avocado"),
    LINDEN("Linden"),
    CHESTNUT("Chestnut"),
    HEATHER("Heather"),
    OTHER("Other");

    private final String displayName;

    FloralSource(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
