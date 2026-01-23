import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Component to inject JSON-LD structured data into the page.
 * Used for SEO schema markup (Product, LocalBusiness, Event, etc.)
 */
export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    const schemaType = (data['@type'] as string) || 'schema';
    script.id = 'json-ld-' + schemaType;

    // Remove any existing JSON-LD with same type
    const existingScript = document.getElementById(script.id);
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}

// Helper functions to create schema objects

export interface ProductSchemaProps {
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  url: string;
}

export function createProductSchema({
  name,
  description,
  image,
  brand,
  priceMin,
  priceMax,
  url,
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    url: `https://rawhoneyguide.com${url}`,
  };

  if (description) schema.description = description;
  if (image) schema.image = image;
  if (brand) {
    schema.brand = {
      '@type': 'Brand',
      name: brand,
    };
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    schema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      ...(priceMin !== undefined && { lowPrice: priceMin.toFixed(2) }),
      ...(priceMax !== undefined && { highPrice: priceMax.toFixed(2) }),
    };
  }

  return schema;
}

export interface LocalBusinessSchemaProps {
  name: string;
  description?: string;
  image?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  url: string;
}

export function createLocalBusinessSchema({
  name,
  description,
  image,
  address,
  city,
  state,
  zipCode,
  phone,
  email,
  website,
  latitude,
  longitude,
  url,
}: LocalBusinessSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url: `https://rawhoneyguide.com${url}`,
  };

  if (description) schema.description = description;
  if (image) schema.image = image;
  if (phone) schema.telephone = phone;
  if (email) schema.email = email;
  if (website) schema.sameAs = website;

  if (address || city || state || zipCode) {
    schema.address = {
      '@type': 'PostalAddress',
      ...(address && { streetAddress: address }),
      ...(city && { addressLocality: city }),
      ...(state && { addressRegion: state }),
      ...(zipCode && { postalCode: zipCode }),
      addressCountry: 'US',
    };
  }

  if (latitude !== undefined && longitude !== undefined) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    };
  }

  return schema;
}

export interface EventSchemaProps {
  name: string;
  description?: string;
  image?: string;
  startDate: string;
  endDate?: string | null;
  address?: string;
  city?: string;
  state?: string;
  url: string;
  eventUrl?: string;
  organizer?: string;
}

export function createEventSchema({
  name,
  description,
  image,
  startDate,
  endDate,
  address,
  city,
  state,
  url,
  eventUrl,
  organizer,
}: EventSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    url: `https://rawhoneyguide.com${url}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };

  if (description) schema.description = description;
  if (image) schema.image = image;
  if (endDate) schema.endDate = endDate;

  if (address || city || state) {
    schema.location = {
      '@type': 'Place',
      name: city ? `${city}, ${state}` : 'Event Venue',
      address: {
        '@type': 'PostalAddress',
        ...(address && { streetAddress: address }),
        ...(city && { addressLocality: city }),
        ...(state && { addressRegion: state }),
        addressCountry: 'US',
      },
    };
  }

  if (eventUrl) {
    schema.url = eventUrl;
  }

  if (organizer) {
    schema.organizer = {
      '@type': 'Organization',
      name: organizer,
    };
  }

  return schema;
}

export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Raw Honey Guide',
    url: 'https://rawhoneyguide.com',
    description: 'Discover over 200 varieties of honey from around the world. Find local sources, compare flavors, and explore the fascinating world of honey.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://rawhoneyguide.com/browse?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Raw Honey Guide',
    url: 'https://rawhoneyguide.com',
    logo: 'https://rawhoneyguide.com/og-image.png',
    description: 'Your guide to discovering and buying quality raw honey from around the world.',
  };
}
