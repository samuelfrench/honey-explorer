package com.honeyexplorer.repository;

import com.honeyexplorer.entity.NewsletterSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for newsletter subscriptions.
 */
@Repository
public interface NewsletterRepository extends JpaRepository<NewsletterSubscription, UUID> {

    /**
     * Check if an email is already subscribed.
     */
    boolean existsByEmail(String email);

    /**
     * Find subscription by email.
     */
    Optional<NewsletterSubscription> findByEmail(String email);
}
