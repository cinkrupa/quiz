'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateAnonymousName } from '@/lib/player-service';

interface PlayerSetupProps {
  onPlayerSetup: (playerName: string) => void;
  onShowLeaderboard: () => void;
  isLoading: boolean;
  error: string | null;
}

export function PlayerSetup({ onPlayerSetup, onShowLeaderboard, isLoading, error }: PlayerSetupProps) {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = playerName.trim() || generateAnonymousName();
    onPlayerSetup(finalName);
  };



  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">🎯</div>
        <CardTitle className="text-2xl">Welcome to Knowledge Quiz!</CardTitle>
        <p className="text-muted-foreground">
          Enter your name to start playing and track your progress
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-medium">
              Enter player name
            </label>
            <Input
              id="playerName"
              type="text"
              placeholder="Your name here..."
              value={playerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for an anonymous name
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : 'Next'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={onShowLeaderboard}
              disabled={isLoading}
            >
              🏆 View Leaderboard
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
