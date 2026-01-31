import { Link } from 'react-router-dom';
import { X, Scale } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { Button } from '../ui';

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-comb-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Selected honeys */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-1 text-sm text-comb-600 flex-shrink-0">
              <Scale className="w-4 h-4" />
              <span>Compare ({compareList.length}/3):</span>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {compareList.map(honey => (
                <div
                  key={honey.id}
                  className="flex items-center gap-2 bg-honey-50 border border-honey-200 rounded-lg px-2 py-1 flex-shrink-0"
                >
                  <img
                    src={honey.thumbnailUrl || honey.imageUrl}
                    alt={honey.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-sm text-comb-800 max-w-[120px] truncate">
                    {honey.name}
                  </span>
                  <button
                    onClick={() => removeFromCompare(honey.id)}
                    className="p-0.5 text-comb-400 hover:text-comb-600 hover:bg-honey-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearCompare}
              className="text-sm text-comb-500 hover:text-comb-700"
            >
              Clear
            </button>
            <Link to="/compare">
              <Button variant="primary" size="sm" disabled={compareList.length < 2}>
                Compare Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
