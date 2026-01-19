package com.honeyexplorer.repository;

import com.honeyexplorer.entity.LocalSource;
import com.honeyexplorer.entity.enums.SourceType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specification for building dynamic LocalSource queries.
 */
public class LocalSourceSpecification {

    /**
     * Build a specification for filtering local sources.
     *
     * @param search Text search on name, description, city
     * @param sourceTypes List of source type values to filter by
     * @param states List of states to filter by
     * @param activeOnly Whether to only include active sources
     * @return Specification for filtering
     */
    public static Specification<LocalSource> withFilters(
            String search,
            List<String> sourceTypes,
            List<String> states,
            boolean activeOnly
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Text search on name, description, city
            if (search != null && !search.isBlank()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), searchLower);
                Predicate descLike = cb.like(cb.lower(root.get("description")), searchLower);
                Predicate cityLike = cb.like(cb.lower(root.get("city")), searchLower);
                Predicate stateLike = cb.like(cb.lower(root.get("state")), searchLower);
                Predicate zipLike = cb.like(root.get("zipCode"), searchLower.replace("%", ""));
                predicates.add(cb.or(nameLike, descLike, cityLike, stateLike, zipLike));
            }

            // Source type filter (multi-select)
            if (sourceTypes != null && !sourceTypes.isEmpty()) {
                List<SourceType> typeEnums = sourceTypes.stream()
                        .map(SourceType::valueOf)
                        .toList();
                predicates.add(root.get("sourceType").in(typeEnums));
            }

            // State filter (multi-select)
            if (states != null && !states.isEmpty()) {
                predicates.add(root.get("state").in(states));
            }

            // Active only filter
            if (activeOnly) {
                predicates.add(cb.equal(root.get("isActive"), true));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
