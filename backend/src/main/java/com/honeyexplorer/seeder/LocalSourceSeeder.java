package com.honeyexplorer.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.honeyexplorer.entity.LocalSource;
import com.honeyexplorer.entity.enums.SourceType;
import com.honeyexplorer.repository.LocalSourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds the local_sources table from JSON seed data file.
 */
@Component
public class LocalSourceSeeder {

    private static final Logger log = LoggerFactory.getLogger(LocalSourceSeeder.class);
    private static final String SEED_FILE = "/seed-data/local-sources.json";

    private final LocalSourceRepository localSourceRepository;
    private final ObjectMapper objectMapper;

    public LocalSourceSeeder(LocalSourceRepository localSourceRepository, ObjectMapper objectMapper) {
        this.localSourceRepository = localSourceRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Seeds local sources from JSON file if the table is empty.
     *
     * @return number of local sources seeded (0 if skipped due to existing data)
     */
    public int seedLocalSources() {
        if (localSourceRepository.count() > 0) {
            log.info("LocalSource table already has data, skipping seeding");
            return 0;
        }

        try (InputStream inputStream = getClass().getResourceAsStream(SEED_FILE)) {
            if (inputStream == null) {
                log.error("Seed file not found: {}", SEED_FILE);
                return 0;
            }

            List<LocalSourceSeedDto> seedData = objectMapper.readValue(
                inputStream,
                new TypeReference<List<LocalSourceSeedDto>>() {}
            );

            LocalDateTime now = LocalDateTime.now();
            int count = 0;

            for (LocalSourceSeedDto dto : seedData) {
                LocalSource source = mapToEntity(dto, now);
                localSourceRepository.save(source);
                count++;
            }

            log.info("Seeded {} local sources", count);
            return count;

        } catch (IOException e) {
            log.error("Failed to read local source seed data", e);
            return 0;
        }
    }

    private LocalSource mapToEntity(LocalSourceSeedDto dto, LocalDateTime verifiedAt) {
        LocalSource source = new LocalSource();
        source.setName(dto.name());
        source.setSourceType(SourceType.valueOf(dto.sourceType()));
        source.setDescription(dto.description());
        source.setAddress(dto.address());
        source.setCity(dto.city());
        source.setState(dto.state());
        source.setZipCode(dto.zipCode());
        source.setLatitude(dto.latitude());
        source.setLongitude(dto.longitude());
        source.setPhone(dto.phone());
        source.setEmail(dto.email());
        source.setWebsite(dto.website());
        source.setHoursJson(dto.hoursJson());
        source.setHeroImageUrl(dto.heroImageUrl());
        source.setThumbnailUrl(dto.thumbnailUrl());
        source.setInstagramHandle(dto.instagramHandle());
        source.setFacebookUrl(dto.facebookUrl());

        // Verification metadata
        source.setLastVerifiedAt(verifiedAt);
        source.setVerificationSource("initial_seed");
        source.setIsVerified(true);
        source.setIsActive(true);

        return source;
    }
}
