package com.honeyexplorer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for newsletter subscription.
 */
public record SubscribeRequest(
    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    String email
) {}
