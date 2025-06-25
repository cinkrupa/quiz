# Local SQLite Database Setup

This quiz application now uses a local SQLite database for development instead of Supabase. This provides a simpler setup without requiring external services or Docker.

## Features

- **Local SQLite Database**: All player data is stored locally in `quiz.db`
- **Automatic Schema Creation**: Database tables are created automatically on first run
- **API Routes**: Database operations are handled through Next.js API routes
- **Persistent Storage**: Player data persists between application restarts
- **No External Dependencies**: No need for Supabase, Docker, or external database services

## Database Schema

The application creates a `players` table with the following structure:

```sql
CREATE TABLE players (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### POST /api/players
Creates a new player or returns an existing one by name.

**Request Body:**
```json
{
  "name": "Player Name"
}
```

**Response:**
```json
{
  "id": "unique-id",
  "name": "Player Name",
  "score": 0,
  "total_answers": 0,
  "updated_at": "2025-06-25T08:30:00.000Z"
}
```

### PUT /api/players
Updates player statistics after completing a quiz.

**Request Body:**
```json
{
  "playerId": "unique-id",
  "score": 8,
  "totalAnswers": 10
}
```

**Response:**
```json
{
  "id": "unique-id",
  "name": "Player Name",
  "score": 8,
  "total_answers": 10,
  "updated_at": "2025-06-25T08:35:00.000Z"
}
```

## Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## Database Files

- `quiz.db` - Main SQLite database file
- `quiz.db-shm` - Shared memory file (created automatically)
- `quiz.db-wal` - Write-ahead log file (created automatically)

All database files are automatically excluded from git via `.gitignore`.

## Migration from Supabase

If you want to switch back to Supabase in the future:

1. Update `src/lib/player-service.ts` to use Supabase client
2. Update `.env.local` with Supabase credentials
3. Remove the SQLite database files
4. Update the API routes to use Supabase instead of SQLite

## Benefits of SQLite for Development

- ✅ No external services required
- ✅ Faster development setup
- ✅ Works offline
- ✅ No configuration needed
- ✅ Persistent data storage
- ✅ Zero cost for development
