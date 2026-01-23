import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product';
}

const BASE_TITLE = 'Raw Honey Guide';
const BASE_URL = 'https://rawhoneyguide.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  const fullTitle = title === BASE_TITLE ? title : `${title} | ${BASE_TITLE}`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    setMeta('description', description);

    // Open Graph tags
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:url', fullUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', BASE_TITLE, true);

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    return () => {
      // Cleanup is handled by next SEO component
    };
  }, [fullTitle, description, ogImage, fullUrl, type]);

  return null;
}
