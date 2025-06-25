'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { QuizState, ProcessedQuestion, QuizSettings } from '@/types/quiz';
import { fetchQuizQuestions } from '@/lib/quiz-service';
import { createOrUpdatePlayer, updatePlayerStats } from '@/lib/player-service';

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
  player: null,
  gamePhase: 'player-setup',
};

export function useQuiz() {
  const [state, setState] = useState<QuizState>(initialState);
  const setupPlayer = useCallback(async (playerName: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const player = await createOrUpdatePlayer(playerName);
      setState(prev => ({
        ...prev,
        player,
        gamePhase: 'quiz-settings',
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to setup player',
      }));
    }
  }, []);

  const startQuiz = useCallback(async (settings?: QuizSettings) => {
    statsUpdatedRef.current = false; // Reset stats updated flag for new quiz
    setState(prev => ({ ...prev, isLoading: true, error: null, gamePhase: 'quiz-active' }));
    
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
        gamePhase: 'quiz-settings',
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

  const statsUpdatedRef = useRef(false);

  const nextQuestion = useCallback(async () => {
    setState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const isComplete = nextIndex >= prev.questions.length;
      
      return {
        ...prev,
        currentQuestionIndex: isComplete ? prev.currentQuestionIndex : nextIndex,
        isQuizComplete: isComplete,
        gamePhase: isComplete ? 'quiz-complete' : prev.gamePhase,
      };
    });
  }, []);

  // Handle stats update when quiz is completed
  useEffect(() => {
    if (state.isQuizComplete && state.player?.id && !statsUpdatedRef.current) {
      statsUpdatedRef.current = true;
      
      updatePlayerStats(state.player.id, state.score, state.questions.length)
        .then((updatedPlayer) => {
          setState(current => ({
            ...current,
            player: updatedPlayer,
          }));
        })
        .catch((error) => {
          console.error('Failed to update player stats:', error);
        });
    }
  }, [state.isQuizComplete, state.player?.id, state.score, state.questions.length]);
  const resetQuiz = useCallback(() => {
    statsUpdatedRef.current = false; // Reset stats updated flag
    setState(prev => ({
      ...initialState,
      player: prev.player, // Keep the player data
      gamePhase: 'quiz-settings', // Go back to settings instead of player setup
    }));
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

  const goToPlayerSetup = useCallback(() => {
    setState(prev => ({
      ...prev,
      gamePhase: 'player-setup',
      player: null, // Clear current player
    }));
  }, []);

  const goToLeaderboard = useCallback(() => {
    setState(prev => ({
      ...prev,
      gamePhase: 'leaderboard',
    }));
  }, []);

  const goToQuizSettings = useCallback(() => {
    setState(prev => ({
      ...prev,
      gamePhase: 'quiz-settings',
    }));
  }, []);
  const cancelQuiz = useCallback(() => {
    // Reset quiz state without updating player stats
    setState(prev => ({
      ...prev,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isQuizComplete: false,
      error: null,
      gamePhase: 'quiz-settings',
    }));
    
    // Reset the stats updated flag
    statsUpdatedRef.current = false;
  }, []);

  return {
    ...state,
    setupPlayer,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    updateSettings,
    goToPlayerSetup,
    goToLeaderboard,
    goToQuizSettings,
    getCurrentQuestion,
    isAnswered,
    getCurrentAnswer,
    cancelQuiz,
  };
}
