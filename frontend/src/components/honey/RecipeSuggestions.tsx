import { ChefHat } from 'lucide-react';
import { RecipeCard } from './RecipeCard';
import { getRecipesForHoney } from '../../data/recipes';

interface RecipeSuggestionsProps {
  floralSource: string;
  flavorProfiles: string;
}

export function RecipeSuggestions({ floralSource, flavorProfiles }: RecipeSuggestionsProps) {
  const recipes = getRecipesForHoney(floralSource, flavorProfiles);

  if (recipes.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-comb-100">
      <div className="flex items-center gap-2 mb-6">
        <ChefHat className="w-6 h-6 text-honey-600" />
        <h2 className="font-display text-2xl font-semibold text-comb-900">
          Recipe Ideas & Pairings
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
