package com.honeyexplorer.repository;

import com.honeyexplorer.entity.Honey;
import com.honeyexplorer.entity.enums.FloralSource;
import com.honeyexplorer.entity.enums.HoneyOrigin;
import com.honeyexplorer.entity.enums.HoneyType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specification for building dynamic Honey queries.
 */
public class HoneySpecification {

    /**
     * Build a specification for filtering honeys.
     *
     * @param search Text search on name, description, brand
     * @param origins List of origin values to filter by
     * @param floralSources List of floral source values to filter by
     * @param types List of honey type values to filter by
     * @return Specification for filtering
     */
    public static Specification<Honey> withFilters(
            String search,
            List<String> origins,
            List<String> floralSources,
            List<String> types
    ) {
        return withFilters(search, origins, floralSources, types, null, null);
    }

    /**
     * Build a specification for filtering honeys with price range.
     *
     * @param search Text search on name, description, brand
     * @param origins List of origin values to filter by
     * @param floralSources List of floral source values to filter by
     * @param types List of honey type values to filter by
     * @param priceMin Minimum price filter
     * @param priceMax Maximum price filter
     * @return Specification for filtering
     */
    public static Specification<Honey> withFilters(
            String search,
            List<String> origins,
            List<String> floralSources,
            List<String> types,
            BigDecimal priceMin,
            BigDecimal priceMax
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Text search on name, description, brand
            if (search != null && !search.isBlank()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), searchLower);
                Predicate descLike = cb.like(cb.lower(root.get("description")), searchLower);
                Predicate brandLike = cb.like(cb.lower(root.get("brand")), searchLower);
                predicates.add(cb.or(nameLike, descLike, brandLike));
            }

            // Origin filter (multi-select)
            if (origins != null && !origins.isEmpty()) {
                List<HoneyOrigin> originEnums = origins.stream()
                        .map(HoneyOrigin::valueOf)
                        .toList();
                predicates.add(root.get("origin").in(originEnums));
            }

            // Floral source filter (multi-select)
            if (floralSources != null && !floralSources.isEmpty()) {
                List<FloralSource> sourceEnums = floralSources.stream()
                        .map(FloralSource::valueOf)
                        .toList();
                predicates.add(root.get("floralSource").in(sourceEnums));
            }

            // Type filter (multi-select)
            if (types != null && !types.isEmpty()) {
                List<HoneyType> typeEnums = types.stream()
                        .map(HoneyType::valueOf)
                        .toList();
                predicates.add(root.get("type").in(typeEnums));
            }

            // Price range filter
            if (priceMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("priceMin"), priceMin));
            }
            if (priceMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("priceMax"), priceMax));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
