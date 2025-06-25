'use client';

import { ProcessedQuestion } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';

interface QuestionCardProps {
  question: ProcessedQuestion;
  selectedAnswer: string | null;
  isAnswered: boolean;
  currentQuestionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  currentQuestionNumber,
  totalQuestions,
  onAnswerSelect,
  onNext,
  onCancel,
}: QuestionCardProps) {
  const progressValue = (currentQuestionNumber / totalQuestions) * 100;

  const getButtonVariant = (option: string) => {
    if (!isAnswered) return 'outline';
    
    if (option === question.correctAnswer) {
      return 'default'; // Correct answer - green
    }
    
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return 'destructive'; // Wrong selected answer - red
    }
    
    return 'outline'; // Other options
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionNumber} of {totalQuestions}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground capitalize">
                  {question.difficulty} • {question.category}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  title="Cancel Quiz"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Progress value={progressValue} className="w-full" />
        </div>
        <CardTitle className="text-lg leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={getButtonVariant(option)}
              className="p-4 h-auto text-left justify-start whitespace-normal"
              onClick={() => !isAnswered && onAnswerSelect(option)}
              disabled={isAnswered}
            >
              <span className="text-wrap">{option}</span>
            </Button>
          ))}
        </div>
        
        {isAnswered ? (
          <div className="pt-4 border-t space-y-4">
            <div className="text-center">
              {selectedAnswer === question.correctAnswer ? (
                <p className="text-green-600 font-medium">
                  ✅ Correct answer!
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-red-600 font-medium">
                    ❌ Incorrect answer
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Correct answer: <strong>{question.correctAnswer}</strong>
                  </p>
                </div>
              )}
            </div>
            <Button onClick={onNext} className="w-full">
              {currentQuestionNumber === totalQuestions ? 'See Results' : 'Next Question'}
            </Button>
          </div>
        ) : (
          <div className="pt-4 border-t">
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="text-muted-foreground hover:text-destructive"
              >
                Cancel Quiz
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
