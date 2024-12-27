import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SurveyPage } from './SurveyPage';
import { surveyQuestions } from '../data/surveyQuestions';

export function SurveyRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/survey/1" replace />} />
      {surveyQuestions.map((questions, index) => (
        <Route
          key={index}
          path={`${index + 1}`}
          element={
            <SurveyPage
              questions={questions}
              pageNumber={index + 1}
              totalPages={surveyQuestions.length}
            />
          }
        />
      ))}
    </Routes>
  );
}