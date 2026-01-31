package com.honeyexplorer.controller;

import com.honeyexplorer.dto.SubscribeRequest;
import com.honeyexplorer.service.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for newsletter endpoints.
 */
@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    /**
     * Subscribe to the newsletter.
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody @Valid SubscribeRequest request) {
        boolean isNew = newsletterService.subscribe(request.email());

        if (isNew) {
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Successfully subscribed! You'll receive honey tips and updates."
            ));
        }

        return ResponseEntity.ok(Map.of(
            "status", "exists",
            "message", "You're already subscribed! Check your inbox for our latest updates."
        ));
    }
}
