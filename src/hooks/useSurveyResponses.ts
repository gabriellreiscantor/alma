import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SurveyQuestion } from '../types/survey';

export function useSurveyResponses(
  questions: SurveyQuestion[],
  pageNumber: number,
  totalPages: number
) {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  const handleOptionSelect = (questionId: number, answer: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return true; // Indica que há próxima questão
    }
    return false; // Indica que é a última questão
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const allAnswered = questions.every(q => responses[q.id]);
      if (!allAnswered) {
        throw new Error('Por favor, responda todas as perguntas antes de continuar.');
      }

      const { error } = await supabase.from('survey_responses').insert(
        questions.map(q => ({
          question: q.question,
          answer: responses[q.id]
        }))
      );

      if (error) throw error;

      if (pageNumber < totalPages) {
        navigate(`/survey/${pageNumber + 1}`);
      } else {
        navigate('/chat');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    responses,
    loading,
    currentQuestionIndex,
    handleOptionSelect,
    handleSubmit
  };
}