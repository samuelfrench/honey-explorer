package com.honeyexplorer.entity;

import com.honeyexplorer.entity.enums.FloralSource;
import com.honeyexplorer.entity.enums.HoneyOrigin;
import com.honeyexplorer.entity.enums.HoneyType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Entity representing a honey variety.
 * Designed to support faceted filtering (Phase 5) and visual-first display.
 */
@Entity
@Table(name = "honeys")
@Getter
@Setter
@NoArgsConstructor
public class Honey extends BaseAuditEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private FloralSource floralSource;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private HoneyType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private HoneyOrigin origin;

    /**
     * More specific region than origin (e.g., "California" when origin is USA).
     */
    @Column(length = 100)
    private String region;

    /**
     * Comma-separated FlavorProfile enum values (e.g., "SWEET,FLORAL,MILD").
     * Multi-select field for filtering.
     */
    @Column(length = 200)
    private String flavorProfiles;

    /**
     * Full-size hero image URL for detail pages.
     */
    @Column(length = 500)
    private String imageUrl;

    /**
     * Thumbnail image URL for grid/list views.
     */
    @Column(length = 500)
    private String thumbnailUrl;

    @Column(length = 100)
    private String brand;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceMin;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceMax;

    /**
     * Comma-separated Certification enum values.
     */
    @Column(length = 200)
    private String certifications;

    /**
     * UMF rating for Manuka honey (5, 10, 15, 20, etc.).
     */
    private Integer umfRating;

    /**
     * MGO (Methylglyoxal) rating for Manuka honey.
     */
    private Integer mgoRating;

    /**
     * SEO-friendly URL slug (e.g., "manuka-honey-umf-15-new-zealand").
     */
    @Column(length = 200)
    private String slug;
}
