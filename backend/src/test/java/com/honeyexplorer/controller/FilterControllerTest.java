package com.honeyexplorer.controller;

import com.honeyexplorer.entity.enums.FloralSource;
import com.honeyexplorer.entity.enums.HoneyOrigin;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Controller tests for FilterController.
 * Uses MockMvc for lightweight HTTP testing.
 */
@WebMvcTest(FilterController.class)
class FilterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getFilterOptions_returnsAllEnumValues() throws Exception {
        mockMvc.perform(get("/api/filters/options")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                // Verify floralSources array has correct count
                .andExpect(jsonPath("$.floralSources", hasSize(FloralSource.values().length)))
                // Verify first floralSource has required fields
                .andExpect(jsonPath("$.floralSources[0].value", notNullValue()))
                .andExpect(jsonPath("$.floralSources[0].displayName", notNullValue()))
                .andExpect(jsonPath("$.floralSources[0].count", is(0)))
                // Verify origins array has correct count
                .andExpect(jsonPath("$.origins", hasSize(HoneyOrigin.values().length)))
                // Verify types array exists
                .andExpect(jsonPath("$.types", notNullValue()))
                // Verify flavorProfiles array exists
                .andExpect(jsonPath("$.flavorProfiles", notNullValue()))
                // Verify sourceTypes array exists
                .andExpect(jsonPath("$.sourceTypes", notNullValue()))
                // Verify certifications array exists
                .andExpect(jsonPath("$.certifications", notNullValue()));
    }

    @Test
    void filterOptions_containsExpectedValues() throws Exception {
        mockMvc.perform(get("/api/filters/options")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // Verify floralSources contains CLOVER and MANUKA
                .andExpect(jsonPath("$.floralSources[?(@.value == 'CLOVER')]").exists())
                .andExpect(jsonPath("$.floralSources[?(@.value == 'MANUKA')]").exists())
                .andExpect(jsonPath("$.floralSources[?(@.displayName == 'Clover')]").exists())
                .andExpect(jsonPath("$.floralSources[?(@.displayName == 'Manuka')]").exists())
                // Verify origins contains USA and NEW_ZEALAND
                .andExpect(jsonPath("$.origins[?(@.value == 'USA')]").exists())
                .andExpect(jsonPath("$.origins[?(@.value == 'NEW_ZEALAND')]").exists())
                .andExpect(jsonPath("$.origins[?(@.displayName == 'USA')]").exists())
                .andExpect(jsonPath("$.origins[?(@.displayName == 'New Zealand')]").exists())
                // Verify types contain expected values
                .andExpect(jsonPath("$.types[?(@.value == 'RAW')]").exists())
                .andExpect(jsonPath("$.types[?(@.displayName == 'Raw')]").exists())
                // Verify sourceTypes contain expected values
                .andExpect(jsonPath("$.sourceTypes[?(@.value == 'BEEKEEPER')]").exists())
                .andExpect(jsonPath("$.sourceTypes[?(@.displayName == 'Beekeeper')]").exists());
    }

    @Test
    void filterOptions_allCountsAreZero() throws Exception {
        // Counts should be 0 until Phase 3 data seeding
        mockMvc.perform(get("/api/filters/options")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // All floralSources should have count 0
                .andExpect(jsonPath("$.floralSources[*].count", everyItem(is(0))))
                // All origins should have count 0
                .andExpect(jsonPath("$.origins[*].count", everyItem(is(0))))
                // All types should have count 0
                .andExpect(jsonPath("$.types[*].count", everyItem(is(0))))
                // All flavorProfiles should have count 0
                .andExpect(jsonPath("$.flavorProfiles[*].count", everyItem(is(0))))
                // All sourceTypes should have count 0
                .andExpect(jsonPath("$.sourceTypes[*].count", everyItem(is(0))))
                // All certifications should have count 0
                .andExpect(jsonPath("$.certifications[*].count", everyItem(is(0))));
    }
}
