import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, List, Search } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Spinner } from '../components/ui';
import { SEO } from '../components/seo';
import { EventCard } from '../components/events';
import { eventApi, type Event } from '../services/api';

const eventTypes = [
  { value: 'FESTIVAL', label: 'Festival', icon: '🎉' },
  { value: 'MARKET', label: 'Market', icon: '🛒' },
  { value: 'CLASS', label: 'Class', icon: '📚' },
  { value: 'TASTING', label: 'Tasting', icon: '🍯' },
  { value: 'TOUR', label: 'Tour', icon: '🚌' },
  { value: 'FAIR', label: 'Fair', icon: '🎪' },
];

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const search = searchParams.get('search') || '';
  const selectedTypes = searchParams.getAll('eventType');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await eventApi.browse({
          search: search || undefined,
          eventType: selectedTypes.length > 0 ? selectedTypes : undefined,
          page: 0,
          size: 24,
        });
        setEvents(response.data.content);
        setTotalEvents(response.data.totalElements);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, selectedTypes.join(',')]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const toggleEventType = (type: string) => {
    const params = new URLSearchParams(searchParams);
    const types = params.getAll('eventType');
    if (types.includes(type)) {
      params.delete('eventType');
      types.filter((t) => t !== type).forEach((t) => params.append('eventType', t));
    } else {
      params.append('eventType', type);
    }
    setSearchParams(params);
  };

  return (
    <>
      <SEO
        title="Upcoming Events"
        description="Discover honey festivals, beekeeping classes, farmers markets, and tastings near you. Find the perfect event to learn about honey and meet local producers."
      />
      <div className="min-h-screen bg-cream">
        <Section padding="md">
          <Container>
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-comb-900 mb-2">
                Honey Events
              </h1>
              <p className="text-comb-600">
                Discover {totalEvents} upcoming events
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-comb-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-comb-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-200 outline-none transition-all"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-xl border border-comb-200 p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'grid' ? 'bg-honey-100 text-honey-700' : 'text-comb-500 hover:text-comb-700'
                  }`}
                  aria-label="Grid view"
                >
                  <Calendar className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'list' ? 'bg-honey-100 text-honey-700' : 'text-comb-500 hover:text-comb-700'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Event Type Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => toggleEventType(type.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    selectedTypes.includes(type.value)
                      ? 'bg-honey-500 text-white border-honey-500'
                      : 'bg-white text-comb-700 border-comb-200 hover:border-honey-300'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
              {selectedTypes.length > 0 && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('eventType');
                    setSearchParams(params);
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium text-comb-500 hover:text-comb-700 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Events Grid/List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-comb-300 mb-4" />
                <h3 className="text-lg font-medium text-comb-700 mb-2">No events found</h3>
                <p className="text-comb-500">Try adjusting your search or filters</p>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} compact />
                ))}
              </div>
            )}
          </Container>
        </Section>
      </div>
    </>
  );
}
