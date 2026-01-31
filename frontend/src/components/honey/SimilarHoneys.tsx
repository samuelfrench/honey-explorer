import { useState, useEffect } from 'react';
import { HoneyCard } from './HoneyCard';
import { SkeletonCard } from '../ui';
import { honeyApi, type Honey } from '../../services/api';

interface SimilarHoneysProps {
  slug: string;
}

export function SimilarHoneys({ slug }: SimilarHoneysProps) {
  const [honeys, setHoneys] = useState<Honey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    honeyApi.getSimilar(slug, 4)
      .then(res => setHoneys(res.data))
      .catch(err => console.error('Error fetching similar honeys:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-comb-100">
        <h2 className="font-display text-2xl font-semibold text-comb-900 mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (honeys.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-comb-100">
      <h2 className="font-display text-2xl font-semibold text-comb-900 mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {honeys.map(honey => (
          <HoneyCard key={honey.id} honey={honey} />
        ))}
      </div>
    </div>
  );
}
