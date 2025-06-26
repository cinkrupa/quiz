'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';
import { Player } from '@/types/quiz';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/players?action=leaderboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setPlayers(data.players || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="h-6 w-6 flex items-center justify-center text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm sm:text-base text-muted-foreground">Loading leaderboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center">
              <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:space-y-0 justify-center">
                <Button onClick={fetchLeaderboard} className="w-full sm:w-auto">
                  Try Again
                </Button>
                <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Player Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mr-2" />
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Leaderboard
            </CardTitle>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Top 10 Quiz Champions</p>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-6">
          {players.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg sm:text-xl text-muted-foreground mb-2">No players yet!</p>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">Be the first to play and claim the top spot!</p>
              <Button onClick={onBack} size="default" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Start Playing
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {players.map((player, index) => {
                  const rank = index + 1;
                  const accuracy = player.total_answers > 0 
                    ? Math.round((player.score / player.total_answers) * 100) 
                    : 0;
                  
                  return (
                    <div
                      key={player.id || `${player.name}-${index}`}
                      className={`flex items-start sm:items-center p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getRankStyle(rank)}`}
                    >
                      <div className="flex items-center mr-3 sm:mr-4 shrink-0">
                        {getRankIcon(rank)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-lg truncate">{player.name}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground space-y-1 sm:space-y-0">
                              <span className="shrink-0">Score: {player.score}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="shrink-0">Questions: {player.total_answers}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="shrink-0">Accuracy: {accuracy}%</span>
                            </div>
                          </div>
                          
                          <div className="text-left sm:text-right shrink-0">
                            <div className="text-2xl font-bold text-primary">
                              {player.score}
                            </div>
                            {rank <= 3 && (
                              <div className="text-xs font-medium text-muted-foreground">
                                {rank === 1 ? 'Champion' : rank === 2 ? 'Runner-up' : '3rd Place'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center px-4">
                <Button onClick={onBack} size="lg" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Player Selection
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
