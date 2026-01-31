import { Coffee, UtensilsCrossed, Wine, Heart } from 'lucide-react';
import type { Recipe } from '../../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
}

const categoryIcons = {
  beverage: Coffee,
  food: UtensilsCrossed,
  pairing: Wine,
  remedy: Heart,
};

const categoryColors = {
  beverage: 'bg-blue-100 text-blue-700',
  food: 'bg-orange-100 text-orange-700',
  pairing: 'bg-purple-100 text-purple-700',
  remedy: 'bg-green-100 text-green-700',
};

const categoryLabels = {
  beverage: 'Beverage',
  food: 'Recipe',
  pairing: 'Pairing',
  remedy: 'Wellness',
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const Icon = categoryIcons[recipe.category];

  return (
    <div className="bg-white rounded-xl p-4 shadow-honey-sm hover:shadow-honey transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${categoryColors[recipe.category]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-comb-900 text-sm">
              {recipe.title}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[recipe.category]}`}>
              {categoryLabels[recipe.category]}
            </span>
          </div>
          <p className="text-sm text-comb-600 line-clamp-2">
            {recipe.description}
          </p>
        </div>
      </div>
    </div>
  );
}
