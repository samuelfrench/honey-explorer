package com.honeyexplorer.controller;

import com.honeyexplorer.entity.CityContent;
import com.honeyexplorer.entity.Event;
import com.honeyexplorer.entity.Honey;
import com.honeyexplorer.entity.LocalSource;
import com.honeyexplorer.repository.CityContentRepository;
import com.honeyexplorer.repository.EventRepository;
import com.honeyexplorer.repository.HoneyRepository;
import com.honeyexplorer.repository.LocalSourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Controller for generating sitemap.xml for SEO.
 * Returns a dynamic XML sitemap with all indexable pages.
 */
@RestController
@RequiredArgsConstructor
public class SitemapController {

    private static final String BASE_URL = "https://rawhoneyguide.com";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final HoneyRepository honeyRepository;
    private final LocalSourceRepository localSourceRepository;
    private final EventRepository eventRepository;
    private final CityContentRepository cityContentRepository;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String generateSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        // Static pages
        addUrl(xml, "/", LocalDateTime.now(), "1.0", "daily");
        addUrl(xml, "/browse", LocalDateTime.now(), "0.9", "daily");
        addUrl(xml, "/local", LocalDateTime.now(), "0.8", "weekly");
        addUrl(xml, "/events", LocalDateTime.now(), "0.8", "daily");

        // Honey detail pages
        List<Honey> honeys = honeyRepository.findAll();
        for (Honey honey : honeys) {
            if (honey.getSlug() != null && !honey.getSlug().isEmpty()) {
                addUrl(xml, "/honey/" + honey.getSlug(), honey.getUpdatedAt(), "0.8", "weekly");
            }
        }

        // Local source pages
        List<LocalSource> sources = localSourceRepository.findByIsActiveTrue();
        for (LocalSource source : sources) {
            if (source.getSlug() != null && !source.getSlug().isEmpty()) {
                addUrl(xml, "/local/" + source.getSlug(), source.getUpdatedAt(), "0.7", "weekly");
            }
        }

        // Event pages
        List<Event> events = eventRepository.findAll();
        for (Event event : events) {
            if (event.getSlug() != null && !event.getSlug().isEmpty()) {
                addUrl(xml, "/events/" + event.getSlug(), event.getUpdatedAt(), "0.6", "weekly");
            }
        }

        // City landing pages
        List<CityContent> cities = cityContentRepository.findByValidatedTrue();
        for (CityContent city : cities) {
            addUrl(xml, "/honey-near/" + city.getSlug(), city.getUpdatedAt(), "0.7", "monthly");
        }

        xml.append("</urlset>");
        return xml.toString();
    }

    private void addUrl(StringBuilder xml, String path, LocalDateTime lastMod, String priority, String changeFreq) {
        xml.append("  <url>\n");
        xml.append("    <loc>").append(escapeXml(BASE_URL + path)).append("</loc>\n");
        if (lastMod != null) {
            xml.append("    <lastmod>").append(lastMod.format(DATE_FORMAT)).append("</lastmod>\n");
        }
        xml.append("    <changefreq>").append(changeFreq).append("</changefreq>\n");
        xml.append("    <priority>").append(priority).append("</priority>\n");
        xml.append("  </url>\n");
    }

    private String escapeXml(String input) {
        if (input == null) return "";
        return input
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&apos;");
    }
}
