'use client';

import { useQuiz } from '@/hooks/use-quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/question-card';
import { QuizResults } from '@/components/quiz-results';
import { QuizSettingsComponent } from '@/components/quiz-settings';
import { PlayerSetup } from '@/components/player-setup';
import { Leaderboard } from '@/components/leaderboard';

export function Quiz() {
  const {
    questions,
    currentQuestionIndex,
    score,
    isLoading,
    error,
    settings,
    player,
    gamePhase,
    setupPlayer,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    cancelQuiz,
    updateSettings,
    goToPlayerSetup,
    goToLeaderboard,
    getCurrentQuestion,
    isAnswered,
    getCurrentAnswer,
  } = useQuiz();

  const handleStartQuiz = () => {
    startQuiz(settings);
  };

  const handleRetryQuiz = () => {
    startQuiz(settings);
  };

  // Player setup phase
  if (gamePhase === 'player-setup') {
    return (
      <PlayerSetup
        onPlayerSetup={setupPlayer}
        onShowLeaderboard={goToLeaderboard}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Leaderboard phase
  if (gamePhase === 'leaderboard') {
    return (
      <Leaderboard onBack={goToPlayerSetup} />
    );
  }

  // Quiz settings phase
  if (gamePhase === 'quiz-settings') {
    return (
      <QuizSettingsComponent
        settings={settings}
        player={player}
        error={error}
        isLoading={isLoading}
        onSettingsChange={updateSettings}
        onStartQuiz={handleStartQuiz}
        onChangePlayer={goToPlayerSetup}
      />
    );
  }

  // Loading state
  if (isLoading && gamePhase === 'quiz-active') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && gamePhase === 'quiz-active') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <CardTitle className="text-xl">Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">{error}</p>
          <Button onClick={handleRetryQuiz} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Quiz completed - show results
  if (gamePhase === 'quiz-complete') {
    return (
      <QuizResults
        score={score}
        totalQuestions={questions.length}
        onRestart={resetQuiz}
      />
    );
  }

  // Quiz in progress - show current question
  const currentQuestion = getCurrentQuestion();
  
  if (!currentQuestion) {
    return (      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No questions to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <QuestionCard
      question={currentQuestion}
      selectedAnswer={getCurrentAnswer()}
      isAnswered={isAnswered()}
      currentQuestionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      onAnswerSelect={answerQuestion}
      onNext={nextQuestion}
      onCancel={cancelQuiz}
    />
  );
}
