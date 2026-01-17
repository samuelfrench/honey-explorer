package com.honeyexplorer.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Configuration to enable JPA auditing for @CreatedDate and @LastModifiedDate.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
    // Empty class body - auditing enabled via annotation
    // AuditorAware bean can be added later for createdBy/modifiedBy fields
}
