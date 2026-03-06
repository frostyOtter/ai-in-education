# AGENTS.md

This file provides guidelines for agentic coding agents working in this AI-in-Education codebase.

## Project Structure

- `front-end/` - Next.js 15 + TypeScript + React 19 + TailwindCSS + shadcn/ui
- `backend/` - FastAPI (Python 3.12+)
- `voice-agents/` - LiveKit agents (Python 3.12+)

## Build/Lint/Test Commands

### Front-end (TypeScript/React)
```bash
cd front-end
npm run dev              # Start dev server with Turbopack
npm run dev:https        # Start dev server with HTTPS
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Backend (Python)
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

### Voice Agents (Python)
```bash
cd voice-agents
python main.py start
```

### Docker Services
```bash
docker compose up voice-agents --build    # Build and start voice-agents
docker compose up backend --build          # Build and start backend
```

**Note**: No test framework is currently configured. Tests should be added in the future.

## Code Style Guidelines

### TypeScript/React (Front-end)

#### Imports
Order: std lib → external → internal (using `@/` alias)
```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

#### Types
- Use `type` for simple shapes and `interface` for component props
- Use `enum` for fixed values (see `enum/course.ts`)
- Type definitions in `types/`, enums in `enum/`

#### Components
- Default to Server Components, use `"use client"` directive for client components
- PascalCase for components, camelCase for variables/functions
- kebab-case for file names
- Use shadcn/ui components from `@/components/ui/`

#### Styling
- TailwindCSS for styling
- Use `cn()` utility from `@/lib/utils` for className merging
- Radix UI primitives with custom variants using class-variance-authority

#### State Management
- Zustand for global state (in `store/`)
- Custom hooks in `hooks/`
- Server actions in `actions/` for data fetching

#### Next.js Conventions
- App Router with `[locale]` for internationalization
- API routes in `app/api/`
- Use `next-intl` for i18n

#### Error Handling
- Loguru for logging in Python, console.log for frontend
- No formal error boundary patterns yet

### Python (Backend/Voice Agents)

#### Imports
Standard library → external packages → local modules
```python
from fastapi import FastAPI
from loguru import logger
from agent import Assistant
```

#### Code Style
- Use dataclasses for simple data structures
- Use Pydantic for settings and validation
- Type hints on all functions
- Async/await for async operations
- Loguru for logging with `logger.info/error/debug`

#### File Structure
- `main.py` - Entry point
- `settings.py` - Configuration using Pydantic Settings
- `models.py` - Data models and initialization functions
- Separate route files in `routes/` for larger projects

#### Dependencies
- Use `uv` package manager (not pip)
- Dependencies in `pyproject.toml` locked with `uv.lock`

#### Voice Agents Specific
- Use LiveKit agents framework
- Function tools decorated with `@function_tool`
- Session management with `AgentSession`
- Bithuman avatar integration for visual agents

## General Guidelines

- Add comments only when explicitly requested
- Follow existing patterns in the codebase
- When adding new features, follow the structure of similar existing features
- Use existing libraries rather than introducing new ones
- Run `npm run lint` (front-end) after changes
- No automated tests yet - verify manually

## Docker

All services configured in `docker-compose.yaml`:
- Backend runs on port 8080
- Voice agents depend on livekit-server
- Network: aie-network

## Environment

Front-end uses `.env.example` as template.
Backend and voice-agents read `.env` in root directory.
