import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { LocalSource } from '../../services/api';

interface SourceMarkerProps {
  source: LocalSource;
}

// Custom marker icons for each source type
const markerIcons: Record<string, string> = {
  BEEKEEPER: '🐝',
  FARM: '🏡',
  FARMERS_MARKET: '🛒',
  STORE: '🏪',
  APIARY: '🍯',
  COOPERATIVE: '🤝',
};

const markerColors: Record<string, string> = {
  BEEKEEPER: '#f59e0b',
  FARM: '#22c55e',
  FARMERS_MARKET: '#f97316',
  STORE: '#3b82f6',
  APIARY: '#eab308',
  COOPERATIVE: '#a855f7',
};

function createCustomIcon(sourceType: string): DivIcon {
  const emoji = markerIcons[sourceType] || '📍';
  const color = markerColors[sourceType] || '#f59e0b';

  return new DivIcon({
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

export function SourceMarker({ source }: SourceMarkerProps) {
  const icon = createCustomIcon(source.sourceType);

  return (
    <Marker
      position={[source.latitude, source.longitude]}
      icon={icon}
    >
      <Popup className="source-popup" maxWidth={280}>
        <div className="p-1">
          {source.thumbnailUrl && (
            <img
              src={source.thumbnailUrl}
              alt={source.name}
              className="w-full h-24 object-cover rounded-lg mb-2"
            />
          )}
          <h3 className="font-semibold text-comb-900 text-sm">{source.name}</h3>
          <p className="text-xs text-comb-500 mt-0.5">{source.sourceTypeDisplay}</p>
          <p className="text-xs text-comb-600 mt-1">
            {source.city}, {source.state}
          </p>
          <div className="flex gap-2 mt-2">
            <Link
              to={`/local/${source.slug}`}
              className="flex-1 text-center text-xs bg-honey-500 text-white py-1.5 px-2 rounded-lg hover:bg-honey-600 transition-colors"
            >
              View Details
            </Link>
            {source.website && (
              <a
                href={source.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-xs bg-comb-100 text-comb-700 py-1.5 px-2 rounded-lg hover:bg-comb-200 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
