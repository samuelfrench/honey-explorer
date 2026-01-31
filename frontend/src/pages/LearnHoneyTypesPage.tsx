import { Link } from 'react-router-dom';
import { ArrowLeft, Droplet } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { Badge } from '../components/ui';
import { SEO } from '../components/seo';

const honeyTypes = [
  {
    name: 'Raw',
    description: 'Honey as it exists in the beehive. Raw honey is strained to remove debris but is never heated above natural hive temperatures, preserving all natural enzymes, pollen, and beneficial compounds.',
    benefits: ['Contains natural enzymes', 'Preserves pollen and propolis', 'Maximum nutritional value', 'Natural antibacterial properties'],
    considerations: 'Not recommended for infants under 1 year. May crystallize faster than processed honey.',
  },
  {
    name: 'Filtered',
    description: 'Raw honey that has been lightly filtered to remove larger particles like wax and bee parts while still preserving most beneficial properties.',
    benefits: ['Clearer appearance', 'Longer shelf life', 'Retains most nutrients', 'Slower crystallization'],
    considerations: 'Some pollen may be removed during filtering.',
  },
  {
    name: 'Pasteurized',
    description: 'Honey that has been heated to high temperatures to kill yeast cells and slow crystallization. This process extends shelf life but reduces some beneficial properties.',
    benefits: ['Long shelf life', 'Consistent texture', 'Clear appearance', 'Widely available'],
    considerations: 'Heat destroys some enzymes and antioxidants.',
  },
  {
    name: 'Creamed',
    description: 'Also called whipped or spun honey. Controlled crystallization creates a smooth, spreadable texture while maintaining raw honey benefits.',
    benefits: ['Spreadable consistency', 'No dripping', 'Same nutrition as raw', 'Great for toast'],
    considerations: 'Texture preference is personal - some prefer liquid honey.',
  },
  {
    name: 'Comb',
    description: 'Honey sold still in the beeswax comb, exactly as the bees made it. The most unprocessed form of honey available.',
    benefits: ['Completely unprocessed', 'Contains beeswax', 'Edible wax adds fiber', 'Impressive presentation'],
    considerations: 'Higher price point. Wax texture may not appeal to everyone.',
  },
  {
    name: 'Infused',
    description: 'Honey that has been combined with other ingredients like herbs, spices, fruit, or hot peppers to create unique flavors.',
    benefits: ['Creative flavor combinations', 'Unique gifting option', 'Culinary versatility', 'Added functional ingredients'],
    considerations: 'Added ingredients may alter nutritional profile.',
  },
  {
    name: 'Organic',
    description: 'Honey certified to meet organic standards, meaning bees forage on pesticide-free flowers and hives are managed without synthetic chemicals.',
    benefits: ['No pesticide exposure', 'Environmental sustainability', 'Strict quality standards', 'Traceability'],
    considerations: 'Certification can be difficult as bees forage up to 5 miles from hives.',
  },
];

export function LearnHoneyTypesPage() {
  return (
    <>
      <SEO
        title="Honey Types Explained"
        description="Understand the difference between raw, filtered, pasteurized, creamed, comb, and other honey processing methods."
        url="/learn/honey-types"
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
              <Droplet className="w-10 h-10 text-honey-600 fill-honey-200" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-honey-900">
                Honey Types Explained
              </h1>
            </div>
            <p className="text-lg text-honey-700 max-w-2xl">
              How honey is processed affects its texture, shelf life, and nutritional content. Learn about each type to make informed choices.
            </p>
          </Container>
        </Section>

        {/* Content */}
        <Section padding="lg">
          <Container size="md">
            <div className="space-y-8">
              {honeyTypes.map(type => (
                <div key={type.name} className="bg-white rounded-2xl p-6 shadow-honey">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="font-display text-2xl font-semibold text-comb-900">
                      {type.name} Honey
                    </h2>
                    <Link to={`/browse?type=${type.name.toUpperCase()}`}>
                      <Badge variant="info" size="sm">Browse {type.name}</Badge>
                    </Link>
                  </div>
                  <p className="text-comb-700 mb-4">{type.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-comb-800 mb-2">Benefits</h3>
                      <ul className="space-y-1">
                        {type.benefits.map(benefit => (
                          <li key={benefit} className="text-sm text-comb-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-comb-800 mb-2">Considerations</h3>
                      <p className="text-sm text-comb-600">{type.considerations}</p>
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
