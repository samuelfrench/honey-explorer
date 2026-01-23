import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Globe, Instagram, Facebook, Clock } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Badge, Button, Spinner } from '../components/ui';
import { SEO, JsonLd, createLocalBusinessSchema } from '../components/seo';
import { localSourceApi, type LocalSource } from '../services/api';

interface BusinessHours {
  [key: string]: string;
}

const dayNames: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const sourceTypeColors: Record<string, string> = {
  BEEKEEPER: 'bg-amber-100 text-amber-800 border-amber-200',
  FARM: 'bg-green-100 text-green-800 border-green-200',
  FARMERS_MARKET: 'bg-orange-100 text-orange-800 border-orange-200',
  STORE: 'bg-blue-100 text-blue-800 border-blue-200',
  APIARY: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  COOPERATIVE: 'bg-purple-100 text-purple-800 border-purple-200',
};

export function ProducerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [source, setSource] = useState<LocalSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSource = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const response = await localSourceApi.getBySlug(slug);
        setSource(response.data);
        setError(null);
      } catch (err) {
        setError('Local source not found');
        console.error('Error fetching local source:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSource();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !source) {
    return (
      <div className="min-h-screen bg-cream">
        <Section padding="lg">
          <Container size="sm">
            <div className="text-center py-12">
              <h1 className="font-display text-2xl font-bold text-comb-900 mb-4">
                {error || 'Local source not found'}
              </h1>
              <Link to="/local">
                <Button variant="primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Local Sources
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  const badgeClass = sourceTypeColors[source.sourceType] || 'bg-gray-100 text-gray-800 border-gray-200';
  let businessHours: BusinessHours | null = null;
  try {
    if (source.hoursJson) {
      businessHours = JSON.parse(source.hoursJson);
    }
  } catch {
    // Invalid JSON, ignore
  }

  const fullAddress = [source.address, source.city, source.state, source.zipCode]
    .filter(Boolean)
    .join(', ');

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <>
      <SEO
        title={source.name}
        description={source.description || `Visit ${source.name}, a ${source.sourceTypeDisplay.toLowerCase()} in ${source.city}, ${source.state}. Find local honey and support local beekeepers.`}
        image={source.heroImageUrl || source.thumbnailUrl || undefined}
        url={`/local/${source.slug}`}
        type="website"
      />
      <JsonLd
        data={createLocalBusinessSchema({
          name: source.name,
          description: source.description || undefined,
          image: source.heroImageUrl || source.thumbnailUrl || undefined,
          address: source.address || undefined,
          city: source.city || undefined,
          state: source.state || undefined,
          zipCode: source.zipCode || undefined,
          phone: source.phone || undefined,
          email: source.email || undefined,
          website: source.website || undefined,
          latitude: source.latitude ?? undefined,
          longitude: source.longitude ?? undefined,
          url: `/local/${source.slug}`,
        })}
      />
      <div className="min-h-screen bg-cream">
        <Section padding="md">
          <Container>
            {/* Back link */}
            <Link
              to="/local"
              className="inline-flex items-center text-comb-600 hover:text-honey-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Local Sources
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image */}
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-honey">
                  {source.heroImageUrl || source.thumbnailUrl ? (
                    <img
                      src={source.heroImageUrl || source.thumbnailUrl || ''}
                      alt={source.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-honey-100 to-honey-200 flex items-center justify-center">
                      <MapPin className="w-24 h-24 text-honey-400" />
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
                    {source.name}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badgeClass}`}>
                    {source.sourceTypeDisplay}
                  </span>
                  <Badge variant="neutral" size="md">
                    {source.city}, {source.state}
                  </Badge>
                </div>

                {source.description && (
                  <p className="text-comb-700 text-lg leading-relaxed mb-6">
                    {source.description}
                  </p>
                )}

                {/* Contact Information */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-comb-800">Contact Information</h3>

                  {source.phone && (
                    <a
                      href={`tel:${source.phone}`}
                      className="flex items-center gap-3 text-comb-700 hover:text-honey-600 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-honey-500" />
                      <span>{source.phone}</span>
                    </a>
                  )}

                  {source.email && (
                    <a
                      href={`mailto:${source.email}`}
                      className="flex items-center gap-3 text-comb-700 hover:text-honey-600 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-honey-500" />
                      <span>{source.email}</span>
                    </a>
                  )}

                  {source.website && (
                    <a
                      href={source.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-comb-700 hover:text-honey-600 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-honey-500" />
                      <span className="underline">{source.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>

                {/* Social Media */}
                {(source.instagramHandle || source.facebookUrl) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-comb-800 mb-3">Social Media</h3>
                    <div className="flex gap-3">
                      {source.instagramHandle && (
                        <a
                          href={`https://instagram.com/${source.instagramHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Instagram className="w-5 h-5" />
                          <span className="text-sm font-medium">{source.instagramHandle}</span>
                        </a>
                      )}
                      {source.facebookUrl && (
                        <a
                          href={source.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Facebook className="w-5 h-5" />
                          <span className="text-sm font-medium">Facebook</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                {businessHours && Object.keys(businessHours).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-comb-800 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-honey-500" />
                      Business Hours
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-card">
                      <div className="space-y-2">
                        {Object.entries(dayNames).map(([key, dayName]) => {
                          const hours = businessHours?.[key];
                          return (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-comb-600">{dayName}</span>
                              <span className={hours ? 'text-comb-800 font-medium' : 'text-comb-400'}>
                                {hours || 'Closed'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                {source.website && (
                  <a
                    href={source.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="primary" size="lg">
                      <Globe className="w-5 h-5 mr-2" />
                      Visit Website
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
