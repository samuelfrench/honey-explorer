import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Badge, Button, Spinner } from '../components/ui';
import { SimilarHoneys, RecipeSuggestions } from '../components/honey';
import { SEO, JsonLd, createProductSchema } from '../components/seo';
import { honeyApi, type Honey } from '../services/api';

export function HoneyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [honey, setHoney] = useState<Honey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoney = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const response = await honeyApi.getBySlug(slug);
        setHoney(response.data);
        setError(null);
      } catch (err) {
        setError('Honey not found');
        console.error('Error fetching honey:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHoney();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !honey) {
    return (
      <div className="min-h-screen bg-cream">
        <Section padding="lg">
          <Container size="sm">
            <div className="text-center py-12">
              <h1 className="font-display text-2xl font-bold text-comb-900 mb-4">
                {error || 'Honey not found'}
              </h1>
              <Link to="/browse">
                <Button variant="primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Browse
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  const flavorProfiles = honey.flavorProfiles
    ? honey.flavorProfiles.split(',').map(f => f.trim())
    : [];

  return (
    <>
      <SEO
        title={honey.name}
        description={honey.description || `Discover ${honey.name} - ${honey.floralSourceDisplay} honey from ${honey.originDisplay}. Learn about its unique flavor profile, origins, and more.`}
        image={honey.imageUrl}
        url={`/honey/${honey.slug}`}
        type="product"
      />
      <JsonLd
        data={createProductSchema({
          name: honey.name,
          description: honey.description || undefined,
          image: honey.imageUrl || undefined,
          brand: honey.brand || undefined,
          priceMin: honey.priceMin ?? undefined,
          priceMax: honey.priceMax ?? undefined,
          url: `/honey/${honey.slug}`,
        })}
      />
      <div className="min-h-screen bg-cream">
        <Section padding="md">
          <Container>
            {/* Back link */}
          <Link
            to="/browse"
            className="inline-flex items-center text-comb-600 hover:text-honey-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-honey">
              <img
                src={honey.imageUrl}
                alt={honey.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-comb-900 mb-4">
                {honey.name}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="honey" size="md">
                  {honey.floralSourceDisplay}
                </Badge>
                <Badge variant="info" size="md">
                  {honey.originDisplay}
                </Badge>
                {honey.region && (
                  <Badge variant="neutral" size="md">
                    {honey.region}
                  </Badge>
                )}
              </div>

              {honey.description && (
                <p className="text-comb-700 text-lg leading-relaxed mb-6">
                  {honey.description}
                </p>
              )}

              {/* Flavor Profiles */}
              {flavorProfiles.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-comb-800 mb-2">Flavor Profile</h3>
                  <div className="flex flex-wrap gap-2">
                    {flavorProfiles.map((flavor) => (
                      <Badge key={flavor} variant="neutral" size="sm">
                        {flavor.charAt(0) + flavor.slice(1).toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              {(honey.priceMin || honey.priceMax) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-comb-800 mb-2">Price Range</h3>
                  <p className="text-2xl font-bold text-honey-700">
                    ${honey.priceMin?.toFixed(2)}
                    {honey.priceMax && honey.priceMax !== honey.priceMin && ` - $${honey.priceMax.toFixed(2)}`}
                  </p>
                </div>
              )}

              {/* Certifications */}
              {honey.certifications && (
                <div className="mb-6">
                  <h3 className="font-semibold text-comb-800 mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {honey.certifications.split(',').map((cert) => (
                      <Badge key={cert} variant="success" size="sm">
                        {cert.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Manuka Ratings */}
              {(honey.umfRating || honey.mgoRating) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-comb-800 mb-2">Manuka Ratings</h3>
                  <div className="flex gap-4">
                    {honey.umfRating && (
                      <div className="bg-honey-100 px-4 py-2 rounded-lg">
                        <p className="text-sm text-honey-700">UMF</p>
                        <p className="text-xl font-bold text-honey-800">{honey.umfRating}+</p>
                      </div>
                    )}
                    {honey.mgoRating && (
                      <div className="bg-honey-100 px-4 py-2 rounded-lg">
                        <p className="text-sm text-honey-700">MGO</p>
                        <p className="text-xl font-bold text-honey-800">{honey.mgoRating}+</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Brand */}
              {honey.brand && (
                <div className="mb-6">
                  <h3 className="font-semibold text-comb-800 mb-2">Brand</h3>
                  <p className="text-comb-700">{honey.brand}</p>
                </div>
              )}

              {/* Type */}
              <div className="mb-6">
                <h3 className="font-semibold text-comb-800 mb-2">Type</h3>
                <p className="text-comb-700">{honey.typeDisplay}</p>
              </div>

              {/* Purchase CTA */}
              {honey.purchaseUrl && (
                <a
                  href={honey.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Buy This Honey
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Recipe Suggestions */}
          <RecipeSuggestions
            floralSource={honey.floralSource}
            flavorProfiles={honey.flavorProfiles}
          />

          {/* Similar Honeys */}
          <SimilarHoneys slug={honey.slug} />
        </Container>
      </Section>
    </div>
    </>
  );
}
