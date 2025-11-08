import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Quiz, QuizQuestion } from '../types';
import LoadingSpinner from './icons/LoadingSpinner';

const QuizGenerator: React.FC = () => {
  const [content, setContent] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);

  const handleGenerateQuiz = async () => {
    if (!content.trim()) {
      setError('Please provide study material to generate a quiz.');
      return;
    }
    setIsLoading(true);
    setError('');
    setQuiz(null);

    try {
      const generatedQuiz = await generateQuiz(content);
      setQuiz(generatedQuiz);
      setShowAnswers(new Array(generatedQuiz.questions.length).fill(false));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnswer = (index: number) => {
    setShowAnswers(prev => {
      const newShowAnswers = [...prev];
      newShowAnswers[index] = !newShowAnswers[index];
      return newShowAnswers;
    });
  };

  const getOptionClass = (option: string, question: QuizQuestion, show: boolean) => {
    if (!show) return "bg-gray-100 hover:bg-indigo-100";
    if (option === question.correctAnswer) return "bg-green-200 border-green-500";
    return "bg-red-200 border-red-500";
  };


  return (
    <section id="quiz" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Test Your Knowledge</h2>
          <p className="text-lg text-gray-600 mt-2">Generate a custom quiz from your notes to prepare for exams.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6">
            <label htmlFor="quiz-material" className="text-lg font-semibold text-gray-800 mb-2 block">
              Study Material for Quiz
            </label>
            <textarea
              id="quiz-material"
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="Paste the notes you want to be quizzed on..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              className="bg-purple-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105 disabled:bg-purple-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
            >
              {isLoading ? <LoadingSpinner /> : 'Generate My Quiz'}
            </button>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          {quiz && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center mb-6">{quiz.title}</h3>
              <div className="space-y-6">
                {quiz.questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-white p-6 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-4">{qIndex + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className={`p-3 rounded-lg border-2 border-transparent transition-colors text-gray-700 ${getOptionClass(option, q, showAnswers[qIndex])}`}>
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="text-right mt-4">
                        <button onClick={() => toggleAnswer(qIndex)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                            {showAnswers[qIndex] ? 'Hide Answer' : 'Show Answer'}
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizGenerator;
