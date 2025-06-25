import { Player } from '@/types/quiz';

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
    const response = await fetch('/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create or update player');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating/updating player:', error);
    throw new Error('Failed to create or update player');
  }
}

export async function updatePlayerStats(playerId: string, score: number, totalAnswers: number): Promise<Player> {
  try {
    const response = await fetch('/api/players', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerId, score, totalAnswers }),
    });

    if (!response.ok) {
      throw new Error('Failed to update player statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw new Error('Failed to update player statistics');
  }
}
