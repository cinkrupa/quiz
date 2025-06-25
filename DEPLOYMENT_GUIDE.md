# Deployment Guide: SQLite (Local) + Supabase (Production)

This guide explains how to deploy the quiz application with the dual database configuration.

## 🏠 Local Development (SQLite)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone and Install:**
   ```bash
   git clone <repository-url>
   cd quiz
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```bash
   USE_SUPABASE=false
   ```

3. **Start Development:**
   ```bash
   npm run dev
   ```

The SQLite database (`quiz.db`) will be created automatically on first run.

## 🚀 Production Deployment (Vercel + Supabase)

### Step 1: Set up Supabase

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up Database Schema:**
   - Go to SQL Editor in Supabase Dashboard
   - Run the following SQL:
   
   ```sql
   -- Create the players table
   create table if not exists public.players (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     score integer default 0,
     total_answers integer default 0,
     updated_at timestamp default now()
   );

   -- Enable Row Level Security (RLS)
   alter table public.players enable row level security;

   -- Create a policy that allows all operations
   create policy "Enable all operations for players" on public.players
   for all using (true);

   -- Create indexes for performance
   create index if not exists players_name_idx on public.players(name);
   create index if not exists players_updated_at_idx on public.players(updated_at desc);
   ```

### Step 2: Deploy to Vercel

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables:**
   In Vercel Dashboard → Project → Settings → Environment Variables, add:
   
   ```
   USE_SUPABASE=true
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically

## 🔧 Environment Variables Reference

### Local Development (.env.local)
```bash
# Use SQLite for local development
USE_SUPABASE=false

# Supabase credentials (optional for local)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Production (Vercel)
```bash
# Use Supabase for production
USE_SUPABASE=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🧪 Testing Both Environments

### Test Local SQLite
```bash
# Set environment
USE_SUPABASE=false

# Run locally
npm run dev

# Test features:
# 1. Create a player
# 2. Complete a quiz
# 3. Check stats persistence
# 4. Verify quiz.db file is created
```

### Test Supabase Locally
```bash
# Set environment
USE_SUPABASE=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Run locally
npm run dev

# Test features:
# 1. Create a player
# 2. Complete a quiz
# 3. Check Supabase dashboard for data
```

## 📁 File Structure
```
src/
├── lib/
│   ├── database.ts           # SQLite implementation
│   ├── database-adapter.ts   # Database abstraction layer
│   └── player-service.ts     # API client calls
├── app/api/players/
│   └── route.ts             # API endpoints using adapter
└── components/              # React components
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails with SQLite Errors:**
   - Ensure `USE_SUPABASE=true` in production
   - Verify Supabase credentials are set

2. **Supabase Connection Errors:**
   - Check URL and anon key are correct
   - Verify RLS policies are set up
   - Check network connectivity

3. **Environment Variables Not Working:**
   - Restart development server after changing .env.local
   - For Vercel, redeploy after changing environment variables

### Debug Commands
```bash
# Check which database is being used
console.log('Using Supabase:', process.env.USE_SUPABASE === 'true')

# Test database connection
npm run build  # Should succeed with both configurations
```

## 🔄 Switching Between Databases

### From SQLite to Supabase
1. Set `USE_SUPABASE=true`
2. Add Supabase credentials
3. Restart application
4. Data won't migrate automatically

### From Supabase to SQLite
1. Set `USE_SUPABASE=false`
2. Restart application
3. New SQLite database will be created
4. Previous Supabase data remains in cloud

## 📊 Database Comparison

| Feature | SQLite (Local) | Supabase (Production) |
|---------|----------------|----------------------|
| Setup | Automatic | Manual configuration |
| Cost | Free | Free tier + usage |
| Performance | Very fast | Network dependent |
| Scalability | Single user | Multi-user |
| Backup | Manual file copy | Automatic |
| Real-time | No | Yes |
| Offline | Yes | No |

Choose SQLite for development speed, Supabase for production scalability!
