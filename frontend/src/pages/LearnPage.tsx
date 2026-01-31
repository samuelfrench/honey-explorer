import { Link } from 'react-router-dom';
import { BookOpen, Flower2, Droplet, Heart, ArrowRight } from 'lucide-react';
import { Container, Section } from '../components/layout';
import { SEO } from '../components/seo';

const guides = [
  {
    title: 'Floral Sources Guide',
    description: 'Learn about different honey varieties based on their floral origin - from clover to manuka and everything in between.',
    path: '/learn/floral-sources',
    icon: Flower2,
    color: 'bg-pink-100 text-pink-700',
  },
  {
    title: 'Honey Types Explained',
    description: 'Understand the difference between raw, filtered, pasteurized, creamed, and other honey processing methods.',
    path: '/learn/honey-types',
    icon: Droplet,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Health Benefits',
    description: 'Discover the nutritional and therapeutic benefits of raw honey, from antioxidants to natural remedies.',
    path: '/learn/health-benefits',
    icon: Heart,
    color: 'bg-green-100 text-green-700',
  },
];

export function LearnPage() {
  return (
    <>
      <SEO
        title="Learn About Honey"
        description="Educational guides about honey varieties, processing types, health benefits, and more. Become a honey expert."
        url="/learn"
      />
      <div className="min-h-screen bg-cream">
        {/* Hero */}
        <Section padding="lg" background="honey">
          <Container size="md">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-honey-600 mx-auto mb-4" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-honey-900 mb-4">
                Learn About Honey
              </h1>
              <p className="text-xl text-honey-700 max-w-2xl mx-auto">
                Explore our educational guides to become a honey expert. From floral sources to health benefits, discover everything you need to know.
              </p>
            </div>
          </Container>
        </Section>

        {/* Guides Grid */}
        <Section padding="lg">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guides.map(guide => {
                const Icon = guide.icon;
                return (
                  <Link
                    key={guide.path}
                    to={guide.path}
                    className="group bg-white rounded-2xl p-6 shadow-honey hover:shadow-honey-lg transition-all"
                  >
                    <div className={`w-14 h-14 rounded-xl ${guide.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="font-display text-xl font-semibold text-comb-900 group-hover:text-honey-600 transition-colors mb-2">
                      {guide.title}
                    </h2>
                    <p className="text-comb-600 mb-4">
                      {guide.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-honey-600 font-medium group-hover:gap-2 transition-all">
                      Read Guide
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
}
