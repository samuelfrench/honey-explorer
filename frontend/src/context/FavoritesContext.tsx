import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
}

const STORAGE_KEY = 'honey-favorites';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (slug: string) => {
    setFavorites(prev => {
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
  };

  const removeFavorite = (slug: string) => {
    setFavorites(prev => prev.filter(s => s !== slug));
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  const toggleFavorite = (slug: string) => {
    if (isFavorite(slug)) {
      removeFavorite(slug);
    } else {
      addFavorite(slug);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
