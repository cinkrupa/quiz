import Database from 'better-sqlite3';
import path from 'path';
import { Player } from '@/types/quiz';

// Create database connection
const dbPath = path.join(process.cwd(), 'quiz.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    total_answers INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS players_name_idx ON players(name);
  CREATE INDEX IF NOT EXISTS players_updated_at_idx ON players(updated_at DESC);
`);

// Prepared statements for better performance
const insertPlayer = db.prepare(`
  INSERT INTO players (name, score, total_answers)
  VALUES (?, ?, ?)
  RETURNING *
`);

const selectPlayerByName = db.prepare(`
  SELECT * FROM players WHERE name = ?
`);

const selectPlayerById = db.prepare(`
  SELECT * FROM players WHERE id = ?
`);

const updatePlayerStats = db.prepare(`
  UPDATE players 
  SET score = ?, total_answers = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
  RETURNING *
`);

export class DatabaseService {
  static async createOrUpdatePlayer(name: string): Promise<Player> {
    try {
      // First, check if player already exists
      const existingPlayer = selectPlayerByName.get(name) as Player | undefined;

      if (existingPlayer) {
        // Player exists, return existing data
        return {
          ...existingPlayer,
          id: existingPlayer.id || '',
        };
      }

      // Player doesn't exist, create new one
      const newPlayer = insertPlayer.get(name, 0, 0) as Player;
      
      return {
        ...newPlayer,
        id: newPlayer.id || '',
      };
    } catch (error) {
      console.error('Error creating/updating player:', error);
      throw new Error('Failed to create or update player');
    }
  }

  static async updatePlayerStats(playerId: string, score: number, totalAnswers: number): Promise<Player> {
    try {
      // Get existing player data
      const existingPlayer = selectPlayerById.get(playerId) as Player | undefined;
      
      if (!existingPlayer) {
        throw new Error('Player not found');
      }

      const newScore = existingPlayer.score + score;
      const newTotalAnswers = existingPlayer.total_answers + totalAnswers;

      const updatedPlayer = updatePlayerStats.get(newScore, newTotalAnswers, playerId) as Player;
      
      return {
        ...updatedPlayer,
        id: updatedPlayer.id || '',
      };
    } catch (error) {
      console.error('Error updating player stats:', error);
      throw new Error('Failed to update player statistics');
    }
  }

  static close() {
    db.close();
  }
}

// Graceful shutdown
process.on('exit', () => DatabaseService.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
