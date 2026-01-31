import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, RotateCcw, ArrowRight, X } from 'lucide-react';
import { Button, SkeletonCard } from '../ui';
import { HoneyCard } from '../honey';
import { honeyApi, type Honey } from '../../services/api';
import { buildFiltersFromAnswers, type QuizAnswers } from '../../data/quizQuestions';

interface QuizResultsProps {
  answers: QuizAnswers;
  onRetake: () => void;
  onClose?: () => void;
}

export function QuizResults({ answers, onRetake, onClose }: QuizResultsProps) {
  const [honeys, setHoneys] = useState<Honey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const filters = buildFiltersFromAnswers(answers);

      try {
        // First try to get honeys matching floral sources
        const response = await honeyApi.browse({
          floralSource: filters.floralSources,
          origin: filters.origins,
          type: filters.types,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          size: 20,
        });

        let results = response.data.content;

        // Score and rank by flavor profile match
        if (filters.flavorProfiles && filters.flavorProfiles.length > 0) {
          results = results
            .map(honey => {
              const honeyProfiles = honey.flavorProfiles?.split(',').map(p => p.trim().toUpperCase()) || [];
              const matchCount = filters.flavorProfiles!.filter(fp => honeyProfiles.includes(fp)).length;
              return { honey, score: matchCount };
            })
            .sort((a, b) => b.score - a.score)
            .map(item => item.honey);
        }

        setHoneys(results.slice(0, 6));
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        // Fallback to featured honeys
        try {
          const featured = await honeyApi.getFeatured();
          setHoneys(featured.data.slice(0, 6));
        } catch {
          setHoneys([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [answers]);

  const filters = buildFiltersFromAnswers(answers);
  const browseUrl = new URLSearchParams();
  filters.floralSources?.forEach(s => browseUrl.append('floralSource', s));
  filters.origins?.forEach(o => browseUrl.append('origin', o));
  if (filters.priceMin) browseUrl.set('priceMin', String(filters.priceMin));
  if (filters.priceMax) browseUrl.set('priceMax', String(filters.priceMax));

  return (
    <div className="bg-white rounded-2xl shadow-honey-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-honey-400 to-honey-500 px-6 py-6 text-white relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <span className="text-honey-100">Quiz Complete!</span>
        </div>
        <h2 className="font-display text-2xl font-bold">
          Your Perfect Honey Matches
        </h2>
        <p className="text-honey-100 mt-1">
          Based on your preferences, we recommend these honeys for you
        </p>
      </div>

      {/* Results */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : honeys.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {honeys.map(honey => (
              <HoneyCard key={honey.id} honey={honey} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-comb-600 mb-4">
              No exact matches found, but explore our collection to find your perfect honey!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-comb-50 border-t border-comb-100 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onRetake} className="gap-1">
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </Button>
        <Link to={`/browse?${browseUrl.toString()}`}>
          <Button variant="primary" className="gap-1">
            Browse All Matches
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
