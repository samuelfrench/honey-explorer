import { Link } from 'react-router-dom';
import { Scale, Heart } from 'lucide-react';
import { Card } from '../ui';
import { Badge } from '../ui';
import { useCompare } from '../../context/CompareContext';
import { useFavorites } from '../../context/FavoritesContext';
import type { Honey } from '../../services/api';

interface HoneyCardProps {
  honey: Honey;
}

export function HoneyCard({ honey }: HoneyCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const inCompare = isInCompare(honey.id);
  const favorited = isFavorite(honey.slug);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(honey.id);
    } else {
      addToCompare(honey);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(honey.slug);
  };

  return (
    <Link to={`/honey/${honey.slug}`} className="block">
      <Card padding="none" className="overflow-hidden h-full">
        {/* Image */}
        <div className="aspect-[4/5] overflow-hidden relative">
          <img
            src={honey.thumbnailUrl || honey.imageUrl}
            alt={honey.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full shadow-sm transition-all ${
                favorited
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-comb-400 hover:bg-white hover:text-red-500'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
            {/* Compare button */}
            <button
              onClick={handleCompareClick}
              disabled={!canAddMore && !inCompare}
              className={`p-2 rounded-full shadow-sm transition-all ${
                inCompare
                  ? 'bg-honey-500 text-white'
                  : 'bg-white/90 text-comb-600 hover:bg-white hover:text-honey-600'
              } ${!canAddMore && !inCompare ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={inCompare ? 'Remove from compare' : 'Add to compare'}
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-lg text-comb-900 mb-2 line-clamp-2">
            {honey.name}
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge variant="honey" size="sm">
              {honey.floralSourceDisplay}
            </Badge>
            <Badge variant="info" size="sm">
              {honey.originDisplay}
            </Badge>
          </div>

          {honey.flavorProfiles && (
            <p className="text-sm text-comb-500 line-clamp-1">
              {honey.flavorProfiles.split(',').slice(0, 3).map(f =>
                f.charAt(0) + f.slice(1).toLowerCase()
              ).join(', ')}
            </p>
          )}

          {(honey.priceMin || honey.priceMax) && (
            <p className="text-sm text-honey-700 font-medium mt-2">
              ${honey.priceMin?.toFixed(2)}
              {honey.priceMax && honey.priceMax !== honey.priceMin && ` - $${honey.priceMax.toFixed(2)}`}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
