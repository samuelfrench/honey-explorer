import { Link } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';
import type { Event } from '../../services/api';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const eventTypeColors: Record<string, string> = {
  FESTIVAL: 'bg-purple-100 text-purple-800',
  MARKET: 'bg-green-100 text-green-800',
  CLASS: 'bg-blue-100 text-blue-800',
  TASTING: 'bg-amber-100 text-amber-800',
  TOUR: 'bg-cyan-100 text-cyan-800',
  FAIR: 'bg-orange-100 text-orange-800',
};

const eventTypeIcons: Record<string, string> = {
  FESTIVAL: '🎉',
  MARKET: '🛒',
  CLASS: '📚',
  TASTING: '🍯',
  TOUR: '🚌',
  FAIR: '🎪',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = formatDate(startDate);
  if (!endDate) return start;
  const end = formatDate(endDate);
  return `${start} - ${end}`;
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const badgeClass = eventTypeColors[event.eventType] || 'bg-gray-100 text-gray-800';
  const icon = eventTypeIcons[event.eventType] || '📅';

  if (compact) {
    return (
      <Link
        to={`/events/${event.slug}`}
        className="group flex gap-3 p-3 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all"
      >
        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-honey-100">
          {event.thumbnailUrl ? (
            <img src={event.thumbnailUrl} alt={event.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">{icon}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-comb-900 group-hover:text-honey-600 transition-colors truncate">
            {event.name}
          </h4>
          <p className="text-xs text-comb-500 mt-0.5">
            {formatDateRange(event.startDate, event.endDate)}
          </p>
          <p className="text-xs text-comb-500 truncate">
            {event.city}, {event.state}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.thumbnailUrl ? (
          <img
            src={event.thumbnailUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-honey-100 to-honey-200 flex items-center justify-center">
            <span className="text-5xl">{icon}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            {event.eventTypeDisplay}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-comb-700">
          {formatDateRange(event.startDate, event.endDate)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-comb-900 group-hover:text-honey-600 transition-colors line-clamp-1">
          {event.name}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-sm text-comb-500">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{event.city}, {event.state}</span>
        </div>
        {event.description && (
          <p className="mt-2 text-sm text-comb-600 line-clamp-2">
            {event.description}
          </p>
        )}
        {event.link && (
          <div className="mt-3 flex items-center gap-1 text-xs text-honey-600">
            <ExternalLink className="w-3 h-3" />
            <span>Learn More</span>
          </div>
        )}
      </div>
    </Link>
  );
}
