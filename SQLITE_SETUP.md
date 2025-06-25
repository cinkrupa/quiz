# Database Configuration - SQLite (Local) & Supabase (Production)

This quiz application uses a flexible database architecture:
- **Local Development**: SQLite database for fast, offline development
- **Production (Vercel)**: Supabase for scalable cloud database

## Environment-Based Database Selection

The application automatically chooses the database based on:
1. `NODE_ENV=production` → Uses Supabase
2. `USE_SUPABASE=true` → Forces Supabase usage
3. Default (development) → Uses SQLite

## Local Development (SQLite)

### Features
- **Local SQLite Database**: All player data stored locally in `quiz.db`
- **Automatic Schema Creation**: Database tables created automatically on first run
- **No External Dependencies**: No need for Supabase, Docker, or internet connection
- **Fast Development**: Instant database operations without network latency

### Configuration
```bash
# .env.local
USE_SUPABASE=false
```

## Production Deployment (Supabase)

### Features
- **Cloud Database**: Persistent data across deployments
- **Scalable**: Handles multiple concurrent users
- **Real-time**: Built-in real-time capabilities
- **Backup & Recovery**: Automated backups

### Configuration
Set these environment variables in Vercel:
```bash
USE_SUPABASE=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Schema

Both SQLite and Supabase use the same schema:

```sql
CREATE TABLE players (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),  -- SQLite
  -- id uuid PRIMARY KEY DEFAULT gen_random_uuid(),   -- Supabase
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

## Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and set USE_SUPABASE=false
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

The SQLite database will be created automatically at `quiz.db`.

## Production Deployment

1. **Set up Supabase:**
   - Create a Supabase project
   - Run the SQL from `database-setup.sql`
   - Get your project URL and anon key

2. **Configure Vercel:**
   ```bash
   # Set environment variables in Vercel dashboard:
   USE_SUPABASE=true
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Deploy:**
   ```bash
   npm run build  # Test locally first
   # Deploy to Vercel
   ```

## Database Files (Local Only)

- `quiz.db` - Main SQLite database file
- `quiz.db-shm` - Shared memory file (created automatically)
- `quiz.db-wal` - Write-ahead log file (created automatically)

All database files are excluded from git via `.gitignore`.

## Switching Between Databases

### Force Supabase in Development
```bash
# .env.local
USE_SUPABASE=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Use SQLite in Production (not recommended)
```bash
# Vercel environment variables
USE_SUPABASE=false
```

## Benefits

### SQLite (Development)
- ✅ No external services required
- ✅ Faster development setup
- ✅ Works offline
- ✅ Zero cost for development
- ✅ Instant database operations

### Supabase (Production)
- ✅ Cloud-hosted and scalable
- ✅ Built-in authentication (if needed later)
- ✅ Real-time capabilities
- ✅ Automatic backups
- ✅ Multi-user support
