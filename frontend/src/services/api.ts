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

export interface LocalSource {
  id: string;
  name: string;
  sourceType: string;
  sourceTypeDisplay: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  hoursJson: string | null;
  heroImageUrl: string | null;
  thumbnailUrl: string | null;
  instagramHandle: string | null;
  facebookUrl: string | null;
  isActive: boolean;
  slug: string;
  distance: number | null;
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

export interface LocalSourceBrowseParams {
  search?: string;
  sourceType?: string[];
  state?: string[];
  activeOnly?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  sourceType?: string[];
  page?: number;
  size?: number;
}

export interface Event {
  id: string;
  name: string;
  description: string | null;
  eventType: string;
  eventTypeDisplay: string;
  startDate: string;
  endDate: string | null;
  address: string;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  link: string | null;
  localSourceId: string | null;
  localSourceName: string | null;
  slug: string;
  isActive: boolean;
}

export interface EventBrowseParams {
  search?: string;
  eventType?: string[];
  state?: string[];
  fromDate?: string;
  toDate?: string;
  activeOnly?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export const eventApi = {
  getUpcoming: (limit = 6) =>
    api.get<Event[]>('/events/upcoming', { params: { limit } }),

  browse: (params: EventBrowseParams = {}) => {
    const queryParams: Record<string, string | string[] | number | boolean> = {};
    if (params.search) queryParams.search = params.search;
    if (params.eventType?.length) queryParams.eventType = params.eventType;
    if (params.state?.length) queryParams.state = params.state;
    if (params.fromDate) queryParams.fromDate = params.fromDate;
    if (params.toDate) queryParams.toDate = params.toDate;
    queryParams.activeOnly = params.activeOnly ?? true;
    queryParams.page = params.page ?? 0;
    queryParams.size = params.size ?? 24;
    queryParams.sort = params.sort ?? 'startDate';
    return api.get<Page<Event>>('/events', { params: queryParams, paramsSerializer: { indexes: null } });
  },

  getCalendar: (year: number, month: number) =>
    api.get<Event[]>('/events/calendar', { params: { year, month } }),

  getById: (id: string) =>
    api.get<Event>(`/events/${id}`),

  getBySlug: (slug: string) =>
    api.get<Event>(`/events/slug/${slug}`),

  getCount: () =>
    api.get<number>('/events/count'),
};

export const localSourceApi = {
  browse: (params: LocalSourceBrowseParams = {}) => {
    const queryParams: Record<string, string | string[] | number | boolean> = {};
    if (params.search) queryParams.search = params.search;
    if (params.sourceType?.length) queryParams.sourceType = params.sourceType;
    if (params.state?.length) queryParams.state = params.state;
    queryParams.activeOnly = params.activeOnly ?? true;
    queryParams.page = params.page ?? 0;
    queryParams.size = params.size ?? 24;
    queryParams.sort = params.sort ?? 'name';
    return api.get<Page<LocalSource>>('/local-sources', { params: queryParams, paramsSerializer: { indexes: null } });
  },

  getAllForMap: (sourceType?: string[]) => {
    const queryParams: Record<string, string | string[] | boolean> = { activeOnly: true };
    if (sourceType?.length) queryParams.sourceType = sourceType;
    return api.get<LocalSource[]>('/local-sources/map', { params: queryParams, paramsSerializer: { indexes: null } });
  },

  findNearby: (params: NearbyParams) => {
    const queryParams: Record<string, string | string[] | number> = {
      lat: params.lat,
      lng: params.lng,
      radius: params.radius ?? 50,
      page: params.page ?? 0,
      size: params.size ?? 24,
    };
    if (params.sourceType?.length) queryParams.sourceType = params.sourceType;
    return api.get<Page<LocalSource>>('/local-sources/nearby', { params: queryParams, paramsSerializer: { indexes: null } });
  },

  getById: (id: string) =>
    api.get<LocalSource>(`/local-sources/${id}`),

  getBySlug: (slug: string) =>
    api.get<LocalSource>(`/local-sources/slug/${slug}`),

  getCount: () =>
    api.get<number>('/local-sources/count'),
};

export default api;
