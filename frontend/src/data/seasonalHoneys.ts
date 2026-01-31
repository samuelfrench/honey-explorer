export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export const seasonalHoneys: Record<Season, string[]> = {
  spring: [
    'pure-clover-honey-usa',
    'orange-blossom-honey-california',
    'organic-white-clover-honey',
    'acacia-honey-italy',
  ],
  summer: [
    'lavender-honey-provence',
    'wildflower-honey-pacific-northwest',
    'tupelo-honey-florida',
    'sage-honey-california',
  ],
  fall: [
    'buckwheat-honey-new-york',
    'eucalyptus-honey-australia',
    'heather-honey-scotland',
    'chestnut-honey-spain',
  ],
  winter: [
    'manuka-honey-umf-15-new-zealand',
    'manuka-honey-umf-10-new-zealand',
    'raw-wildflower-honey-texas',
    'sourwood-honey-appalachian',
  ],
};

export function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';  // Mar-May
  if (month >= 5 && month <= 7) return 'summer';  // Jun-Aug
  if (month >= 8 && month <= 10) return 'fall';   // Sep-Nov
  return 'winter';  // Dec-Feb
}

export const seasonDisplayNames: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Autumn',
  winter: 'Winter',
};

export const seasonDescriptions: Record<Season, string> = {
  spring: 'Light, floral honeys perfect for the season of renewal',
  summer: 'Bright, aromatic honeys to complement warm weather',
  fall: 'Rich, robust honeys ideal for cozy autumn days',
  winter: 'Bold, therapeutic honeys for cold weather wellness',
};
