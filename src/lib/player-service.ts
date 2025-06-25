import { supabase, Player } from '@/lib/supabase';

// List of animals for anonymous player names
const ANIMALS = [
  'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Monkey', 'Panda', 'Koala',
  'Kangaroo', 'Dolphin', 'Whale', 'Shark', 'Eagle', 'Owl', 'Penguin', 'Flamingo',
  'Butterfly', 'Bee', 'Ladybug', 'Spider', 'Cat', 'Dog', 'Rabbit', 'Hamster',
  'Horse', 'Cow', 'Pig', 'Sheep', 'Goat', 'Duck', 'Swan', 'Turkey', 'Fox',
  'Wolf', 'Bear', 'Deer', 'Squirrel', 'Raccoon', 'Hedgehog', 'Turtle'
];

export function generateAnonymousName(): string {
  const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `Anonymous ${randomAnimal}`;
}

export async function createOrUpdatePlayer(name: string): Promise<Player> {
  try {
    // First, check if player already exists
    const { data: existingPlayer, error: fetchError } = await supabase
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
      return existingPlayer;
    }

    // Player doesn't exist, create new one
    const newPlayer: Omit<Player, 'id' | 'updated_at'> = {
      name,
      score: 0,
      total_answers: 0,
    };

    const { data, error } = await supabase
      .from('players')
      .insert([newPlayer])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating/updating player:', error);
    throw new Error('Failed to create or update player');
  }
}

export async function updatePlayerStats(playerId: string, score: number, totalAnswers: number): Promise<Player> {
  try {
    const { data: existingPlayer, error: fetchError } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const newScore = existingPlayer.score + score;
    const newTotalAnswers = existingPlayer.total_answers + totalAnswers;

    const { data, error } = await supabase
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

    return data;
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw new Error('Failed to update player statistics');
  }
}
