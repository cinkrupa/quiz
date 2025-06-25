'use client';

import { QuizSettings, CategoryOption, DifficultyOption, Player } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATEGORIES, DIFFICULTIES } from '@/lib/quiz-service';

interface QuizSettingsProps {
  settings: QuizSettings;
  player: Player | null;
  onSettingsChange: (settings: QuizSettings) => void;
  onStartQuiz: () => void;
  onChangePlayer: () => void;
  onShowLeaderboard: () => void;
}

export function QuizSettingsComponent({ settings, player, onSettingsChange, onStartQuiz, onChangePlayer, onShowLeaderboard }: QuizSettingsProps) {
  const handleCategoryChange = (categoryId: string) => {
    onSettingsChange({
      ...settings,
      category: categoryId,
    });
  };

  const handleDifficultyChange = (difficultyId: string) => {
    onSettingsChange({
      ...settings,
      difficulty: difficultyId,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">🧠</div>
        <CardTitle className="text-2xl">Knowledge Quiz</CardTitle>
        <p className="text-muted-foreground">
          Customize your quiz experience by selecting a category and difficulty level
        </p>
        
        {player && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Welcome, {player.name}!
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onChangePlayer}
                className="text-blue-700 dark:text-blue-300 border-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                Change Player
              </Button>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <div>Total Score: {player.score} points</div>
              <div>Questions Answered: {player.total_answers}</div>
              <div>
                Success Rate: {player.total_answers > 0 
                  ? Math.round((player.score / player.total_answers) * 100) 
                  : 0}%
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {CATEGORIES.map((category: CategoryOption) => (
              <Button
                key={category.id}
                variant={settings.category === category.id ? 'default' : 'outline'}
                className="h-auto p-3 text-left justify-start whitespace-normal"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Difficulty</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DIFFICULTIES.map((difficulty: DifficultyOption) => (
              <Button
                key={difficulty.id}
                variant={settings.difficulty === difficulty.id ? 'default' : 'outline'}
                className="h-auto p-3"
                onClick={() => handleDifficultyChange(difficulty.id)}
              >
                {difficulty.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          <Button onClick={onStartQuiz} className="w-full" size="lg">
            Start Quiz
          </Button>
          <Button 
            onClick={onShowLeaderboard} 
            variant="outline" 
            className="w-full" 
            size="lg"
          >
            🏆 View Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
