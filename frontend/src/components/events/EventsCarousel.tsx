import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { EventCard } from './EventCard';
import { eventApi, type Event } from '../../services/api';
import { Spinner } from '../ui';

export function EventsCarousel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getUpcoming(6);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (events.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length, isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  // Get visible events (3 on desktop, 1 on mobile)
  const getVisibleEvents = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(events[(currentIndex + i) % events.length]);
    }
    return result;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-comb-900">
          Upcoming Events
        </h2>
        <Link
          to="/events"
          className="flex items-center gap-1 text-honey-600 hover:text-honey-700 font-medium transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative" ref={containerRef}>
        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center text-comb-600 hover:text-honey-600 hover:shadow-card-hover transition-all hidden md:flex"
          aria-label="Previous events"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center text-comb-600 hover:text-honey-600 hover:shadow-card-hover transition-all hidden md:flex"
          aria-label="Next events"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getVisibleEvents().map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className={`transition-opacity duration-300 ${index > 0 ? 'hidden md:block' : ''}`}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* Mobile scroll */}
        <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {events.map((event) => (
            <div key={event.id} className="flex-shrink-0 w-[85%] snap-center">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-honey-500 w-6' : 'bg-comb-300 hover:bg-comb-400'
            }`}
            aria-label={`Go to event ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
