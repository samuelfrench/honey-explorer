import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '../ui';
import { QuizResults } from './QuizResults';
import { quizQuestions, type QuizOption, type QuizAnswers } from '../../data/quizQuestions';

interface HoneyQuizProps {
  onClose?: () => void;
}

export function HoneyQuiz({ onClose }: HoneyQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentStep === quizQuestions.length - 1;

  const handleSelectOption = (option: QuizOption) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  const selectedOption = answers[currentQuestion?.id];

  if (showResults) {
    return <QuizResults answers={answers} onRetake={handleRetake} onClose={onClose} />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-honey-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-honey-50 px-6 py-4 border-b border-honey-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-honey-600" />
            <span className="font-semibold text-honey-900">Find Your Perfect Honey</span>
          </div>
          <span className="text-sm text-honey-700">
            Question {currentStep + 1} of {quizQuestions.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-honey-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-honey-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <h3 className="font-display text-2xl font-bold text-comb-900 mb-2">
          {currentQuestion.question}
        </h3>
        {currentQuestion.description && (
          <p className="text-comb-600 mb-6">{currentQuestion.description}</p>
        )}

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelectOption(option)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedOption?.value === option.value
                  ? 'border-honey-500 bg-honey-50'
                  : 'border-comb-200 hover:border-honey-300 hover:bg-honey-50/50'
              }`}
            >
              <span className={`font-medium ${
                selectedOption?.value === option.value ? 'text-honey-900' : 'text-comb-800'
              }`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-comb-50 border-t border-comb-100 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleRetake}
            className="gap-1 text-comb-500"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!selectedOption}
            className="gap-1"
          >
            {isLastQuestion ? 'See Results' : 'Next'}
            {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
