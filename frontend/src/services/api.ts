import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Types
export interface Honey {
  id: string;
  name: string;
  description: string;
  floralSource: string;
  floralSourceDisplay: string;
  type: string;
  typeDisplay: string;
  origin: string;
  originDisplay: string;
  region: string | null;
  flavorProfiles: string;
  imageUrl: string;
  thumbnailUrl: string;
  brand: string | null;
  priceMin: number | null;
  priceMax: number | null;
  certifications: string | null;
  umfRating: number | null;
  mgoRating: number | null;
  slug: string;
  featured: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface FilterOptions {
  floralSources: EnumOption[];
  origins: EnumOption[];
  types: EnumOption[];
  flavorProfiles: EnumOption[];
  sourceTypes: EnumOption[];
  certifications: EnumOption[];
}

export interface EnumOption {
  value: string;
  displayName: string;
  count: number;
}

export interface BrowseParams {
  search?: string;
  origin?: string[];
  floralSource?: string[];
  type?: string[];
  page?: number;
  size?: number;
  sort?: string;
}

// API methods
export const honeyApi = {
  browse: (params: BrowseParams = {}) => {
    const queryParams: Record<string, string | string[] | number> = {};
    if (params.search) queryParams.search = params.search;
    if (params.origin?.length) queryParams.origin = params.origin;
    if (params.floralSource?.length) queryParams.floralSource = params.floralSource;
    if (params.type?.length) queryParams.type = params.type;
    queryParams.page = params.page ?? 0;
    queryParams.size = params.size ?? 24;
    queryParams.sort = params.sort ?? 'name';
    return api.get<Page<Honey>>('/honeys', { params: queryParams, paramsSerializer: { indexes: null } });
  },

  getAll: (page = 0, size = 24, sort = 'name') =>
    api.get<Page<Honey>>('/honeys', { params: { page, size, sort } }),

  getFeatured: () =>
    api.get<Honey[]>('/honeys/featured'),

  getBySlug: (slug: string) =>
    api.get<Honey>(`/honeys/${slug}`),

  getCount: () =>
    api.get<number>('/honeys/count'),
};

export const filterApi = {
  getOptions: () =>
    api.get<FilterOptions>('/filters/options'),
};

export default api;
