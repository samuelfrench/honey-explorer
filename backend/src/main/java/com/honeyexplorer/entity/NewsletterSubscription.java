package com.honeyexplorer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Entity representing a newsletter subscription.
 */
@Entity
@Table(name = "newsletter_subscriptions")
@Getter
@Setter
@NoArgsConstructor
public class NewsletterSubscription extends BaseAuditEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private boolean confirmed = false;

    @Column
    private LocalDateTime subscribedAt;

    public NewsletterSubscription(String email) {
        this.email = email;
        this.subscribedAt = LocalDateTime.now();
    }
}
