import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Map, List, Navigation, Search } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { SkeletonCard, Button } from '../components/ui';
import { LocalSourceMap, SourceCard, SourceFilterSidebar } from '../components/local';
import { SEO } from '../components/seo';
import { localSourceApi, filterApi, type LocalSource, type FilterOptions } from '../services/api';

type ViewMode = 'map' | 'list' | 'split';

export function LocalSourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filter values from URL
  const sourceTypes = searchParams.getAll('sourceType');
  const search = searchParams.get('search') || '';

  const [sources, setSources] = useState<LocalSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [searchInput, setSearchInput] = useState(search);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

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

  // Fetch sources when filters change
  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        let response;
        if (userLocation) {
          // Use nearby search if user location is available
          response = await localSourceApi.findNearby({
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius: 100,
            sourceType: sourceTypes.length > 0 ? sourceTypes : undefined,
            size: 100,
          });
          setSources(response.data.content);
        } else {
          // Otherwise get all for map
          const mapResponse = await localSourceApi.getAllForMap(
            sourceTypes.length > 0 ? sourceTypes : undefined
          );
          setSources(mapResponse.data);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load local sources');
        console.error('Error fetching local sources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [sourceTypes.join(','), userLocation]);

  const handleClearAll = () => {
    setSearchInput('');
    setUserLocation(null);
    setSearchParams(new URLSearchParams());
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please try searching by city instead.');
        setIsLocating(false);
      }
    );
  };

  const hasActiveFilters = sourceTypes.length > 0 || userLocation;

  return (
    <>
      <SEO
        title="Find Local Honey Sources"
        description="Discover beekeepers, farms, farmers markets, and specialty stores selling local honey near you. Find the freshest honey in your area."
        url="/local"
      />
      <div className="min-h-screen bg-cream">
        <Section padding="md">
          <Container>
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-comb-900 mb-2">
                Find Local Honey
              </h1>
              <p className="text-comb-600">
                Discover {sources.length} honey sources near you
              </p>
            </div>

            {/* Search and Controls */}
            <div className="mb-6 flex flex-wrap gap-3">
              {/* Search Input */}
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-comb-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by city, state, or zip..."
                  className="w-full pl-10 pr-4 py-3 border border-comb-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-transparent"
                />
              </div>

              {/* Locate Me Button */}
              <Button
                variant="secondary"
                onClick={handleLocateMe}
                disabled={isLocating}
                className="flex items-center gap-2"
              >
                <Navigation className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
                {isLocating ? 'Locating...' : 'Near Me'}
              </Button>

              {/* View Mode Toggle (Desktop) */}
              <div className="hidden lg:flex items-center bg-white rounded-xl border border-comb-200 p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'map' ? 'bg-honey-500 text-white' : 'text-comb-600 hover:bg-comb-50'
                  }`}
                >
                  <Map className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'split' ? 'bg-honey-500 text-white' : 'text-comb-600 hover:bg-comb-50'
                  }`}
                >
                  Split
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-honey-500 text-white' : 'text-comb-600 hover:bg-comb-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-comb-200 rounded-xl text-comb-700 hover:bg-honey-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-honey-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {sourceTypes.length + (userLocation ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* User Location Indicator */}
            {userLocation && (
              <div className="mb-4 flex items-center gap-2 text-sm text-comb-600">
                <Navigation className="w-4 h-4 text-honey-500" />
                <span>Showing sources near your location</span>
                <button
                  onClick={() => setUserLocation(null)}
                  className="text-honey-600 hover:text-honey-700 underline"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="flex gap-6">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-20">
                  <SourceFilterSidebar
                    filterOptions={filterOptions}
                    selectedSourceTypes={sourceTypes}
                    onSourceTypeChange={(values) => updateParams({ sourceType: values })}
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
                      <SourceFilterSidebar
                        filterOptions={filterOptions}
                        selectedSourceTypes={sourceTypes}
                        onSourceTypeChange={(values) => updateParams({ sourceType: values })}
                        onClearAll={handleClearAll}
                      />
                      <div className="mt-4">
                        <Button variant="primary" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                          Show {sources.length} results
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {error && (
                  <div className="text-center text-red-600 py-8">
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                )}

                {!loading && !error && (
                  <div className={`${viewMode === 'split' ? 'lg:flex lg:gap-6' : ''}`}>
                    {/* Map */}
                    {(viewMode === 'map' || viewMode === 'split') && (
                      <div className={`${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'} h-[500px] lg:h-[600px] mb-6 lg:mb-0`}>
                        <LocalSourceMap
                          sources={sources}
                          center={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
                          zoom={userLocation ? 10 : 4}
                          fitToMarkers={!!userLocation}
                        />
                      </div>
                    )}

                    {/* List */}
                    {(viewMode === 'list' || viewMode === 'split') && (
                      <div className={`${viewMode === 'split' ? 'lg:w-1/2 lg:max-h-[600px] lg:overflow-y-auto' : ''}`}>
                        {sources.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-lg text-comb-600 mb-4">No local sources found</p>
                            <Button variant="secondary" onClick={handleClearAll}>
                              Clear all filters
                            </Button>
                          </div>
                        ) : (
                          <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                            {sources.map((source) => (
                              <SourceCard
                                key={source.id}
                                source={source}
                                showDistance={!!userLocation}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
}
