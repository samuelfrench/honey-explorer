import { useEffect, useState } from 'react'
import axios from 'axios'

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
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-amber-800 mb-4">
        Honey Explorer
      </h1>
      <p className="text-xl text-amber-700 mb-8">
        Discover amazing honey from around the world
      </p>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Backend Connection Status
        </h2>

        {loading && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span>Checking connection...</span>
          </div>
        )}

        {!loading && health && (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Connected - {health.status}</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>{error}</span>
          </div>
        )}

        {health && (
          <p className="text-sm text-gray-500 mt-2">
            Last checked: {new Date(health.timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default App
