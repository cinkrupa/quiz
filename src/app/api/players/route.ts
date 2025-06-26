import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAdapter } from '@/lib/database-adapter';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = getDatabaseAdapter();
    const player = await db.createOrUpdatePlayer(name);
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

    const db = getDatabaseAdapter();
    const player = await db.updatePlayerStats(playerId, score, totalAnswers);
    return NextResponse.json(player);
  } catch (error) {
    console.error('Error updating player stats:', error);
    return NextResponse.json(
      { error: 'Failed to update player statistics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'leaderboard') {
      const db = getDatabaseAdapter();
      const players = await db.getLeaderboard();
      return NextResponse.json({ players });
    }
    
    if (action === 'rank') {
      const playerId = searchParams.get('playerId');
      
      if (!playerId) {
        return NextResponse.json({ error: 'playerId is required' }, { status: 400 });
      }
      
      const db = getDatabaseAdapter();
      const rank = await db.getPlayerRank(playerId);
      return NextResponse.json({ rank });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in player API GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
