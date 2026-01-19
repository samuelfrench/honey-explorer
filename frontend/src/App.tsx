import { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle, XCircle, Droplet } from 'lucide-react'
import { Card, CardTitle, CardDescription, Badge, Button, Spinner, SkeletonCard } from './components/ui'
import { Container, Section } from './components/layout'

interface HealthStatus {
  status: string
  timestamp: string
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get<HealthStatus>('/api/health')
        setHealth(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to connect to backend')
        setHealth(null)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <Section padding="lg" background="honey">
        <Container size="md">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Droplet className="w-14 h-14 text-honey-600 fill-honey-200" />
              <h1 className="text-5xl font-bold text-honey-900">
                Honey Explorer
              </h1>
            </div>
            <p className="text-xl text-honey-700 mb-8">
              Discover amazing honey from around the world
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="primary" size="lg">Browse Honey</Button>
              <Button variant="secondary" size="lg">Find Local Sources</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Status Section */}
      <Section padding="md">
        <Container size="sm">
          <Card>
            <CardTitle>Backend Connection Status</CardTitle>

            {loading && (
              <div className="flex items-center gap-2 text-comb-500">
                <Spinner size="sm" />
                <span>Checking connection...</span>
              </div>
            )}

            {!loading && health && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Connected - {health.status}</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {health && (
              <CardDescription className="mt-2">
                Last checked: {new Date(health.timestamp).toLocaleString()}
              </CardDescription>
            )}
          </Card>
        </Container>
      </Section>

      {/* Component Showcase */}
      <Section padding="md" background="white">
        <Container>
          <h2 className="text-3xl font-bold text-comb-900 mb-8 text-center">
            Design System Preview
          </h2>

          {/* Color Palette */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-comb-800 mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-honey-100 rounded-lg shadow-honey-sm" />
                <div className="h-16 bg-honey-300 rounded-lg shadow-honey-sm" />
                <div className="h-16 bg-honey-500 rounded-lg shadow-honey-sm" />
                <div className="h-16 bg-honey-700 rounded-lg shadow-honey-sm" />
                <p className="text-sm text-comb-600 text-center">Honey</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-comb-100 rounded-lg shadow-honey-sm" />
                <div className="h-16 bg-comb-300 rounded-lg shadow-honey-sm" />
                <div className="h-16 bg-comb-500 rounded-lg shadow-honey-sm" />
                <div className="h-16 bg-comb-700 rounded-lg shadow-honey-sm" />
                <p className="text-sm text-comb-600 text-center">Comb</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-comb-800 mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="honey">Wildflower</Badge>
              <Badge variant="honey">Manuka</Badge>
              <Badge variant="success">Organic</Badge>
              <Badge variant="warning">Limited</Badge>
              <Badge variant="info">New Zealand</Badge>
              <Badge variant="neutral">Raw</Badge>
              <Badge variant="honey" size="sm">Small Badge</Badge>
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-comb-800 mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-comb-800 mb-4">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardTitle>Manuka Honey</CardTitle>
                <CardDescription>
                  Premium New Zealand Manuka honey with UMF 15+ rating. Rich, earthy flavor with natural antibacterial properties.
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Badge variant="honey">Manuka</Badge>
                  <Badge variant="success">Organic</Badge>
                </div>
              </Card>
              <Card>
                <CardTitle>Wildflower Honey</CardTitle>
                <CardDescription>
                  A blend of nectar from various wildflowers, offering complex flavors that change with the seasons.
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Badge variant="honey">Wildflower</Badge>
                  <Badge variant="neutral">Raw</Badge>
                </div>
              </Card>
              <Card>
                <CardTitle>Buckwheat Honey</CardTitle>
                <CardDescription>
                  Dark, robust honey with molasses-like flavor. Rich in antioxidants and minerals.
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Badge variant="honey">Buckwheat</Badge>
                  <Badge variant="info">USA</Badge>
                </div>
              </Card>
            </div>
          </div>

          {/* Skeleton Loaders */}
          <div>
            <h3 className="text-xl font-semibold text-comb-800 mb-4">Skeleton Loaders</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}

export default App
