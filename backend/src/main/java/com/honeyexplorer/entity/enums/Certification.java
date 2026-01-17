package com.honeyexplorer.entity.enums;

/**
 * Controlled vocabulary for honey quality certifications.
 */
public enum Certification {
    UMF_5_PLUS("UMF 5+"),
    UMF_10_PLUS("UMF 10+"),
    UMF_15_PLUS("UMF 15+"),
    UMF_20_PLUS("UMF 20+"),
    USDA_GRADE_A("USDA Grade A"),
    USDA_ORGANIC("USDA Organic"),
    TRUE_SOURCE("True Source"),
    NON_GMO("Non-GMO");

    private final String displayName;

    Certification(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
