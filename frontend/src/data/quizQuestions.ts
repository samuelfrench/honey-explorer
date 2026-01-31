export interface QuizOption {
  label: string;
  value: string;
  floralSources?: string[];
  flavorProfiles?: string[];
  types?: string[];
  priceRange?: { min?: number; max?: number };
  origins?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'flavor',
    question: 'What flavor profile do you prefer?',
    description: 'Choose the taste that appeals to you most',
    options: [
      {
        label: 'Light & Delicate',
        value: 'light',
        flavorProfiles: ['MILD', 'SWEET', 'FLORAL', 'LIGHT', 'DELICATE'],
        floralSources: ['CLOVER', 'ACACIA', 'ORANGE_BLOSSOM'],
      },
      {
        label: 'Bold & Rich',
        value: 'bold',
        flavorProfiles: ['BOLD', 'EARTHY', 'COMPLEX', 'DARK', 'RICH'],
        floralSources: ['BUCKWHEAT', 'CHESTNUT', 'HEATHER'],
      },
      {
        label: 'Fruity & Fresh',
        value: 'fruity',
        flavorProfiles: ['FRUITY', 'SWEET', 'FLORAL'],
        floralSources: ['ORANGE_BLOSSOM', 'BLUEBERRY', 'WILDFLOWER'],
      },
      {
        label: 'Herbal & Earthy',
        value: 'herbal',
        flavorProfiles: ['HERBACEOUS', 'EARTHY', 'SPICY'],
        floralSources: ['SAGE', 'EUCALYPTUS', 'LAVENDER'],
      },
    ],
  },
  {
    id: 'use',
    question: 'How will you mainly use this honey?',
    description: 'Different honeys excel in different applications',
    options: [
      {
        label: 'Tea & Beverages',
        value: 'tea',
        floralSources: ['CLOVER', 'ACACIA', 'WILDFLOWER', 'ORANGE_BLOSSOM'],
        flavorProfiles: ['MILD', 'SWEET', 'LIGHT'],
      },
      {
        label: 'Baking & Cooking',
        value: 'baking',
        floralSources: ['BUCKWHEAT', 'WILDFLOWER', 'CLOVER'],
        flavorProfiles: ['BOLD', 'EARTHY', 'RICH'],
      },
      {
        label: 'Cheese & Charcuterie',
        value: 'cheese',
        floralSources: ['CHESTNUT', 'HEATHER', 'BUCKWHEAT'],
        flavorProfiles: ['BOLD', 'COMPLEX', 'DARK'],
      },
      {
        label: 'Health & Wellness',
        value: 'health',
        floralSources: ['MANUKA', 'BUCKWHEAT', 'EUCALYPTUS'],
        types: ['RAW'],
        flavorProfiles: ['BOLD', 'INTENSE'],
      },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget?",
    description: 'Premium honeys often have unique properties',
    options: [
      {
        label: 'Budget-Friendly',
        value: 'budget',
        priceRange: { max: 15 },
      },
      {
        label: 'Mid-Range',
        value: 'mid',
        priceRange: { min: 12, max: 25 },
      },
      {
        label: 'Premium',
        value: 'premium',
        priceRange: { min: 20, max: 40 },
      },
      {
        label: 'Luxury / No Limit',
        value: 'luxury',
        priceRange: { min: 30 },
      },
    ],
  },
  {
    id: 'origin',
    question: 'Any origin preference?',
    description: 'Some regions are known for specific honey types',
    options: [
      {
        label: 'Local USA',
        value: 'usa',
        origins: ['USA'],
      },
      {
        label: 'New Zealand',
        value: 'nz',
        origins: ['NEW_ZEALAND'],
        floralSources: ['MANUKA'],
      },
      {
        label: 'European',
        value: 'europe',
        origins: ['FRANCE', 'ITALY', 'SPAIN', 'GREECE', 'GERMANY', 'UK'],
      },
      {
        label: 'No Preference',
        value: 'any',
      },
    ],
  },
];

export interface QuizAnswers {
  [questionId: string]: QuizOption;
}

export function buildFiltersFromAnswers(answers: QuizAnswers) {
  const floralSources = new Set<string>();
  const flavorProfiles = new Set<string>();
  const types = new Set<string>();
  const origins = new Set<string>();
  let priceMin: number | undefined;
  let priceMax: number | undefined;

  Object.values(answers).forEach(answer => {
    answer.floralSources?.forEach(s => floralSources.add(s));
    answer.flavorProfiles?.forEach(f => flavorProfiles.add(f));
    answer.types?.forEach(t => types.add(t));
    answer.origins?.forEach(o => origins.add(o));

    if (answer.priceRange) {
      if (answer.priceRange.min !== undefined) {
        priceMin = priceMin ? Math.max(priceMin, answer.priceRange.min) : answer.priceRange.min;
      }
      if (answer.priceRange.max !== undefined) {
        priceMax = priceMax ? Math.min(priceMax, answer.priceRange.max) : answer.priceRange.max;
      }
    }
  });

  return {
    floralSources: floralSources.size > 0 ? Array.from(floralSources) : undefined,
    flavorProfiles: flavorProfiles.size > 0 ? Array.from(flavorProfiles) : undefined,
    types: types.size > 0 ? Array.from(types) : undefined,
    origins: origins.size > 0 ? Array.from(origins) : undefined,
    priceMin,
    priceMax,
  };
}
