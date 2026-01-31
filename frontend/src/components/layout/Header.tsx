import { Link } from 'react-router-dom';
import { Droplet, Search, MapPin, Calendar, Heart, BookOpen } from 'lucide-react';
import { Container } from './Container';
import { useFavorites } from '../../context/FavoritesContext';

export function Header() {
  const { favorites } = useFavorites();

  return (
    <header className="bg-white shadow-honey-sm sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Droplet className="w-8 h-8 text-honey-500 fill-honey-200" />
            <span className="font-display text-xl font-bold text-honey-800">
              Raw Honey Guide
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/browse"
              className="text-comb-600 hover:text-honey-600 transition-colors font-medium"
            >
              Browse Honey
            </Link>
            <Link
              to="/local"
              className="text-comb-600 hover:text-honey-600 transition-colors font-medium flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" />
              Find Local
            </Link>
            <Link
              to="/events"
              className="text-comb-600 hover:text-honey-600 transition-colors font-medium flex items-center gap-1"
            >
              <Calendar className="w-4 h-4" />
              Events
            </Link>
            <Link
              to="/learn"
              className="text-comb-600 hover:text-honey-600 transition-colors font-medium flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              Learn
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 text-comb-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>
            {/* Search (links to browse) */}
            <Link
              to="/browse"
              className="p-2 text-comb-500 hover:text-honey-600 transition-colors rounded-full hover:bg-honey-50"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
