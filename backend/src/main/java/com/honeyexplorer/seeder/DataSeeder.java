package com.honeyexplorer.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * CommandLineRunner that seeds the database with initial data when enabled.
 * Controlled by seed.data.enabled property (default: false).
 */
@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Value("${seed.data.enabled:false}")
    private boolean seedDataEnabled;

    private final HoneySeeder honeySeeder;
    private final LocalSourceSeeder localSourceSeeder;
    private final EventSeeder eventSeeder;

    public DataSeeder(HoneySeeder honeySeeder, LocalSourceSeeder localSourceSeeder, EventSeeder eventSeeder) {
        this.honeySeeder = honeySeeder;
        this.localSourceSeeder = localSourceSeeder;
        this.eventSeeder = eventSeeder;
    }

    @Override
    public void run(String... args) {
        if (!seedDataEnabled) {
            log.info("Data seeding disabled (seed.data.enabled=false)");
            return;
        }

        log.info("Starting database seeding...");

        int honeysSeeded = honeySeeder.seedHoneys();
        int sourcesSeeded = localSourceSeeder.seedLocalSources();
        int eventsSeeded = eventSeeder.seedEvents();

        log.info("Database seeding complete: {} honeys, {} local sources, {} events", honeysSeeded, sourcesSeeded, eventsSeeded);
    }
}
