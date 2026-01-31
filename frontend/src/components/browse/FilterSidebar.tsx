import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import type { FilterOptions } from '../../services/api';
import { Badge } from '../ui';

interface FilterSidebarProps {
  filterOptions: FilterOptions | null;
  selectedOrigins: string[];
  selectedFloralSources: string[];
  selectedTypes: string[];
  priceMin?: number;
  priceMax?: number;
  onOriginChange: (origins: string[]) => void;
  onFloralSourceChange: (sources: string[]) => void;
  onTypeChange: (types: string[]) => void;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  onClearAll: () => void;
}

interface FilterSectionProps {
  title: string;
  options: { value: string; displayName: string; count: number }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function FilterSection({ title, options, selected, onChange }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="border-b border-comb-100 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-comb-800 mb-3"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-comb-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                className="w-4 h-4 rounded border-comb-300 text-honey-500 focus:ring-honey-400"
              />
              <span className="text-sm text-comb-700 group-hover:text-comb-900 flex-1">
                {option.displayName}
              </span>
              <span className="text-xs text-comb-400">({option.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({
  filterOptions,
  selectedOrigins,
  selectedFloralSources,
  selectedTypes,
  priceMin,
  priceMax,
  onOriginChange,
  onFloralSourceChange,
  onTypeChange,
  onPriceChange,
  onClearAll,
}: FilterSidebarProps) {
  const hasActiveFilters =
    selectedOrigins.length > 0 ||
    selectedFloralSources.length > 0 ||
    selectedTypes.length > 0 ||
    priceMin !== undefined ||
    priceMax !== undefined;

  if (!filterOptions) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-honey-sm animate-pulse">
        <div className="h-6 bg-comb-100 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-comb-100 rounded w-3/4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-honey-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-comb-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-honey-600 hover:text-honey-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-comb-100">
          {selectedOrigins.map((origin) => {
            const opt = filterOptions.origins.find((o) => o.value === origin);
            return (
              <Badge key={origin} variant="honey" size="sm" className="pr-1">
                {opt?.displayName || origin}
                <button
                  onClick={() => onOriginChange(selectedOrigins.filter((o) => o !== origin))}
                  className="ml-1 hover:bg-honey-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
          {selectedFloralSources.map((source) => {
            const opt = filterOptions.floralSources.find((s) => s.value === source);
            return (
              <Badge key={source} variant="info" size="sm" className="pr-1">
                {opt?.displayName || source}
                <button
                  onClick={() => onFloralSourceChange(selectedFloralSources.filter((s) => s !== source))}
                  className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
          {selectedTypes.map((type) => {
            const opt = filterOptions.types.find((t) => t.value === type);
            return (
              <Badge key={type} variant="neutral" size="sm" className="pr-1">
                {opt?.displayName || type}
                <button
                  onClick={() => onTypeChange(selectedTypes.filter((t) => t !== type))}
                  className="ml-1 hover:bg-comb-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      <FilterSection
        title="Floral Source"
        options={filterOptions.floralSources}
        selected={selectedFloralSources}
        onChange={onFloralSourceChange}
      />

      <FilterSection
        title="Origin"
        options={filterOptions.origins}
        selected={selectedOrigins}
        onChange={onOriginChange}
      />

      <FilterSection
        title="Type"
        options={filterOptions.types}
        selected={selectedTypes}
        onChange={onTypeChange}
      />

      {/* Price Range */}
      <div className="border-t border-comb-100 pt-4 mt-4">
        <div className="font-semibold text-comb-800 mb-3">Price Range</div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-comb-400 text-sm">$</span>
            <input
              type="number"
              placeholder="Min"
              value={priceMin ?? ''}
              onChange={(e) => onPriceChange(
                e.target.value ? parseFloat(e.target.value) : undefined,
                priceMax
              )}
              className="w-full pl-6 pr-2 py-2 text-sm border border-comb-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400"
              min="0"
              step="1"
            />
          </div>
          <span className="text-comb-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-comb-400 text-sm">$</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax ?? ''}
              onChange={(e) => onPriceChange(
                priceMin,
                e.target.value ? parseFloat(e.target.value) : undefined
              )}
              className="w-full pl-6 pr-2 py-2 text-sm border border-comb-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400"
              min="0"
              step="1"
            />
          </div>
        </div>
        {(priceMin !== undefined || priceMax !== undefined) && (
          <button
            onClick={() => onPriceChange(undefined, undefined)}
            className="text-xs text-honey-600 hover:text-honey-700 mt-2"
          >
            Clear price filter
          </button>
        )}
      </div>
    </div>
  );
}
