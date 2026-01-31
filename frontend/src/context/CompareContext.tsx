import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Honey } from '../services/api';

interface CompareContextType {
  compareList: Honey[];
  addToCompare: (honey: Honey) => boolean;
  removeFromCompare: (honeyId: string) => void;
  clearCompare: () => void;
  isInCompare: (honeyId: string) => boolean;
  canAddMore: boolean;
}

const MAX_COMPARE = 3;
const STORAGE_KEY = 'honey-compare-list';

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Honey[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (honey: Honey): boolean => {
    if (compareList.length >= MAX_COMPARE) return false;
    if (compareList.some(h => h.id === honey.id)) return false;

    setCompareList(prev => [...prev, honey]);
    return true;
  };

  const removeFromCompare = (honeyId: string) => {
    setCompareList(prev => prev.filter(h => h.id !== honeyId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (honeyId: string) => {
    return compareList.some(h => h.id === honeyId);
  };

  const canAddMore = compareList.length < MAX_COMPARE;

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      canAddMore,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
