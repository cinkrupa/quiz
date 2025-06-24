'use client';

import { useQuiz } from '@/hooks/use-quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/question-card';
import { QuizResults } from '@/components/quiz-results';

export function Quiz() {
  const {
    questions,
    currentQuestionIndex,
    score,
    isQuizComplete,
    isLoading,
    error,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    getCurrentQuestion,
    isAnswered,
    getCurrentAnswer,
  } = useQuiz();

  // Welcome screen
  if (questions.length === 0 && !isLoading && !error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <CardTitle className="text-2xl">Quiz Wiedzy</CardTitle>
          <p className="text-muted-foreground">
            Sprawdź swoją wiedzę odpowiadając na 10 pytań z różnych kategorii!
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={startQuiz} className="w-full" size="lg">
            Rozpocznij Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Ładowanie pytań...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <CardTitle className="text-xl">Ups! Coś poszło nie tak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">{error}</p>
          <Button onClick={startQuiz} className="w-full">
            Spróbuj ponownie
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Quiz completed - show results
  if (isQuizComplete) {
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
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Brak pytań do wyświetlenia</p>
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
    />
  );
}
