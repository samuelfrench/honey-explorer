import { Link } from 'react-router-dom';
import { ArrowLeft, Flower2 } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Badge } from '../components/ui';
import { SEO } from '../components/seo';

const floralSources = [
  {
    name: 'Clover',
    description: 'The most common honey variety in North America. Clover honey is light, mild, and versatile with a subtle floral sweetness.',
    characteristics: ['Light amber color', 'Mild, sweet flavor', 'Versatile for cooking'],
    bestFor: 'Everyday use, tea, baking',
  },
  {
    name: 'Wildflower',
    description: 'A blend of nectar from various wildflowers, varying by region and season. Each batch is unique with complex flavors.',
    characteristics: ['Varies by region', 'Complex flavor profile', 'Medium to dark amber'],
    bestFor: 'Those who enjoy variety and regional flavors',
  },
  {
    name: 'Manuka',
    description: 'Premium honey from New Zealand, prized for its unique antibacterial properties. Rated by UMF or MGO levels.',
    characteristics: ['Dark amber', 'Rich, earthy flavor', 'Medicinal properties'],
    bestFor: 'Wellness, immune support, wound healing',
  },
  {
    name: 'Orange Blossom',
    description: 'Harvested from citrus groves, this honey has a delicate citrus aroma and light, fruity taste.',
    characteristics: ['Light golden color', 'Citrus aroma', 'Sweet, fruity taste'],
    bestFor: 'Tea, desserts, marinades',
  },
  {
    name: 'Buckwheat',
    description: 'One of the darkest and most robust honeys. Rich in antioxidants with a molasses-like flavor.',
    characteristics: ['Dark brown color', 'Strong, bold flavor', 'High antioxidants'],
    bestFor: 'Baking, BBQ sauces, cheese pairings',
  },
  {
    name: 'Acacia',
    description: 'A premium light honey known for its slow crystallization and mild, delicate flavor.',
    characteristics: ['Very light color', 'Mild, clean taste', 'Stays liquid longer'],
    bestFor: 'Sweetening without overpowering, fine dining',
  },
  {
    name: 'Lavender',
    description: 'Harvested from lavender fields, this honey has a distinctive floral aroma and calming properties.',
    characteristics: ['Medium amber', 'Floral, herbal notes', 'Aromatic'],
    bestFor: 'Tea, desserts, relaxation remedies',
  },
  {
    name: 'Eucalyptus',
    description: 'Distinctive menthol undertones from eucalyptus trees. Popular in Australia and Mediterranean regions.',
    characteristics: ['Medium to dark amber', 'Herbal, menthol notes', 'Bold flavor'],
    bestFor: 'Cold remedies, strong tea',
  },
];

export function LearnFloralSourcesPage() {
  return (
    <>
      <SEO
        title="Honey Floral Sources Guide"
        description="Learn about different honey varieties based on their floral origin - from clover to manuka, buckwheat to lavender."
        url="/learn/floral-sources"
      />
      <div className="min-h-screen bg-cream">
        {/* Hero */}
        <Section padding="md" background="honey">
          <Container size="md">
            <Link
              to="/learn"
              className="inline-flex items-center text-honey-700 hover:text-honey-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learn
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <Flower2 className="w-10 h-10 text-honey-600" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-honey-900">
                Honey Floral Sources Guide
              </h1>
            </div>
            <p className="text-lg text-honey-700 max-w-2xl">
              The floral source determines a honey's color, flavor, and characteristics. Discover the unique qualities of each variety.
            </p>
          </Container>
        </Section>

        {/* Content */}
        <Section padding="lg">
          <Container size="md">
            <div className="space-y-8">
              {floralSources.map(source => (
                <div key={source.name} className="bg-white rounded-2xl p-6 shadow-honey">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="font-display text-2xl font-semibold text-comb-900">
                      {source.name} Honey
                    </h2>
                    <Link to={`/browse?floralSource=${source.name.toUpperCase().replace(' ', '_')}`}>
                      <Badge variant="honey" size="sm">Browse {source.name}</Badge>
                    </Link>
                  </div>
                  <p className="text-comb-700 mb-4">{source.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-comb-800 mb-2">Characteristics</h3>
                      <ul className="space-y-1">
                        {source.characteristics.map(char => (
                          <li key={char} className="text-sm text-comb-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-honey-400 rounded-full" />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-comb-800 mb-2">Best For</h3>
                      <p className="text-sm text-comb-600">{source.bestFor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
}
