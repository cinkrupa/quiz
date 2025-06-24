'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function QuizResults({ score, totalQuestions, onRestart }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
    const getResultMessage = () => {
    if (percentage >= 80) {
      return {
        emoji: '🏆',
        message: 'Excellent work!',
        description: 'You have outstanding knowledge!',
      };
    } else if (percentage >= 60) {
      return {
        emoji: '👏',
        message: 'Good job!',
        description: 'You did quite well!',
      };
    } else if (percentage >= 40) {
      return {
        emoji: '👍',
        message: 'Not bad!',
        description: 'You have basic knowledge, but practice makes perfect!',
      };
    } else {
      return {
        emoji: '📚',
        message: 'Try again!',
        description: 'Every beginning is difficult. Don\'t give up!',
      };
    }
  };

  const result = getResultMessage();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">{result.emoji}</div>
        <CardTitle className="text-2xl">{result.message}</CardTitle>
        <p className="text-muted-foreground">{result.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold">
            {score}/{totalQuestions}
          </div>
          <div className="space-y-2">            <div className="flex justify-between text-sm">
              <span>Score:</span>
              <span>{percentage}%</span>
            </div>
            <Progress value={percentage} className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {score}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Correct
            </div>
          </div>
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {totalQuestions - score}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Incorrect
            </div>
          </div>
        </div>        <Button onClick={onRestart} className="w-full" size="lg">
          Play Again
        </Button>
      </CardContent>
    </Card>
  );
}
