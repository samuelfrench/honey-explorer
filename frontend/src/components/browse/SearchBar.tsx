import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  placeholder?: string;
}

export function SearchBar({ value, onChange, resultCount, placeholder = 'Search honeys...' }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-comb-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-comb-200 rounded-xl bg-white
                     text-comb-900 placeholder:text-comb-400
                     focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-honey-400
                     transition-shadow"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-comb-400 hover:text-comb-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {resultCount !== undefined && (
        <p className="mt-2 text-sm text-comb-500">
          {resultCount === 0 ? 'No results found' : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`}
        </p>
      )}
    </div>
  );
}
