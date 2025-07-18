# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with turbopack
- `npm run dev:daemon` - Start development server in background with logs
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run setup` - Install dependencies, generate Prisma client, and run migrations
- `npm run db:reset` - Reset database with force flag

## Architecture Overview

This is a Next.js 15 application called UIGen that generates React components using AI. The application features:

### Core Components
- **Virtual File System** (`src/lib/file-system.ts`): In-memory file system that manages generated component files without writing to disk
- **AI Chat Interface** (`src/components/chat/`): Handles user interactions with Claude AI for component generation
- **Code Editor** (`src/components/editor/`): Monaco-based code editor with syntax highlighting
- **Live Preview** (`src/components/preview/`): Real-time preview of generated components

### Key Architecture Patterns
- **Context-based State Management**: Uses React Context for file system and chat state
- **Tool-based AI Integration**: AI uses tools (`str_replace_editor`, `file_manager`) to manipulate the virtual file system
- **Serialization/Deserialization**: Virtual file system can be serialized to JSON for persistence in database

### Database Structure
- **SQLite + Prisma**: Simple schema with `User` and `Project` models
- **Projects**: Store serialized file system state and chat messages
- **Anonymous Support**: Application works without authentication

### AI Integration
- **Anthropic Claude**: Primary AI provider via Vercel AI SDK
- **Tool Calling**: AI can create, modify, and delete files through structured tools
- **Fallback Mode**: Works without API key using static code responses

### File Organization
- `src/app/` - Next.js app router pages and API routes
- `src/components/` - Reusable UI components organized by feature
- `src/lib/` - Core utilities, contexts, and business logic
- `src/actions/` - Server actions for database operations
- `prisma/` - Database schema and migrations

The application is designed to be self-contained with minimal external dependencies, focusing on real-time component generation and preview capabilities.

### Database Reference
- The database schema is defined in the @prisma/schema.prisma file. Reference it anytime you need to understand the structure of data stored in the database.