package com.honeyexplorer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Abstract base entity providing audit and verification fields for all entities.
 * Uses JPA auditing for automatic timestamp management.
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public abstract class BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Timestamp of last data verification.
     * Used for tracking data freshness and decay.
     */
    @Column
    private LocalDateTime lastVerifiedAt;

    /**
     * Source of last verification (e.g., "scraper", "manual", "api").
     */
    @Column
    private String verificationSource;

    /**
     * Whether this entity's data has been verified as accurate.
     */
    @Column
    private Boolean isVerified = false;
}
