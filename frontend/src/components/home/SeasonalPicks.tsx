import { useState, useEffect } from 'react';
import { Sun, Leaf, Snowflake, Flower2 } from 'lucide-react';
import { Container, Section } from '../layout';
import { HoneyCard } from '../honey';
import { SkeletonCard } from '../ui';
import { honeyApi, type Honey } from '../../services/api';
import {
  getCurrentSeason,
  seasonalHoneys,
  seasonDisplayNames,
  seasonDescriptions,
  type Season,
} from '../../data/seasonalHoneys';

const seasonIcons: Record<Season, React.ElementType> = {
  spring: Flower2,
  summer: Sun,
  fall: Leaf,
  winter: Snowflake,
};

const seasonColors: Record<Season, string> = {
  spring: 'text-green-600',
  summer: 'text-yellow-500',
  fall: 'text-orange-600',
  winter: 'text-blue-500',
};

export function SeasonalPicks() {
  const [honeys, setHoneys] = useState<Honey[]>([]);
  const [loading, setLoading] = useState(true);
  const season = getCurrentSeason();
  const SeasonIcon = seasonIcons[season];

  useEffect(() => {
    const fetchSeasonalHoneys = async () => {
      const slugs = seasonalHoneys[season].slice(0, 4);

      try {
        const results = await Promise.all(
          slugs.map(slug => honeyApi.getBySlug(slug).catch(() => null))
        );
        const validHoneys = results.filter(r => r?.data).map(r => r!.data);
        setHoneys(validHoneys);
      } catch (err) {
        console.error('Error fetching seasonal honeys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonalHoneys();
  }, [season]);

  // Don't render if no honeys found
  if (!loading && honeys.length === 0) return null;

  return (
    <Section padding="lg" background="white">
      <Container>
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <SeasonIcon className={`w-8 h-8 ${seasonColors[season]}`} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-comb-900">
              {seasonDisplayNames[season]} Favorites
            </h2>
          </div>
          <p className="text-comb-600 text-lg">
            {seasonDescriptions[season]}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {honeys.map(honey => (
              <HoneyCard key={honey.id} honey={honey} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
