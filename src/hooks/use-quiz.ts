'use client';

import { useState, useCallback } from 'react';
import { QuizState, ProcessedQuestion, QuizSettings } from '@/types/quiz';
import { fetchQuizQuestions } from '@/lib/quiz-service';

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  isQuizComplete: false,
  isLoading: false,
  error: null,
  settings: {
    category: 'any',
    difficulty: 'any',
  },
};

export function useQuiz() {
  const [state, setState] = useState<QuizState>(initialState);
  const startQuiz = useCallback(async (settings?: QuizSettings) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const questions = await fetchQuizQuestions(settings);
      setState(prev => ({
        ...prev,
        questions,
        answers: new Array(questions.length).fill(null),
        isLoading: false,
        settings: settings || prev.settings,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  }, []);

  const answerQuestion = useCallback((selectedAnswer: string) => {
    setState(prev => {
      const newAnswers = [...prev.answers];
      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      
      newAnswers[prev.currentQuestionIndex] = selectedAnswer;
      
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      
      return {
        ...prev,
        answers: newAnswers,
        score: newScore,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const isComplete = nextIndex >= prev.questions.length;
      
      return {
        ...prev,
        currentQuestionIndex: isComplete ? prev.currentQuestionIndex : nextIndex,
        isQuizComplete: isComplete,
      };
    });
  }, []);
  const resetQuiz = useCallback(() => {
    setState(initialState);
  }, []);
  const updateSettings = useCallback((newSettings: QuizSettings) => {
    setState(prev => ({
      ...prev,
      settings: newSettings,
    }));
  }, []);

  const getCurrentQuestion = useCallback((): ProcessedQuestion | null => {
    if (state.questions.length === 0 || state.currentQuestionIndex >= state.questions.length) {
      return null;
    }
    return state.questions[state.currentQuestionIndex];
  }, [state.questions, state.currentQuestionIndex]);

  const isAnswered = useCallback((): boolean => {
    return state.answers[state.currentQuestionIndex] !== null;
  }, [state.answers, state.currentQuestionIndex]);

  const getCurrentAnswer = useCallback((): string | null => {
    return state.answers[state.currentQuestionIndex] ?? null;
  }, [state.answers, state.currentQuestionIndex]);
  return {
    ...state,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    updateSettings,
    getCurrentQuestion,
    isAnswered,
    getCurrentAnswer,
  };
}
