import { Link } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';
import type { LocalSource } from '../../services/api';

interface SourceCardProps {
  source: LocalSource;
  showDistance?: boolean;
}

const sourceTypeColors: Record<string, string> = {
  BEEKEEPER: 'bg-amber-100 text-amber-800',
  FARM: 'bg-green-100 text-green-800',
  FARMERS_MARKET: 'bg-orange-100 text-orange-800',
  STORE: 'bg-blue-100 text-blue-800',
  APIARY: 'bg-yellow-100 text-yellow-800',
  COOPERATIVE: 'bg-purple-100 text-purple-800',
};

export function SourceCard({ source, showDistance = false }: SourceCardProps) {
  const badgeClass = sourceTypeColors[source.sourceType] || 'bg-gray-100 text-gray-800';

  return (
    <Link
      to={`/local/${source.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {source.thumbnailUrl ? (
          <img
            src={source.thumbnailUrl}
            alt={source.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-honey-100 to-honey-200 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-honey-400" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            {source.sourceTypeDisplay}
          </span>
        </div>
        {showDistance && source.distance !== null && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-comb-700">
            {source.distance.toFixed(1)} mi
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-comb-900 group-hover:text-honey-600 transition-colors line-clamp-1">
          {source.name}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-sm text-comb-500">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{source.city}, {source.state}</span>
        </div>
        {source.description && (
          <p className="mt-2 text-sm text-comb-600 line-clamp-2">
            {source.description}
          </p>
        )}
        {source.website && (
          <div className="mt-3 flex items-center gap-1 text-xs text-honey-600">
            <ExternalLink className="w-3 h-3" />
            <span>Visit Website</span>
          </div>
        )}
      </div>
    </Link>
  );
}
