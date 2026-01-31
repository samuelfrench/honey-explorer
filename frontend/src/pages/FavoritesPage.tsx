import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { HoneyCard } from '../components/honey';
import { Button, SkeletonCard } from '../components/ui';
import { SEO } from '../components/seo';
import { useFavorites } from '../context/FavoritesContext';
import { honeyApi, type Honey } from '../services/api';

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const [honeys, setHoneys] = useState<Honey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setHoneys([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          favorites.map(slug => honeyApi.getBySlug(slug).catch(() => null))
        );
        setHoneys(results.filter(r => r?.data).map(r => r!.data));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  return (
    <>
      <SEO
        title="My Favorites"
        description="Your saved honey varieties - easy access to your favorite honeys."
        url="/favorites"
      />
      <div className="min-h-screen bg-cream">
        <Section padding="md">
          <Container>
            {/* Header */}
            <div className="mb-6">
              <Link
                to="/browse"
                className="inline-flex items-center text-comb-600 hover:text-honey-600 transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Browse
              </Link>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-comb-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                My Favorites
              </h1>
              {favorites.length > 0 && (
                <p className="text-comb-600 mt-2">
                  {favorites.length} saved {favorites.length === 1 ? 'honey' : 'honeys'}
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(favorites.length || 3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && favorites.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-comb-300 mx-auto mb-4" />
                <h2 className="font-display text-xl font-semibold text-comb-900 mb-2">
                  No favorites yet
                </h2>
                <p className="text-comb-600 mb-6">
                  Browse our collection and click the heart icon on any honey to save it here.
                </p>
                <Link to="/browse">
                  <Button variant="primary">
                    Browse Honeys
                  </Button>
                </Link>
              </div>
            )}

            {/* Favorites Grid */}
            {!loading && honeys.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {honeys.map(honey => (
                  <HoneyCard key={honey.id} honey={honey} />
                ))}
              </div>
            )}
          </Container>
        </Section>
      </div>
    </>
  );
}
