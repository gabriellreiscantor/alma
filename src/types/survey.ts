export interface SurveyQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface SurveyResponse {
  question: string;
  answer: string;
}

export interface SurveyPageProps {
  questions: SurveyQuestion[];
  onComplete: (responses: SurveyResponse[]) => void;
  currentPage: number;
  totalPages: number;
}