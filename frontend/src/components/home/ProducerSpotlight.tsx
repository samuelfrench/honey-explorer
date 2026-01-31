import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Users } from 'lucide-react';
import { Container, Section } from '../layout';
import { Spinner, Badge } from '../ui';
import { localSourceApi, type LocalSource } from '../../services/api';

// Featured producer slugs - these should exist in the database
const FEATURED_SLUGS = [
  'sweet-valley-apiaries',
  'heritage-bee-farms',
  'mountain-meadow-honey',
];

export function ProducerSpotlight() {
  const [producers, setProducers] = useState<LocalSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const results = await Promise.all(
          FEATURED_SLUGS.map(slug => localSourceApi.getBySlug(slug).catch(() => null))
        );
        const validProducers = results.filter(r => r?.data).map(r => r!.data);
        setProducers(validProducers);
      } catch (err) {
        console.error('Error fetching featured producers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  // Don't render if no producers found
  if (!loading && producers.length === 0) return null;

  return (
    <Section padding="lg" background="cream">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-6 h-6 text-honey-600" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-comb-900">
                Meet Local Producers
              </h2>
            </div>
            <p className="text-comb-600 text-lg">
              Discover the beekeepers and farms behind your honey
            </p>
          </div>
          <Link
            to="/local"
            className="hidden md:flex items-center gap-1 text-honey-600 hover:text-honey-700 font-medium"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {producers.map(producer => (
              <Link
                key={producer.id}
                to={`/local/${producer.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-honey hover:shadow-honey-lg transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  {producer.thumbnailUrl || producer.heroImageUrl ? (
                    <img
                      src={producer.thumbnailUrl || producer.heroImageUrl || ''}
                      alt={producer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-honey-100 to-honey-200 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-honey-400" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-comb-900 group-hover:text-honey-600 transition-colors">
                        {producer.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-sm text-comb-500">
                        <MapPin className="w-4 h-4" />
                        <span>{producer.city}, {producer.state}</span>
                      </div>
                    </div>
                    <Badge variant="honey" size="sm">
                      {producer.sourceTypeDisplay}
                    </Badge>
                  </div>
                  {producer.description && (
                    <p className="mt-3 text-sm text-comb-600 line-clamp-2">
                      {producer.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile "View All" link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/local"
            className="inline-flex items-center gap-1 text-honey-600 hover:text-honey-700 font-medium"
          >
            View All Local Sources
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
