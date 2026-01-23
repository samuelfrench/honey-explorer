import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Store } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Button, Spinner } from '../components/ui';
import { SEO, JsonLd } from '../components/seo';
import { SourceCard } from '../components/local';
import { cityApi, type CityContent, type LocalSource, type Event, type FAQ } from '../services/api';

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const [city, setCity] = useState<CityContent | null>(null);
  const [sources, setSources] = useState<LocalSource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const [cityRes, sourcesRes, eventsRes] = await Promise.all([
          cityApi.getBySlug(slug),
          cityApi.getSources(slug, 0, 6),
          cityApi.getEvents(slug),
        ]);
        setCity(cityRes.data);
        setSources(sourcesRes.data.content);
        setEvents(eventsRes.data.slice(0, 4));
        setError(null);
      } catch (err) {
        setError('City not found');
        console.error('Error fetching city:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="min-h-screen bg-cream">
        <Section padding="lg">
          <Container size="sm">
            <div className="text-center py-12">
              <h1 className="font-display text-2xl font-bold text-comb-900 mb-4">
                {error || 'City not found'}
              </h1>
              <Link to="/local">
                <Button variant="primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Find Local Sources
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  // Parse FAQ JSON
  let faqs: FAQ[] = [];
  try {
    if (city.faqJson) {
      faqs = JSON.parse(city.faqJson);
    }
  } catch {
    // Invalid JSON, ignore
  }

  const title = `Find Local Honey in ${city.city}, ${city.state}`;
  const description = city.introText ||
    `Discover local honey sources, beekeepers, and farmers markets in ${city.city}, ${city.state}. Find raw honey near you.`;

  // Create FAQ schema for rich results
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <SEO
        title={title}
        description={description}
        url={`/honey-near/${city.slug}`}
      />
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="min-h-screen bg-cream">
        {/* Hero Section */}
        <Section padding="lg" background="honey">
          <Container>
            <Link
              to="/local"
              className="inline-flex items-center text-honey-700 hover:text-honey-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Local Sources
            </Link>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-honey-900 mb-4">
              Find Local Honey in {city.city}, {city.state}
            </h1>

            {city.introText && (
              <p className="text-lg text-honey-700 max-w-3xl mb-6">
                {city.introText}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg">
                <Store className="w-5 h-5 text-honey-600" />
                <span className="font-medium text-honey-800">
                  {city.nearbySourcesCount} Local Sources
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg">
                <Calendar className="w-5 h-5 text-honey-600" />
                <span className="font-medium text-honey-800">
                  {city.upcomingEventsCount} Upcoming Events
                </span>
              </div>
            </div>
          </Container>
        </Section>

        {/* Local Sources Section */}
        {sources.length > 0 && (
          <Section padding="lg">
            <Container>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-comb-900">
                  Local Honey Sources Near {city.city}
                </h2>
                <Link to="/local">
                  <Button variant="ghost">View All</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sources.map((source) => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* Honey Facts Section */}
        {city.honeyFacts && (
          <Section padding="lg" background="white">
            <Container size="md">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-comb-900 mb-4">
                Honey in {city.city}
              </h2>
              <div className="prose prose-lg max-w-none text-comb-700">
                {city.honeyFacts.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* Buying Tips Section */}
        {city.buyingTips && (
          <Section padding="lg">
            <Container size="md">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-comb-900 mb-4">
                Tips for Buying Local Honey
              </h2>
              <div className="prose prose-lg max-w-none text-comb-700">
                {city.buyingTips.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* Best Seasons Section */}
        {city.bestSeasons && (
          <Section padding="md" background="honey">
            <Container size="md">
              <h2 className="font-display text-2xl font-bold text-honey-900 mb-4">
                Best Time to Buy Local Honey
              </h2>
              <p className="text-honey-700">{city.bestSeasons}</p>
            </Container>
          </Section>
        )}

        {/* Upcoming Events Section */}
        {events.length > 0 && (
          <Section padding="lg">
            <Container>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-comb-900">
                  Upcoming Honey Events in {city.state}
                </h2>
                <Link to="/events">
                  <Button variant="ghost">View All Events</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.slug}`}
                    className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-honey-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-honey-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-comb-900">{event.name}</h3>
                        <p className="text-sm text-comb-600">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        {event.city && (
                          <p className="text-sm text-comb-500 mt-1">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {event.city}, {event.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <Section padding="lg" background="white">
            <Container size="md">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-comb-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-cream rounded-xl p-6">
                    <h3 className="font-semibold text-comb-900 mb-2">{faq.question}</h3>
                    <p className="text-comb-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* CTA Section */}
        <Section padding="lg" background="honey">
          <Container size="sm">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-honey-900 mb-4">
                Ready to Find Local Honey?
              </h2>
              <p className="text-honey-700 mb-6">
                Browse all local honey sources and find the perfect one near you.
              </p>
              <Link to="/local">
                <Button variant="primary" size="lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Local Sources
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
}
