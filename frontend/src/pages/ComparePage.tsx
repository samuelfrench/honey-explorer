import { Link } from 'react-router-dom';
import { ArrowLeft, X, Scale } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Button, Badge } from '../components/ui';
import { SEO } from '../components/seo';
import { useCompare } from '../context/CompareContext';

export function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <>
        <SEO title="Compare Honeys" description="Compare different honey varieties side by side." url="/compare" />
        <div className="min-h-screen bg-cream">
          <Section padding="lg">
            <Container size="sm">
              <div className="text-center py-12">
                <Scale className="w-16 h-16 text-comb-300 mx-auto mb-4" />
                <h1 className="font-display text-2xl font-bold text-comb-900 mb-4">
                  No honeys to compare
                </h1>
                <p className="text-comb-600 mb-6">
                  Add honeys to your comparison list by clicking the compare icon on any honey card.
                </p>
                <Link to="/browse">
                  <Button variant="primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Browse Honeys
                  </Button>
                </Link>
              </div>
            </Container>
          </Section>
        </div>
      </>
    );
  }

  const rows = [
    { label: 'Floral Source', key: 'floralSourceDisplay' },
    { label: 'Origin', key: 'originDisplay' },
    { label: 'Region', key: 'region' },
    { label: 'Type', key: 'typeDisplay' },
    { label: 'Flavor Profile', key: 'flavorProfiles' },
    { label: 'Price Range', key: 'price' },
    { label: 'Brand', key: 'brand' },
    { label: 'Certifications', key: 'certifications' },
  ];

  const getValue = (honey: typeof compareList[0], key: string) => {
    if (key === 'price') {
      if (honey.priceMin || honey.priceMax) {
        return `$${honey.priceMin?.toFixed(2) || '?'} - $${honey.priceMax?.toFixed(2) || '?'}`;
      }
      return '-';
    }
    if (key === 'flavorProfiles' && honey.flavorProfiles) {
      return honey.flavorProfiles.split(',').map(f =>
        f.charAt(0) + f.slice(1).toLowerCase()
      ).join(', ');
    }
    if (key === 'certifications' && honey.certifications) {
      return honey.certifications.split(',').map(c => c.trim()).join(', ');
    }
    const value = honey[key as keyof typeof honey];
    return value || '-';
  };

  return (
    <>
      <SEO
        title={`Compare: ${compareList.map(h => h.name).join(' vs ')}`}
        description="Compare different honey varieties side by side - flavor profiles, origins, prices, and more."
        url="/compare"
      />
      <div className="min-h-screen bg-cream">
        <Section padding="md">
          <Container>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link
                  to="/browse"
                  className="inline-flex items-center text-comb-600 hover:text-honey-600 transition-colors mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Browse
                </Link>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-comb-900">
                  Compare Honeys
                </h1>
              </div>
              <Button variant="ghost" size="sm" onClick={clearCompare}>
                Clear All
              </Button>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl shadow-honey overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Header with honey images and names */}
                  <thead>
                    <tr className="border-b border-comb-100">
                      <th className="p-4 text-left w-40 bg-comb-50"></th>
                      {compareList.map(honey => (
                        <th key={honey.id} className="p-4 text-center min-w-[200px]">
                          <div className="relative">
                            <button
                              onClick={() => removeFromCompare(honey.id)}
                              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm border border-comb-200 text-comb-400 hover:text-comb-600 hover:bg-comb-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <Link to={`/honey/${honey.slug}`}>
                              <img
                                src={honey.thumbnailUrl || honey.imageUrl}
                                alt={honey.name}
                                className="w-32 h-32 object-cover rounded-xl mx-auto mb-3 hover:opacity-90 transition-opacity"
                              />
                              <h3 className="font-display text-lg font-semibold text-comb-900 hover:text-honey-600 transition-colors">
                                {honey.name}
                              </h3>
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={row.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-comb-50/50'}>
                        <td className="p-4 font-semibold text-comb-800 text-sm">
                          {row.label}
                        </td>
                        {compareList.map(honey => (
                          <td key={honey.id} className="p-4 text-center text-comb-700">
                            {row.key === 'floralSourceDisplay' ? (
                              <Badge variant="honey" size="sm">{getValue(honey, row.key)}</Badge>
                            ) : row.key === 'originDisplay' ? (
                              <Badge variant="info" size="sm">{getValue(honey, row.key)}</Badge>
                            ) : row.key === 'price' ? (
                              <span className="font-semibold text-honey-700">{getValue(honey, row.key)}</span>
                            ) : (
                              <span className="text-sm">{getValue(honey, row.key)}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  {/* Purchase Links */}
                  <tfoot>
                    <tr className="border-t border-comb-100 bg-honey-50">
                      <td className="p-4"></td>
                      {compareList.map(honey => (
                        <td key={honey.id} className="p-4 text-center">
                          {honey.purchaseUrl ? (
                            <a
                              href={honey.purchaseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="primary" size="sm">
                                Buy Now
                              </Button>
                            </a>
                          ) : (
                            <Link to={`/honey/${honey.slug}`}>
                              <Button variant="secondary" size="sm">
                                View Details
                              </Button>
                            </Link>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Add more honeys CTA */}
            {compareList.length < 3 && (
              <div className="text-center mt-6">
                <Link to="/browse">
                  <Button variant="ghost">
                    + Add more honeys to compare ({3 - compareList.length} remaining)
                  </Button>
                </Link>
              </div>
            )}
          </Container>
        </Section>
      </div>
    </>
  );
}
