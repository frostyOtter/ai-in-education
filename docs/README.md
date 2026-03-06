# AI-in-Education Platform Documentation

Welcome to the comprehensive documentation for the AI-in-Education platform. This documentation is organized into 4 levels of detail, from executive summary to complete implementation guide.

## Documentation Levels

### 📊 [Level 1: Executive Summary](./level-1-executive-summary.md)
**Audience**: Executives, stakeholders, non-technical readers
**Reading time**: 5 minutes

**What you'll learn**:
- What the platform does
- Key benefits and value proposition
- High-level technology overview
- Target users and use cases

**Best for**: Quick understanding of the platform's purpose and value

---

### 🏗️ [Level 2: Architecture Overview](./level-2-architecture-overview.md)
**Audience**: Technical managers, architects, developers
**Reading time**: 15-20 minutes

**What you'll learn**:
- Complete system architecture
- Component interactions and data flow
- Technology stack decisions
- Deployment architecture
- Scalability and security considerations

**Best for**: Understanding how the system is structured and why

---

### 🔧 [Level 3: Technical Deep Dive](./level-3-technical-deep-dive.md)
**Audience**: Developers, engineers
**Reading time**: 30-40 minutes

**What you'll learn**:
- Detailed directory structure
- Component implementation details
- API specifications
- Data models and types
- LiveKit integration details
- Performance optimizations
- Error handling strategies

**Best for**: Developers who need to understand the codebase structure

---

### 📚 [Level 4: Complete Implementation Guide](./level-4-implementation-guide.md)
**Audience**: Developers, DevOps engineers
**Reading time**: 60+ minutes

**What you'll learn**:
- Step-by-step environment setup
- Complete code walkthroughs
- Configuration reference
- Deployment guides (dev & prod)
- Testing and debugging procedures
- Troubleshooting common issues
- Performance monitoring

**Best for**: Developers implementing, deploying, or maintaining the platform

---

## Quick Navigation

### By Topic

**Getting Started**:
- [Environment Setup](./level-4-implementation-guide.md#environment-setup)
- [Quick Start](./level-4-implementation-guide.md#deployment-guide)

**Architecture**:
- [System Overview](./level-2-architecture-overview.md#system-architecture)
- [Component Details](./level-2-architecture-overview.md#core-components)

**Frontend**:
- [Frontend Architecture](./level-3-technical-deep-dive.md#frontend-architecture)
- [Component Hierarchy](./level-3-technical-deep-dive.md#component-hierarchy)
- [Implementation Guide](./level-4-implementation-guide.md#frontend-implementation)

**Voice Agent**:
- [Agent Architecture](./level-3-technical-deep-dive.md#voice-agent-architecture)
- [Agent Pipeline](./level-3-technical-deep-dive.md#agent-pipeline)
- [Complete Implementation](./level-4-implementation-guide.md#voice-agent-implementation)

**Backend**:
- [Backend Structure](./level-3-technical-deep-dive.md#backend-api)
- [API Implementation](./level-4-implementation-guide.md#backend-implementation)

**Integration**:
- [Data Flow](./level-2-architecture-overview.md#data-flow)
- [LiveKit Integration](./level-4-implementation-guide.md#integration-details)

**Deployment**:
- [Docker Configuration](./level-2-architecture-overview.md#deployment-architecture)
- [Deployment Guide](./level-4-implementation-guide.md#deployment-guide)

**Troubleshooting**:
- [Common Issues](./level-4-implementation-guide.md#troubleshooting)
- [Debugging Tips](./level-4-implementation-guide.md#testing--debugging)

---

## Architecture Diagrams

### System Overview
![System Architecture](./level-2-architecture-overview.md#system-architecture)

### Lesson Flow
![Lesson Session Flow](./level-2-architecture-overview.md#lesson-session-flow)

### Agent Pipeline
![Agent Pipeline](./level-3-technical-deep-dive.md#agent-pipeline)

### Complete Data Flow
![Complete Data Flow](./level-4-implementation-guide.md#complete-data-flow)

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Internationalization**: next-intl
- **Real-time Communication**: LiveKit Client SDK

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.12+
- **Package Manager**: uv
- **Server**: Uvicorn

### Voice Agent
- **Framework**: LiveKit Agents
- **Speech-to-Text**: Deepgram
- **Language Model**: OpenAI GPT-4
- **Text-to-Speech**: ElevenLabs
- **Avatar**: Bithuman

### Infrastructure
- **Container Runtime**: Docker
- **Orchestration**: Docker Compose
- **Real-time Server**: LiveKit Server
- **WebRTC**: Native browser support

---

## Key Features

### For Students
- 📚 Browse course catalog
- 🎯 Select lessons by topic and level
- 🎤 Real-time voice conversations with AI teacher
- 📊 Track learning progress
- 🌐 Multi-language support

### For Educators
- 🤖 AI-powered 1-on-1 tutoring
- 📈 Scalable to unlimited students
- 🕐 24/7 availability
- 📝 Structured curriculum
- 🎨 Customizable lessons

---

## Quick Start

### Prerequisites
```bash
# Check versions
node --version  # >= 20.x
python --version  # >= 3.12
docker --version  # >= 24.x
```

### Start Development
```bash
# 1. Install dependencies
cd front-end && npm install && cd ..
cd backend && uv sync && cd ..
cd voice-agents && uv sync && cd ..

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 3. Start services
docker compose up -d

# 4. Start frontend
cd front-end && npm run dev

# 5. Start backend (separate terminal)
cd backend && uvicorn main:app --reload --port 8080

# 6. Start voice agent (separate terminal)
cd voice-agents && python main.py
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **LiveKit Server**: ws://localhost:7880

---

## Development Workflow

### Making Changes

1. **Frontend Changes**:
   ```bash
   cd front-end
   npm run dev  # Auto-reload enabled
   npm run lint  # Check code quality
   ```

2. **Backend Changes**:
   ```bash
   cd backend
   uvicorn main:app --reload  # Auto-reload enabled
   ```

3. **Voice Agent Changes**:
   ```bash
   cd voice-agents
   python main.py  # Restart manually for changes
   ```

### Testing

```bash
# Frontend
cd front-end
npm run lint
npm run build

# Backend
cd backend
python -m pytest  # When tests are added

# Integration
docker compose up --build
```

---

## Project Structure

```
ai-in-education/
├── front-end/          # Next.js 15 web application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities
│   └── types/        # TypeScript types
│
├── backend/          # FastAPI backend
│   ├── main.py      # Application entry
│   ├── routes/      # API routes
│   └── data/        # Data storage
│
├── voice-agents/    # LiveKit voice agents
│   ├── main.py     # Agent worker
│   ├── agent.py    # Agent logic
│   ├── models.py   # AI models
│   └── prompt/     # Agent prompts
│
├── docs/            # Documentation (you are here)
│   ├── README.md
│   ├── level-1-executive-summary.md
│   ├── level-2-architecture-overview.md
│   ├── level-3-technical-deep-dive.md
│   └── level-4-implementation-guide.md
│
├── docker-compose.yaml  # Service orchestration
├── AGENTS.md           # Agent coding guidelines
└── README.md          # Project overview
```

---

## Contributing

### Code Style

**TypeScript/React**:
- Use `type` for simple shapes, `interface` for props
- PascalCase components, camelCase functions
- Use `cn()` for className merging
- Follow shadcn/ui patterns

**Python**:
- Type hints on all functions
- Use Pydantic for settings and validation
- Async/await for async operations
- Loguru for logging

### Before Committing

```bash
# Frontend
cd front-end
npm run lint

# Backend
cd backend
# Ensure type safety

# Test integration
docker compose up --build
```

---

## Support

### Documentation
- Browse the 4 levels of documentation above
- Check the troubleshooting section in Level 4

### Issues
- Check existing issues in the repository
- Create new issues with:
  - Clear description
  - Steps to reproduce
  - Expected vs actual behavior
  - Logs and screenshots

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [LiveKit Documentation](https://docs.livekit.io)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [LiveKit Agents](https://docs.livekit.io/agents)

---

## License

[Add license information here]

---

## Version History

- **v1.0.0** - Initial release
  - Course catalog and browsing
  - Voice agent integration
  - LiveKit real-time communication
  - Basic backend API

---

**Happy Learning! 🎓**
