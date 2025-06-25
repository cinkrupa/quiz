import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const player = await DatabaseService.createOrUpdatePlayer(name);
    return NextResponse.json(player);
  } catch (error) {
    console.error('Error in player API:', error);
    return NextResponse.json(
      { error: 'Failed to create or update player' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { playerId, score, totalAnswers } = await request.json();
    
    if (!playerId || typeof score !== 'number' || typeof totalAnswers !== 'number') {
      return NextResponse.json(
        { error: 'playerId, score, and totalAnswers are required' },
        { status: 400 }
      );
    }

    const player = await DatabaseService.updatePlayerStats(playerId, score, totalAnswers);
    return NextResponse.json(player);
  } catch (error) {
    console.error('Error updating player stats:', error);
    return NextResponse.json(
      { error: 'Failed to update player statistics' },
      { status: 500 }
    );
  }
}
