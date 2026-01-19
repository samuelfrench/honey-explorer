import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Badge, Button, Spinner } from '../components/ui';
import { SEO } from '../components/seo';
import { eventApi, type Event } from '../services/api';

const eventTypeColors: Record<string, string> = {
  FESTIVAL: 'bg-purple-100 text-purple-800 border-purple-200',
  MARKET: 'bg-green-100 text-green-800 border-green-200',
  CLASS: 'bg-blue-100 text-blue-800 border-blue-200',
  TASTING: 'bg-amber-100 text-amber-800 border-amber-200',
  TOUR: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  FAIR: 'bg-orange-100 text-orange-800 border-orange-200',
};

const eventTypeIcons: Record<string, string> = {
  FESTIVAL: '🎉',
  MARKET: '🛒',
  CLASS: '📚',
  TASTING: '🍯',
  TOUR: '🚌',
  FAIR: '🎪',
};

function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = formatDateFull(startDate);
  if (!endDate) return start;
  const end = formatDateFull(endDate);
  return `${start} - ${end}`;
}

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const response = await eventApi.getBySlug(slug);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        setError('Event not found');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-cream">
        <Section padding="lg">
          <Container size="sm">
            <div className="text-center py-12">
              <h1 className="font-display text-2xl font-bold text-comb-900 mb-4">
                {error || 'Event not found'}
              </h1>
              <Link to="/events">
                <Button variant="primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  const badgeClass = eventTypeColors[event.eventType] || 'bg-gray-100 text-gray-800 border-gray-200';
  const icon = eventTypeIcons[event.eventType] || '📅';

  const fullAddress = [event.address, event.city, event.state]
    .filter(Boolean)
    .join(', ');

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <>
      <SEO
        title={event.name}
        description={event.description || `Join us for ${event.name} - a ${event.eventTypeDisplay.toLowerCase()} in ${event.city}, ${event.state}.`}
        image={event.imageUrl || event.thumbnailUrl || undefined}
        url={`/events/${event.slug}`}
        type="website"
      />
      <div className="min-h-screen bg-cream">
        <Section padding="md">
          <Container>
            {/* Back link */}
            <Link
              to="/events"
              className="inline-flex items-center text-comb-600 hover:text-honey-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image */}
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-honey">
                  {event.imageUrl || event.thumbnailUrl ? (
                    <img
                      src={event.imageUrl || event.thumbnailUrl || ''}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-honey-100 to-honey-200 flex items-center justify-center">
                      <span className="text-8xl">{icon}</span>
                    </div>
                  )}
                </div>

                {/* Map Link */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="w-12 h-12 bg-honey-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-honey-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-comb-500">Location</p>
                    <p className="font-medium text-comb-800 truncate">{fullAddress}</p>
                  </div>
                  <span className="text-xs text-honey-600 font-medium">View on Map</span>
                </a>
              </div>

              {/* Details */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-comb-900">
                    {event.name}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badgeClass}`}>
                    {icon} {event.eventTypeDisplay}
                  </span>
                  <Badge variant="neutral" size="md">
                    {event.city}, {event.state}
                  </Badge>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3 mb-6 p-4 bg-honey-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-honey-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-comb-800">When</p>
                    <p className="text-comb-700">
                      {formatDateRange(event.startDate, event.endDate)}
                    </p>
                  </div>
                </div>

                {event.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-comb-800 mb-2">About this Event</h3>
                    <p className="text-comb-700 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Host */}
                {event.localSourceName && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-comb-800 mb-2">Hosted By</h3>
                    <Link
                      to={`/local/${event.localSourceId}`}
                      className="text-honey-600 hover:text-honey-700 underline"
                    >
                      {event.localSourceName}
                    </Link>
                  </div>
                )}

                {/* CTA */}
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="primary" size="lg">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Learn More & Register
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
}
