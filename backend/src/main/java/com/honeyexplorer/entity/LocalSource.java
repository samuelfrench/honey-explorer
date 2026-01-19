package com.honeyexplorer.entity;

import com.honeyexplorer.entity.enums.SourceType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a local honey source (beekeeper, farm, market, etc.).
 * Designed for location-based discovery with verification metadata.
 */
@Entity
@Table(name = "local_sources")
@Getter
@Setter
@NoArgsConstructor
public class LocalSource extends BaseAuditEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private SourceType sourceType;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(length = 10)
    private String zipCode;

    /**
     * Latitude coordinate for map display and proximity search.
     */
    @Column(nullable = false)
    private Double latitude;

    /**
     * Longitude coordinate for map display and proximity search.
     */
    @Column(nullable = false)
    private Double longitude;

    @Column(length = 20)
    private String phone;

    private String email;

    private String website;

    /**
     * Business hours stored as JSON (e.g., {"mon":"9-5","tue":"9-5",...}).
     */
    @Column(columnDefinition = "TEXT")
    private String hoursJson;

    /**
     * Full-size hero image URL for detail pages.
     */
    @Column(length = 500)
    private String heroImageUrl;

    /**
     * Thumbnail image URL for grid/list views.
     */
    @Column(length = 500)
    private String thumbnailUrl;

    @Column(length = 100)
    private String instagramHandle;

    private String facebookUrl;

    /**
     * Whether this source is currently active/open for business.
     */
    @Column
    private Boolean isActive = true;

    /**
     * URL-friendly slug for SEO-friendly URLs.
     */
    @Column(unique = true)
    private String slug;
}
