package com.honeyexplorer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing city-specific content for local SEO landing pages.
 * Contains generated and validated content about honey in specific cities.
 */
@Entity
@Table(name = "city_content")
@Getter
@Setter
@NoArgsConstructor
public class CityContent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

    /**
     * Introduction text about honey in this city.
     * e.g., "Austin, Texas is known for its vibrant beekeeping community..."
     */
    @Column(columnDefinition = "TEXT")
    private String introText;

    /**
     * Regional honey facts and information.
     * e.g., "The Texas Hill Country produces distinctive mesquite and wildflower honeys..."
     */
    @Column(columnDefinition = "TEXT")
    private String honeyFacts;

    /**
     * Tips for buying local honey in this area.
     */
    @Column(columnDefinition = "TEXT")
    private String buyingTips;

    /**
     * Best seasons to buy local honey.
     */
    @Column(columnDefinition = "TEXT")
    private String bestSeasons;

    /**
     * FAQ content stored as JSON array.
     * e.g., [{"question": "Where can I buy raw honey in Austin?", "answer": "..."}]
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String faqJson;

    /**
     * Whether this content has been validated for quality.
     */
    @Column
    private Boolean validated = false;

    /**
     * Validation quality score (1-10).
     */
    @Column
    private Integer validationScore;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
