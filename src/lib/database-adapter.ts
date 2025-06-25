import { Player } from '@/types/quiz';

export interface DatabaseAdapter {
  createOrUpdatePlayer(name: string): Promise<Player>;
  updatePlayerStats(playerId: string, score: number, totalAnswers: number): Promise<Player>;
}

export class SupabaseAdapter implements DatabaseAdapter {
  private supabase: ReturnType<typeof import('@supabase/supabase-js').createClient>;

  constructor() {
    // Dynamically import Supabase for production
    const { createClient } = eval('require')('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing for production environment');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async createOrUpdatePlayer(name: string): Promise<Player> {
    try {
      // First, check if player already exists
      const { data: existingPlayer, error: fetchError } = await this.supabase
        .from('players')
        .select('*')
        .eq('name', name)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new players
        throw fetchError;
      }

      if (existingPlayer) {
        // Player exists, return existing data
        return existingPlayer as unknown as Player;
      }

      // Player doesn't exist, create new one
      const newPlayer: Omit<Player, 'id' | 'updated_at'> = {
        name,
        score: 0,
        total_answers: 0,
      };

      const { data, error } = await this.supabase
        .from('players')
        .insert([newPlayer])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as unknown as Player;
    } catch (error) {
      console.error('Error creating/updating player:', error);
      throw new Error('Failed to create or update player');
    }
  }

  async updatePlayerStats(playerId: string, score: number, totalAnswers: number): Promise<Player> {
    try {
      const { data: existingPlayer, error: fetchError } = await this.supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const player = existingPlayer as unknown as Player;
      const newScore = player.score + score;
      const newTotalAnswers = player.total_answers + totalAnswers;

      const { data, error } = await this.supabase
        .from('players')
        .update({
          score: newScore,
          total_answers: newTotalAnswers,
          updated_at: new Date().toISOString(),
        })
        .eq('id', playerId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as unknown as Player;
    } catch (error) {
      console.error('Error updating player stats:', error);
      throw new Error('Failed to update player statistics');
    }
  }
}

export class SQLiteAdapter implements DatabaseAdapter {
  private DatabaseService: typeof import('./database').DatabaseService;

  constructor() {
    // Dynamically import SQLite for development
    const { DatabaseService } = eval('require')('./database');
    this.DatabaseService = DatabaseService;
  }

  async createOrUpdatePlayer(name: string): Promise<Player> {
    return this.DatabaseService.createOrUpdatePlayer(name);
  }

  async updatePlayerStats(playerId: string, score: number, totalAnswers: number): Promise<Player> {
    return this.DatabaseService.updatePlayerStats(playerId, score, totalAnswers);
  }
}

// Factory function to get the appropriate database adapter
export function getDatabaseAdapter(): DatabaseAdapter {
  const isProduction = process.env.NODE_ENV === 'production';
  const useSupabase = process.env.USE_SUPABASE === 'true' || isProduction;
  
  if (useSupabase) {
    return new SupabaseAdapter();
  } else {
    return new SQLiteAdapter();
  }
}
