import { RotateCcw } from 'lucide-react';
import type { FilterOptions } from '../../services/api';

interface SourceFilterSidebarProps {
  filterOptions: FilterOptions | null;
  selectedSourceTypes: string[];
  onSourceTypeChange: (values: string[]) => void;
  onClearAll: () => void;
}

const sourceTypeIcons: Record<string, string> = {
  BEEKEEPER: '🐝',
  FARM: '🏡',
  FARMERS_MARKET: '🛒',
  STORE: '🏪',
  APIARY: '🍯',
  COOPERATIVE: '🤝',
};

export function SourceFilterSidebar({
  filterOptions,
  selectedSourceTypes,
  onSourceTypeChange,
  onClearAll,
}: SourceFilterSidebarProps) {
  const hasFilters = selectedSourceTypes.length > 0;

  const toggleSourceType = (value: string) => {
    if (selectedSourceTypes.includes(value)) {
      onSourceTypeChange(selectedSourceTypes.filter((v) => v !== value));
    } else {
      onSourceTypeChange([...selectedSourceTypes, value]);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-comb-900">Filters</h3>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-sm text-comb-500 hover:text-honey-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Source Type Filter */}
      <div>
        <h4 className="text-sm font-medium text-comb-700 mb-3">Source Type</h4>
        <div className="space-y-2">
          {filterOptions?.sourceTypes.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedSourceTypes.includes(option.value)}
                onChange={() => toggleSourceType(option.value)}
                className="w-4 h-4 rounded border-comb-300 text-honey-500 focus:ring-honey-400"
              />
              <span className="text-lg" role="img" aria-hidden="true">
                {sourceTypeIcons[option.value] || '📍'}
              </span>
              <span className="text-sm text-comb-700 group-hover:text-honey-600 transition-colors flex-1">
                {option.displayName}
              </span>
              <span className="text-xs text-comb-400">
                {option.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-comb-100">
        <h4 className="text-xs font-medium text-comb-500 uppercase tracking-wide mb-2">Map Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {filterOptions?.sourceTypes.map((option) => (
            <div key={option.value} className="flex items-center gap-1.5">
              <span>{sourceTypeIcons[option.value] || '📍'}</span>
              <span className="text-comb-600 truncate">{option.displayName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
