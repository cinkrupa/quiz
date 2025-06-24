# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js 14 quiz application project with the following specifications:

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- OpenTDB API for trivia questions

## Project Structure
- Use App Router patterns (`app/` directory)
- Components should be in `src/components/`
- Utilities should be in `src/lib/`
- Keep API calls in separate service files

## Coding Guidelines
- Use TypeScript with proper type definitions
- Follow React Server Components and Client Components patterns
- Use shadcn/ui components for consistent UI
- Implement responsive design with Tailwind CSS
- Handle loading states and errors gracefully
- Use proper error boundaries for API failures

## Quiz Application Features
- Home page with "Start Quiz" button
- Fetch 10 multiple choice questions from OpenTDB API
- Display questions in individual cards
- Show 4 randomized answer options
- Provide immediate feedback on answers
- Track and display final score
- Smooth transitions between questions
