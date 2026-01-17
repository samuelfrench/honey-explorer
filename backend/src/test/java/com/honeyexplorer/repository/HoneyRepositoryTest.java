package com.honeyexplorer.repository;

import com.honeyexplorer.config.JpaAuditingConfig;
import com.honeyexplorer.entity.Honey;
import com.honeyexplorer.entity.enums.FloralSource;
import com.honeyexplorer.entity.enums.HoneyOrigin;
import com.honeyexplorer.entity.enums.HoneyType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for HoneyRepository.
 * Uses H2 in-memory database via @DataJpaTest.
 * Imports JpaAuditingConfig to enable @CreatedDate/@LastModifiedDate.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(JpaAuditingConfig.class)
class HoneyRepositoryTest {

    @Autowired
    private HoneyRepository honeyRepository;

    @Test
    void saveAndFindHoney() {
        // Create a honey entity with required fields
        Honey honey = new Honey();
        honey.setName("Test Clover Honey");
        honey.setFloralSource(FloralSource.CLOVER);
        honey.setType(HoneyType.RAW);
        honey.setOrigin(HoneyOrigin.USA);
        honey.setDescription("A delicious raw clover honey");
        honey.setSlug("test-clover-honey");

        // Save via repository
        Honey saved = honeyRepository.save(honey);

        // Assert ID was generated
        assertThat(saved.getId()).isNotNull();

        // Find by ID
        Optional<Honey> found = honeyRepository.findById(saved.getId());
        assertThat(found).isPresent();

        // Assert all fields match
        Honey retrieved = found.get();
        assertThat(retrieved.getName()).isEqualTo("Test Clover Honey");
        assertThat(retrieved.getFloralSource()).isEqualTo(FloralSource.CLOVER);
        assertThat(retrieved.getType()).isEqualTo(HoneyType.RAW);
        assertThat(retrieved.getOrigin()).isEqualTo(HoneyOrigin.USA);
        assertThat(retrieved.getDescription()).isEqualTo("A delicious raw clover honey");
        assertThat(retrieved.getSlug()).isEqualTo("test-clover-honey");

        // Assert audit timestamps are set (JPA auditing works)
        assertThat(retrieved.getCreatedAt()).isNotNull();
        assertThat(retrieved.getUpdatedAt()).isNotNull();
    }

    @Test
    void findByFloralSource() {
        // Create honey with MANUKA floral source
        Honey manukaHoney = new Honey();
        manukaHoney.setName("Manuka Honey UMF 10+");
        manukaHoney.setFloralSource(FloralSource.MANUKA);
        manukaHoney.setType(HoneyType.RAW);
        manukaHoney.setOrigin(HoneyOrigin.NEW_ZEALAND);
        honeyRepository.save(manukaHoney);

        // Create honey with WILDFLOWER floral source
        Honey wildflowerHoney = new Honey();
        wildflowerHoney.setName("California Wildflower");
        wildflowerHoney.setFloralSource(FloralSource.WILDFLOWER);
        wildflowerHoney.setType(HoneyType.RAW);
        wildflowerHoney.setOrigin(HoneyOrigin.USA);
        honeyRepository.save(wildflowerHoney);

        // Query by MANUKA floral source
        List<Honey> manukaResults = honeyRepository.findByFloralSource(FloralSource.MANUKA);

        // Assert correct honey returned
        assertThat(manukaResults).hasSize(1);
        assertThat(manukaResults.get(0).getName()).isEqualTo("Manuka Honey UMF 10+");
        assertThat(manukaResults.get(0).getFloralSource()).isEqualTo(FloralSource.MANUKA);

        // Query by WILDFLOWER floral source
        List<Honey> wildflowerResults = honeyRepository.findByFloralSource(FloralSource.WILDFLOWER);
        assertThat(wildflowerResults).hasSize(1);
        assertThat(wildflowerResults.get(0).getName()).isEqualTo("California Wildflower");
    }

    @Test
    void findBySlug() {
        // Create honey with slug
        Honey honey = new Honey();
        honey.setName("Orange Blossom Honey");
        honey.setFloralSource(FloralSource.ORANGE_BLOSSOM);
        honey.setType(HoneyType.RAW);
        honey.setOrigin(HoneyOrigin.USA);
        honey.setSlug("orange-blossom-honey-florida");
        honeyRepository.save(honey);

        // Find by slug
        Optional<Honey> found = honeyRepository.findBySlug("orange-blossom-honey-florida");
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Orange Blossom Honey");

        // Non-existent slug returns empty
        Optional<Honey> notFound = honeyRepository.findBySlug("non-existent-slug");
        assertThat(notFound).isEmpty();
    }
}
