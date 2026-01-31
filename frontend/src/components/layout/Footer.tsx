import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Mail, MapPin, Calendar, BookOpen } from 'lucide-react';
import { Container } from './Container';
import { Button, Spinner } from '../ui';
import api from '../../services/api';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const response = await api.post<{ message: string }>('/newsletter/subscribe', { email });
      setStatus('success');
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-comb-900 text-white py-12 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Droplet className="w-8 h-8 text-honey-400 fill-honey-200" />
              <span className="font-display text-xl font-bold text-white">
                Raw Honey Guide
              </span>
            </Link>
            <p className="text-comb-300 text-sm">
              Discover the world's finest honey varieties. Find local sources, compare flavors, and explore the fascinating world of raw honey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-comb-300 hover:text-honey-400 transition-colors text-sm flex items-center gap-2">
                  Browse All Honey
                </Link>
              </li>
              <li>
                <Link to="/local" className="text-comb-300 hover:text-honey-400 transition-colors text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Find Local Sources
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-comb-300 hover:text-honey-400 transition-colors text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Events
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-comb-300 hover:text-honey-400 transition-colors text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Learn About Honey
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/learn/floral-sources" className="text-comb-300 hover:text-honey-400 transition-colors text-sm">
                  Floral Sources Guide
                </Link>
              </li>
              <li>
                <Link to="/learn/honey-types" className="text-comb-300 hover:text-honey-400 transition-colors text-sm">
                  Honey Types Explained
                </Link>
              </li>
              <li>
                <Link to="/learn/health-benefits" className="text-comb-300 hover:text-honey-400 transition-colors text-sm">
                  Health Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-honey-400" />
              Stay Updated
            </h3>
            <p className="text-comb-300 text-sm mb-4">
              Get honey tips, new variety alerts, and exclusive recipes delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-comb-800 border border-comb-700 text-white placeholder-comb-400 focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-transparent text-sm"
                  disabled={status === 'loading'}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === 'loading' || !email.trim()}
                  className="px-4"
                >
                  {status === 'loading' ? <Spinner size="sm" /> : 'Subscribe'}
                </Button>
              </div>
              {message && (
                <p className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-comb-800 mt-8 pt-8 text-center text-comb-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Raw Honey Guide. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
