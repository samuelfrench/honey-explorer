export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: 'beverage' | 'food' | 'pairing' | 'remedy';
  floralSources: string[];
  flavorProfiles: string[];
}

export const recipes: Recipe[] = [
  // Beverages
  {
    id: 'honey-lemon-tea',
    title: 'Classic Honey Lemon Tea',
    description: 'A soothing warm beverage perfect for relaxation or cold relief. Add a tablespoon of honey and fresh lemon juice to hot water.',
    category: 'beverage',
    floralSources: ['CLOVER', 'ACACIA', 'WILDFLOWER', 'MANUKA', 'ORANGE_BLOSSOM'],
    flavorProfiles: ['MILD', 'SWEET', 'FLORAL', 'LIGHT'],
  },
  {
    id: 'honey-ginger-tea',
    title: 'Honey Ginger Wellness Tea',
    description: 'Immune-boosting tea with fresh ginger and honey. Perfect for cold days or when feeling under the weather.',
    category: 'beverage',
    floralSources: ['MANUKA', 'BUCKWHEAT', 'EUCALYPTUS'],
    flavorProfiles: ['BOLD', 'EARTHY', 'SPICY'],
  },
  {
    id: 'honey-lavender-latte',
    title: 'Lavender Honey Latte',
    description: 'A calming café-style latte with lavender honey and steamed milk. Drizzle honey over the foam.',
    category: 'beverage',
    floralSources: ['LAVENDER', 'ACACIA', 'CLOVER'],
    flavorProfiles: ['FLORAL', 'SWEET', 'DELICATE'],
  },
  {
    id: 'honey-smoothie',
    title: 'Honey Fruit Smoothie',
    description: 'Blend with banana, berries, yogurt, and a spoonful of honey for natural sweetness and energy.',
    category: 'beverage',
    floralSources: ['WILDFLOWER', 'BLUEBERRY', 'CLOVER'],
    flavorProfiles: ['FRUITY', 'SWEET', 'MILD'],
  },
  // Food
  {
    id: 'honey-glazed-salmon',
    title: 'Honey Glazed Salmon',
    description: 'Brush salmon with honey, soy sauce, and garlic. Bake until caramelized for a sweet-savory main dish.',
    category: 'food',
    floralSources: ['ORANGE_BLOSSOM', 'ACACIA', 'WILDFLOWER'],
    flavorProfiles: ['SWEET', 'FRUITY', 'MILD'],
  },
  {
    id: 'honey-granola',
    title: 'Homemade Honey Granola',
    description: 'Mix oats, nuts, and seeds with honey and bake until golden. Perfect for breakfast or snacking.',
    category: 'food',
    floralSources: ['CLOVER', 'WILDFLOWER', 'BUCKWHEAT'],
    flavorProfiles: ['SWEET', 'MILD', 'EARTHY'],
  },
  {
    id: 'honey-butter-toast',
    title: 'Whipped Honey Butter',
    description: 'Blend softened butter with honey for a spreadable treat. Perfect on warm toast, biscuits, or cornbread.',
    category: 'food',
    floralSources: ['CLOVER', 'ORANGE_BLOSSOM', 'ACACIA'],
    flavorProfiles: ['SWEET', 'CREAMY', 'MILD'],
  },
  {
    id: 'honey-vinaigrette',
    title: 'Honey Mustard Vinaigrette',
    description: 'Whisk honey with Dijon mustard, olive oil, and vinegar. A versatile dressing for any salad.',
    category: 'food',
    floralSources: ['WILDFLOWER', 'CLOVER', 'SAGE'],
    flavorProfiles: ['SWEET', 'HERBACEOUS', 'MILD'],
  },
  {
    id: 'baklava',
    title: 'Classic Baklava',
    description: 'Layer phyllo dough with nuts and drench in honey syrup. A traditional Mediterranean dessert.',
    category: 'food',
    floralSources: ['ORANGE_BLOSSOM', 'WILDFLOWER', 'ACACIA'],
    flavorProfiles: ['SWEET', 'FLORAL', 'RICH'],
  },
  // Pairings
  {
    id: 'cheese-pairing',
    title: 'Artisan Cheese Board',
    description: 'Drizzle over aged cheeses like manchego, gorgonzola, or brie. The honey complements the savory richness.',
    category: 'pairing',
    floralSources: ['BUCKWHEAT', 'CHESTNUT', 'HEATHER', 'WILDFLOWER'],
    flavorProfiles: ['BOLD', 'EARTHY', 'COMPLEX', 'DARK'],
  },
  {
    id: 'yogurt-pairing',
    title: 'Greek Yogurt Parfait',
    description: 'Top Greek yogurt with honey, fresh fruit, and granola for a healthy breakfast or snack.',
    category: 'pairing',
    floralSources: ['CLOVER', 'ORANGE_BLOSSOM', 'ACACIA', 'LAVENDER'],
    flavorProfiles: ['SWEET', 'MILD', 'FRUITY', 'FLORAL'],
  },
  {
    id: 'charcuterie',
    title: 'Charcuterie Complement',
    description: 'Pair with prosciutto, salami, and crusty bread. The sweetness balances cured meats perfectly.',
    category: 'pairing',
    floralSources: ['CHESTNUT', 'BUCKWHEAT', 'HEATHER'],
    flavorProfiles: ['BOLD', 'DARK', 'COMPLEX', 'MALTY'],
  },
  {
    id: 'pancake-topping',
    title: 'Pancake & Waffle Drizzle',
    description: 'A natural alternative to maple syrup. Warm slightly before drizzling for best results.',
    category: 'pairing',
    floralSources: ['CLOVER', 'WILDFLOWER', 'BUCKWHEAT'],
    flavorProfiles: ['SWEET', 'MILD', 'EARTHY'],
  },
  // Remedies
  {
    id: 'sore-throat-remedy',
    title: 'Sore Throat Soother',
    description: 'Mix honey with warm water, lemon, and a pinch of cayenne. Sip slowly to coat and soothe the throat.',
    category: 'remedy',
    floralSources: ['MANUKA', 'BUCKWHEAT', 'EUCALYPTUS'],
    flavorProfiles: ['BOLD', 'EARTHY', 'INTENSE'],
  },
  {
    id: 'sleep-aid',
    title: 'Bedtime Milk & Honey',
    description: 'Warm milk with a spoonful of honey before bed. A time-honored remedy for restful sleep.',
    category: 'remedy',
    floralSources: ['LAVENDER', 'ACACIA', 'CLOVER'],
    flavorProfiles: ['MILD', 'SWEET', 'FLORAL', 'LIGHT'],
  },
  {
    id: 'face-mask',
    title: 'Honey Face Mask',
    description: 'Apply raw honey directly to face for 15-20 minutes. Natural antibacterial and moisturizing treatment.',
    category: 'remedy',
    floralSources: ['MANUKA', 'WILDFLOWER', 'CLOVER'],
    flavorProfiles: ['MILD', 'PURE', 'CLEAN'],
  },
];

export function getRecipesForHoney(floralSource: string, flavorProfiles: string): Recipe[] {
  const profiles = flavorProfiles ? flavorProfiles.split(',').map(p => p.trim().toUpperCase()) : [];

  // Score each recipe based on matching criteria
  const scoredRecipes = recipes.map(recipe => {
    let score = 0;

    // Floral source match is highly weighted
    if (recipe.floralSources.includes(floralSource)) {
      score += 3;
    }

    // Flavor profile matches
    const matchingProfiles = recipe.flavorProfiles.filter(fp =>
      profiles.includes(fp)
    );
    score += matchingProfiles.length;

    return { recipe, score };
  });

  // Filter recipes with at least some match, sort by score, take top 4
  return scoredRecipes
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(r => r.recipe);
}
