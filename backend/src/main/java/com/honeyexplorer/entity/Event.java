package com.honeyexplorer.entity;

import com.honeyexplorer.entity.enums.EventType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Entity representing a honey-related event (festival, market, class, etc.).
 */
@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
public class Event extends BaseAuditEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private EventType eventType;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(nullable = false)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 50)
    private String state;

    private Double latitude;

    private Double longitude;

    /**
     * Full-size image URL for event display.
     */
    @Column(length = 500)
    private String imageUrl;

    /**
     * Thumbnail image URL for cards.
     */
    @Column(length = 500)
    private String thumbnailUrl;

    /**
     * External link to event website or registration.
     */
    private String link;

    /**
     * Optional reference to the local source hosting this event.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "local_source_id")
    private LocalSource localSource;

    /**
     * URL-friendly slug for SEO-friendly URLs.
     */
    @Column(unique = true)
    private String slug;

    /**
     * Whether this event is currently active/visible.
     */
    @Column
    private Boolean isActive = true;
}
