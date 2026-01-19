import { Link } from 'react-router-dom';
import { Card } from '../ui';
import { Badge } from '../ui';
import type { Honey } from '../../services/api';

interface HoneyCardProps {
  honey: Honey;
}

export function HoneyCard({ honey }: HoneyCardProps) {
  return (
    <Link to={`/honey/${honey.slug}`} className="block">
      <Card padding="none" className="overflow-hidden h-full">
        {/* Image */}
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={honey.thumbnailUrl || honey.imageUrl}
            alt={honey.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
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
