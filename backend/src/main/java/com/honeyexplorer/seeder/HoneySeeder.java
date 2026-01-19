package com.honeyexplorer.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.honeyexplorer.entity.Honey;
import com.honeyexplorer.entity.enums.FloralSource;
import com.honeyexplorer.entity.enums.HoneyOrigin;
import com.honeyexplorer.entity.enums.HoneyType;
import com.honeyexplorer.repository.HoneyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds the honey table from JSON seed data file.
 */
@Component
public class HoneySeeder {

    private static final Logger log = LoggerFactory.getLogger(HoneySeeder.class);
    private static final String SEED_FILE = "/seed-data/honeys.json";

    private final HoneyRepository honeyRepository;
    private final ObjectMapper objectMapper;

    public HoneySeeder(HoneyRepository honeyRepository, ObjectMapper objectMapper) {
        this.honeyRepository = honeyRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Seeds honeys from JSON file if the table is empty.
     *
     * @return number of honeys seeded (0 if skipped due to existing data)
     */
    public int seedHoneys() {
        if (honeyRepository.count() > 0) {
            log.info("Honey table already has data, skipping seeding");
            return 0;
        }

        try (InputStream inputStream = getClass().getResourceAsStream(SEED_FILE)) {
            if (inputStream == null) {
                log.error("Seed file not found: {}", SEED_FILE);
                return 0;
            }

            List<HoneySeedDto> seedData = objectMapper.readValue(
                inputStream,
                new TypeReference<List<HoneySeedDto>>() {}
            );

            LocalDateTime now = LocalDateTime.now();
            int count = 0;

            for (HoneySeedDto dto : seedData) {
                Honey honey = mapToEntity(dto, now);
                honeyRepository.save(honey);
                count++;
            }

            log.info("Seeded {} honeys", count);
            return count;

        } catch (IOException e) {
            log.error("Failed to read honey seed data", e);
            return 0;
        }
    }

    private Honey mapToEntity(HoneySeedDto dto, LocalDateTime verifiedAt) {
        Honey honey = new Honey();
        honey.setName(dto.name());
        honey.setDescription(dto.description());
        honey.setFloralSource(FloralSource.valueOf(dto.floralSource()));
        honey.setType(HoneyType.valueOf(dto.type()));
        honey.setOrigin(HoneyOrigin.valueOf(dto.origin()));
        honey.setRegion(dto.region());
        honey.setFlavorProfiles(dto.flavorProfiles());
        honey.setImageUrl(dto.imageUrl());
        honey.setThumbnailUrl(dto.thumbnailUrl());
        honey.setBrand(dto.brand());
        honey.setPriceMin(dto.priceMin());
        honey.setPriceMax(dto.priceMax());
        honey.setCertifications(dto.certifications());
        honey.setUmfRating(dto.umfRating());
        honey.setMgoRating(dto.mgoRating());
        honey.setSlug(dto.slug());
        honey.setFeatured(dto.isFeatured());
        honey.setPurchaseUrl(dto.purchaseUrl());

        // Verification metadata
        honey.setLastVerifiedAt(verifiedAt);
        honey.setVerificationSource("initial_seed");
        honey.setIsVerified(true);

        return honey;
    }
}
