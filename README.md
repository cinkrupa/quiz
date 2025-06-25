# Quiz Application - Next.js with Local SQLite Database

Interactive quiz application built with Next.js 14 using App Router, TypeScript, Tailwind CSS, shadcn/ui, and local SQLite database for development.

## Ì∫Ä Features

- **Player Setup** - Enter custom name or get auto-generated anonymous name
- **Quiz Settings** - Choose from 25+ categories and 3 difficulty levels  
- **10 Multiple Choice Questions** - Fetched from Open Trivia DB API
- **Interactive Question Cards** - With randomly arranged answers
- **Immediate Feedback** - Visual feedback after selecting answers
- **Score Tracking** - Real-time progress and final results
- **Player Statistics** - Persistent stats across quiz sessions
- **Responsive Design** - Works perfectly on all devices
- **Smooth Transitions** - Clean animations between game phases
- **Local Database** - SQLite for development (no external services needed)

## Ìª†Ô∏è Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **SQLite** for local database storage
- **OpenTDB API** for trivia questions

## Ì≥¶ Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd quiz
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The SQLite database will be created automatically on first run. No additional setup required!

## Ì∑ÑÔ∏è Database

This application uses a local SQLite database for development:

- **Database File**: `quiz.db` (created automatically)
- **Player Data**: Name, score, total answers, and timestamps
- **API Routes**: `/api/players` for database operations
- **Persistent Storage**: Data survives application restarts

See [SQLITE_SETUP.md](SQLITE_SETUP.md) for detailed database information.

## Ì¥ß Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## ÌæÆ How to Play

1. **Enter Your Name** - Or get a fun anonymous name like "Anonymous Lion"
2. **Choose Category** - Select from topics like Science, Sports, History, etc.
3. **Pick Difficulty** - Easy, Medium, or Hard
4. **Answer Questions** - 10 multiple choice questions with immediate feedback
5. **View Results** - See your score and cumulative statistics

Built with ‚ù§Ô∏è using Next.js, TypeScript, and SQLite
