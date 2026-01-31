import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Zap, Moon, Leaf, Sparkles } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { SEO } from '../components/seo';

const benefits = [
  {
    title: 'Natural Antibacterial Properties',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700',
    description: 'Raw honey contains hydrogen peroxide and other compounds that naturally inhibit bacterial growth. This makes it effective for wound care and sore throat relief.',
    tips: [
      'Apply raw honey directly to minor cuts and burns',
      'Mix with warm water and lemon for sore throats',
      'Choose Manuka honey for strongest antibacterial effects',
    ],
  },
  {
    title: 'Rich in Antioxidants',
    icon: Sparkles,
    color: 'bg-purple-100 text-purple-700',
    description: 'Honey contains phenolic compounds like flavonoids and organic acids that act as antioxidants, helping protect your body from cell damage caused by free radicals.',
    tips: [
      'Darker honeys like buckwheat have more antioxidants',
      'Raw, unprocessed honey retains more antioxidants',
      'Regular consumption supports overall health',
    ],
  },
  {
    title: 'Natural Energy Source',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-700',
    description: 'The natural sugars in honey (fructose and glucose) provide quick, sustained energy. Athletes often use honey as a natural alternative to processed sports gels.',
    tips: [
      'Take a tablespoon before workouts',
      'Mix with warm water for a pre-exercise drink',
      'Spread on toast for sustained morning energy',
    ],
  },
  {
    title: 'Sleep Support',
    icon: Moon,
    color: 'bg-indigo-100 text-indigo-700',
    description: 'Honey promotes the release of melatonin by raising insulin slightly and allowing tryptophan to enter the brain. A time-honored remedy for better sleep.',
    tips: [
      'Mix a tablespoon in warm milk before bed',
      'Try chamomile tea with honey',
      'Lavender honey may enhance calming effects',
    ],
  },
  {
    title: 'Digestive Health',
    icon: Leaf,
    color: 'bg-green-100 text-green-700',
    description: 'Raw honey contains prebiotics that feed beneficial gut bacteria. It may also help soothe digestive issues and support a healthy microbiome.',
    tips: [
      'Take on an empty stomach for digestive benefits',
      'Mix with apple cider vinegar for digestion support',
      'Choose raw honey to preserve prebiotic compounds',
    ],
  },
  {
    title: 'Skin & Beauty',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    description: 'Honey is a natural humectant, drawing moisture into the skin. Its antibacterial properties make it useful for acne treatment and wound healing.',
    tips: [
      'Apply as a face mask for 15-20 minutes',
      'Mix with oatmeal for a gentle exfoliating scrub',
      'Use on minor burns to promote healing',
    ],
  },
];

export function LearnHealthBenefitsPage() {
  return (
    <>
      <SEO
        title="Honey Health Benefits"
        description="Discover the nutritional and therapeutic benefits of raw honey - from antioxidants and antibacterial properties to natural remedies."
        url="/learn/health-benefits"
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
              <Heart className="w-10 h-10 text-honey-600" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-honey-900">
                Health Benefits of Honey
              </h1>
            </div>
            <p className="text-lg text-honey-700 max-w-2xl">
              For thousands of years, honey has been valued for its healing properties. Modern research confirms many of these traditional uses.
            </p>
          </Container>
        </Section>

        {/* Disclaimer */}
        <Section padding="sm">
          <Container size="md">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Note:</strong> While honey has many benefits, it should not replace medical treatment. Consult a healthcare provider for health concerns. Never give honey to infants under 1 year old.
            </div>
          </Container>
        </Section>

        {/* Content */}
        <Section padding="lg">
          <Container size="md">
            <div className="space-y-8">
              {benefits.map(benefit => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="bg-white rounded-2xl p-6 shadow-honey">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${benefit.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-xl font-semibold text-comb-900 mb-2">
                          {benefit.title}
                        </h2>
                        <p className="text-comb-700 mb-4">{benefit.description}</p>
                        <div>
                          <h3 className="font-semibold text-comb-800 mb-2">How to Use</h3>
                          <ul className="space-y-1">
                            {benefit.tips.map(tip => (
                              <li key={tip} className="text-sm text-comb-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-honey-400 rounded-full flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <p className="text-comb-600 mb-4">Ready to experience these benefits?</p>
              <Link
                to="/browse?type=RAW"
                className="inline-flex items-center gap-2 px-6 py-3 bg-honey-500 text-white font-semibold rounded-xl hover:bg-honey-600 transition-colors"
              >
                Browse Raw Honey
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
}
