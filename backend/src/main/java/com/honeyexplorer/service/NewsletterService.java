package com.honeyexplorer.service;

import com.honeyexplorer.entity.NewsletterSubscription;
import com.honeyexplorer.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for newsletter operations.
 */
@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;

    /**
     * Subscribe an email to the newsletter.
     *
     * @param email The email to subscribe
     * @return true if newly subscribed, false if already subscribed
     */
    @Transactional
    public boolean subscribe(String email) {
        String normalizedEmail = email.toLowerCase().trim();

        if (newsletterRepository.existsByEmail(normalizedEmail)) {
            return false; // Already subscribed
        }

        NewsletterSubscription subscription = new NewsletterSubscription(normalizedEmail);
        newsletterRepository.save(subscription);
        return true;
    }

    /**
     * Get total subscriber count.
     */
    public long count() {
        return newsletterRepository.count();
    }
}
