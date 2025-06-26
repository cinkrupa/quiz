import { Player } from '@/types/quiz';

export interface DatabaseAdapter {
  createOrUpdatePlayer(name: string): Promise<Player>;
  updatePlayerStats(playerId: string, score: number, totalAnswers: number): Promise<Player>;
  getLeaderboard(limit?: number): Promise<Player[]>;
  getPlayerRank(playerId: string): Promise<number | null>;
}

// Dynamic imports to avoid bundling issues
async function getSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient;
}

async function getSQLiteService() {
  const { DatabaseService } = await import('./database');
  return DatabaseService;
}

export class SupabaseAdapter implements DatabaseAdapter {
  private supabase: ReturnType<typeof import('@supabase/supabase-js').createClient> | null = null;
  private initialized = false;

  private async initialize() {
    if (this.initialized) return;

    const createClient = await getSupabaseClient();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing for production environment');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    this.initialized = true;
  }

  async createOrUpdatePlayer(name: string): Promise<Player> {
    await this.initialize();
    
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }
    
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
    await this.initialize();
    
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }
    
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

  async getLeaderboard(limit: number = 10): Promise<Player[]> {
    await this.initialize();
    
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select('*')
        .order('score', { ascending: false })
        .order('updated_at', { ascending: false }) // Secondary sort by most recent
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []) as unknown as Player[];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  }

  async getPlayerRank(playerId: string): Promise<number | null> {
    await this.initialize();
    
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    try {
      // Get the player's score first
      const { data: playerData, error: playerError } = await this.supabase
        .from('players')
        .select('score')
        .eq('id', playerId)
        .single();

      if (playerError || !playerData) {
        return null;
      }

      // Count how many players have a higher score
      const { count, error: countError } = await this.supabase
        .from('players')
        .select('id', { count: 'exact' })
        .gt('score', playerData.score);

      if (countError) {
        throw countError;
      }

      // Rank is the count of players with higher scores + 1
      return (count || 0) + 1;
    } catch (error) {
      console.error('Error getting player rank:', error);
      return null;
    }
  }
}

export class SQLiteAdapter implements DatabaseAdapter {
  private databaseService: typeof import('./database').DatabaseService | null = null;
  private initialized = false;

  private async initialize() {
    if (this.initialized) return;
    
    this.databaseService = await getSQLiteService();
    this.initialized = true;
  }

  async createOrUpdatePlayer(name: string): Promise<Player> {
    await this.initialize();
    
    if (!this.databaseService) {
      throw new Error('Database service not initialized');
    }
    
    return this.databaseService.createOrUpdatePlayer(name);
  }

  async updatePlayerStats(playerId: string, score: number, totalAnswers: number): Promise<Player> {
    await this.initialize();
    
    if (!this.databaseService) {
      throw new Error('Database service not initialized');
    }
    
    return this.databaseService.updatePlayerStats(playerId, score, totalAnswers);
  }

  async getLeaderboard(limit: number = 10): Promise<Player[]> {
    await this.initialize();
    
    if (!this.databaseService) {
      throw new Error('Database service not initialized');
    }
    
    return this.databaseService.getLeaderboard(limit);
  }

  async getPlayerRank(playerId: string): Promise<number | null> {
    await this.initialize();
    
    if (!this.databaseService) {
      throw new Error('Database service not initialized');
    }
    
    return this.databaseService.getPlayerRank(playerId);
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
