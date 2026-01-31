import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { SkeletonCard, Button } from '../components/ui';
import { HoneyCard } from '../components/honey';
import { SearchBar, FilterSidebar } from '../components/browse';
import { SEO } from '../components/seo';
import { honeyApi, filterApi, type Honey, type FilterOptions } from '../services/api';

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filter values from URL
  const search = searchParams.get('search') || '';
  const origins = searchParams.getAll('origin');
  const floralSources = searchParams.getAll('floralSource');
  const types = searchParams.getAll('type');
  const priceMinParam = searchParams.get('priceMin');
  const priceMaxParam = searchParams.get('priceMax');
  const priceMin = priceMinParam ? parseFloat(priceMinParam) : undefined;
  const priceMax = priceMaxParam ? parseFloat(priceMaxParam) : undefined;
  const page = parseInt(searchParams.get('page') || '0', 10);
  const sort = searchParams.get('sort') || 'name';

  const [honeys, setHoneys] = useState<Honey[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);

  // Update URL params
  const updateParams = useCallback((updates: Record<string, string | string[] | null>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      newParams.delete(key);
      if (value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => newParams.append(key, v));
        } else if (value) {
          newParams.set(key, value);
        }
      }
    });

    // Reset to page 0 when filters change (but not when page changes)
    if (!('page' in updates)) {
      newParams.set('page', '0');
    }

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Fetch filter options on mount
  useEffect(() => {
    filterApi.getOptions()
      .then((res) => setFilterOptions(res.data))
      .catch((err) => console.error('Error fetching filter options:', err));
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput || null });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  // Fetch honeys when filters change
  useEffect(() => {
    const fetchHoneys = async () => {
      setLoading(true);
      try {
        const response = await honeyApi.browse({
          search: search || undefined,
          origin: origins.length > 0 ? origins : undefined,
          floralSource: floralSources.length > 0 ? floralSources : undefined,
          type: types.length > 0 ? types : undefined,
          priceMin,
          priceMax,
          page,
          size: 24,
          sort,
        });
        setHoneys(response.data.content);
        setTotalElements(response.data.totalElements);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError('Failed to load honeys');
        console.error('Error fetching honeys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHoneys();
  }, [search, origins.join(','), floralSources.join(','), types.join(','), priceMin, priceMax, page, sort]);

  const handleClearAll = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = search || origins.length > 0 || floralSources.length > 0 || types.length > 0 || priceMin !== undefined || priceMax !== undefined;

  // Dynamic SEO based on filters
  const seoTitle = useMemo(() => {
    const parts: string[] = [];
    if (search) parts.push(`"${search}"`);
    if (origins.length === 1 && filterOptions) {
      const origin = filterOptions.origins.find(o => o.value === origins[0]);
      parts.push(origin?.displayName || origins[0]);
    }
    if (floralSources.length === 1 && filterOptions) {
      const source = filterOptions.floralSources.find(s => s.value === floralSources[0]);
      parts.push(source?.displayName || floralSources[0]);
    }
    if (types.length === 1 && filterOptions) {
      const type = filterOptions.types.find(t => t.value === types[0]);
      parts.push(type?.displayName || types[0]);
    }

    if (parts.length > 0) {
      return `${parts.join(' ')} Honey - Browse`;
    }
    return 'Browse All Honey';
  }, [search, origins, floralSources, types, filterOptions]);

  const seoDescription = useMemo(() => {
    if (hasActiveFilters) {
      return `Explore ${totalElements} honey varieties matching your criteria. Filter by origin, floral source, and type to find your perfect honey.`;
    }
    return 'Browse our complete collection of over 200 honey varieties from around the world. Filter by origin, floral source, and type.';
  }, [hasActiveFilters, totalElements]);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        url="/browse"
      />
      <div className="min-h-screen bg-cream">
      <Section padding="md">
        <Container>
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-comb-900 mb-2">
              Browse Honey
            </h1>
            <p className="text-comb-600">
              Explore our collection of {totalElements} honey varieties
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                />
              </div>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-comb-200 rounded-xl text-comb-700 hover:bg-honey-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-honey-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {origins.length + floralSources.length + types.length + (search ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <FilterSidebar
                  filterOptions={filterOptions}
                  selectedOrigins={origins}
                  selectedFloralSources={floralSources}
                  selectedTypes={types}
                  priceMin={priceMin}
                  priceMax={priceMax}
                  onOriginChange={(values) => updateParams({ origin: values })}
                  onFloralSourceChange={(values) => updateParams({ floralSource: values })}
                  onTypeChange={(values) => updateParams({ type: values })}
                  onPriceChange={(min, max) => updateParams({
                    priceMin: min !== undefined ? String(min) : null,
                    priceMax: max !== undefined ? String(max) : null
                  })}
                  onClearAll={handleClearAll}
                />
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-cream overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-lg text-comb-900">Filters</h2>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-2 text-comb-500 hover:text-comb-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <FilterSidebar
                      filterOptions={filterOptions}
                      selectedOrigins={origins}
                      selectedFloralSources={floralSources}
                      selectedTypes={types}
                      priceMin={priceMin}
                      priceMax={priceMax}
                      onOriginChange={(values) => updateParams({ origin: values })}
                      onFloralSourceChange={(values) => updateParams({ floralSource: values })}
                      onTypeChange={(values) => updateParams({ type: values })}
                      onPriceChange={(min, max) => updateParams({
                        priceMin: min !== undefined ? String(min) : null,
                        priceMax: max !== undefined ? String(max) : null
                      })}
                      onClearAll={handleClearAll}
                    />
                    <div className="mt-4">
                      <Button variant="primary" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                        Show {totalElements} results
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Sort Options */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-comb-500">
                  {loading ? 'Loading...' : `${totalElements} honeys`}
                </p>
                <select
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value, page: '0' })}
                  className="px-3 py-2 border border-comb-200 rounded-lg text-sm text-comb-700 bg-white focus:outline-none focus:ring-2 focus:ring-honey-400"
                >
                  <option value="name">Name A-Z</option>
                  <option value="floralSource">Floral Source</option>
                  <option value="origin">Origin</option>
                </select>
              </div>

              {error && (
                <div className="text-center text-red-600 py-8">
                  {error}
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(24)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {!loading && !error && honeys.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-comb-600 mb-4">No honeys found matching your criteria</p>
                  <Button variant="secondary" onClick={handleClearAll}>
                    Clear all filters
                  </Button>
                </div>
              )}

              {!loading && !error && honeys.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {honeys.map((honey) => (
                      <HoneyCard key={honey.id} honey={honey} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      <button
                        onClick={() => updateParams({ page: String(Math.max(0, page - 1)) })}
                        disabled={page === 0}
                        className="px-4 py-2 rounded-lg bg-white border border-comb-200 text-comb-700 hover:bg-honey-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-comb-600">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() => updateParams({ page: String(Math.min(totalPages - 1, page + 1)) })}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 rounded-lg bg-white border border-comb-200 text-comb-700 hover:bg-honey-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </Container>
      </Section>
    </div>
    </>
  );
}
