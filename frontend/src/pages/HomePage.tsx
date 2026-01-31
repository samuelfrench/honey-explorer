import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Button, SkeletonCard } from '../components/ui';
import { HoneyCard } from '../components/honey';
import { EventsCarousel } from '../components/events';
import { SeasonalPicks, ProducerSpotlight } from '../components/home';
import { HoneyQuiz } from '../components/quiz';
import { SEO, JsonLd, createWebSiteSchema, createOrganizationSchema } from '../components/seo';
import { honeyApi, type Honey } from '../services/api';

export function HomePage() {
  const [featuredHoneys, setFeaturedHoneys] = useState<Honey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await honeyApi.getFeatured();
        setFeaturedHoneys(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load featured honeys');
        console.error('Error fetching featured honeys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <>
      <SEO
        title="Raw Honey Guide"
        description="Discover over 200 varieties of honey from around the world. Find local sources, compare flavors, and explore the fascinating world of honey."
        url="/"
      />
      <JsonLd data={createWebSiteSchema()} />
      <JsonLd data={createOrganizationSchema()} />
      <div className="min-h-screen bg-cream">
        {/* Hero Section */}
      <Section padding="lg" background="honey">
        <Container size="md">
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Droplet className="w-16 h-16 text-honey-600 fill-honey-200" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-honey-900 mb-4">
              Discover Amazing Honey
            </h1>
            <p className="text-xl text-honey-700 mb-8 max-w-2xl mx-auto">
              Explore over 200 varieties of honey from around the world.
              Find local sources, compare flavors, and discover your perfect honey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Browse All Honey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/local">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Local Sources
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Quiz Section */}
      <Section padding="lg" background="white">
        <Container size="md">
          {!showQuiz ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-honey-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-honey-600" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-comb-900 mb-3">
                Find Your Perfect Honey
              </h2>
              <p className="text-comb-600 text-lg mb-6 max-w-xl mx-auto">
                Answer a few quick questions and we'll recommend the ideal honey varieties for your taste and needs.
              </p>
              <Button variant="primary" size="lg" onClick={() => setShowQuiz(true)}>
                <Sparkles className="w-5 h-5 mr-2" />
                Take the Quiz
              </Button>
            </div>
          ) : (
            <HoneyQuiz onClose={() => setShowQuiz(false)} />
          )}
        </Container>
      </Section>

      {/* Featured Honeys Section */}
      <Section padding="lg" background="cream">
        <Container>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-comb-900 mb-3">
              Featured Honeys
            </h2>
            <p className="text-comb-600 text-lg">
              Hand-picked selections from our curated collection
            </p>
          </div>

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

          {!loading && !error && featuredHoneys.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHoneys.map((honey) => (
                <HoneyCard key={honey.id} honey={honey} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/browse">
              <Button variant="ghost" size="lg">
                View All Honeys
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Seasonal Picks Section */}
      <SeasonalPicks />

      {/* Events Carousel Section */}
      <Section padding="lg" background="white">
        <Container>
          <EventsCarousel />
        </Container>
      </Section>

      {/* Producer Spotlight Section */}
      <ProducerSpotlight />

      {/* Stats Section */}
      <Section padding="md" background="honey">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-4xl font-bold text-honey-800 mb-2">200+</p>
              <p className="text-honey-700">Honey Varieties</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-honey-800 mb-2">50+</p>
              <p className="text-honey-700">Local Sources</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-honey-800 mb-2">30+</p>
              <p className="text-honey-700">Countries</p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
    </>
  );
}
