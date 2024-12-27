import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SurveyQuestion } from '../types/survey';
import { useSurveyScroll } from '../hooks/useSurveyScroll';
import { LoadingScreen } from '../components/LoadingScreen';

interface Props {
  questions: SurveyQuestion[];
  pageNumber: number;
  totalPages: number;
}

export function SurveyPage({ questions, pageNumber, totalPages }: Props) {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { questionRefs, scrollToQuestion } = useSurveyScroll();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSurveyStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: responses } = await supabase
          .from('survey_responses')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (responses && responses.length > 0) {
          navigate('/dashboard');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao verificar status do questionário:', error);
        setLoading(false);
      }
    }

    checkSurveyStatus();
  }, [navigate]);

  const handleOptionSelect = (questionId: number, answer: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      scrollToQuestion(nextIndex);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const allAnswered = questions.every(q => responses[q.id]);
      if (!allAnswered) {
        throw new Error('Por favor, responda todas as perguntas antes de continuar.');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('survey_responses').insert(
        questions.map(q => ({
          user_id: user.id,
          question: q.question,
          answer: responses[q.id]
        }))
      );

      if (error) throw error;

      if (pageNumber < totalPages) {
        navigate(`/survey/${pageNumber + 1}`);
      } else {
        const redirectTo = localStorage.getItem('redirectAfterSurvey') || '/dashboard';
        localStorage.removeItem('redirectAfterSurvey');
        navigate(redirectTo);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display">Conheça você</h1>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-gradient-to-r from-violet-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(pageNumber / totalPages) * 100}%` }}
          />
        </div>

        <div className="space-y-24">
          {questions.map((q, index) => (
            <div
              key={q.id}
              ref={el => questionRefs.current[index] = el}
              className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-6">{q.question}</h2>
              <div className="space-y-3">
                {q.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => handleOptionSelect(q.id, option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      responses[q.id] === option
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end sticky bottom-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !questions.every(q => responses[q.id])}
            className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Salvando...' : pageNumber === totalPages ? 'Concluir' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
}