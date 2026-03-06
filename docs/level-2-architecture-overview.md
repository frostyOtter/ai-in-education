# AI-in-Education Platform - Level 2: Architecture Overview

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph "Frontend Layer"
        NextJS[Next.js 15 App]
        Components[React Components]
        State[Zustand State]
    end
    
    subgraph "Communication Layer"
        LiveKit[LiveKit Server]
        WebRTC[WebRTC]
    end
    
    subgraph "AI Layer"
        Agent[Voice Agent]
        STT[Speech-to-Text]
        LLM[Language Model]
        TTS[Text-to-Speech]
        Avatar[Bithuman Avatar]
    end
    
    subgraph "Backend Layer"
        API[FastAPI Backend]
        Routes[API Routes]
    end
    
    Browser --> NextJS
    Mobile --> NextJS
    NextJS --> Components
    Components --> State
    NextJS --> LiveKit
    LiveKit --> WebRTC
    WebRTC --> Agent
    Agent --> STT
    Agent --> LLM
    Agent --> TTS
    Agent --> Avatar
    NextJS --> API
    API --> Routes
```

## Core Components

### 1. Frontend (Next.js 15)

**Purpose**: Web application for students to browse courses, start lessons, and interact with AI teacher

**Key Features**:
- Server-side rendering for fast page loads
- Internationalization (i18n) with next-intl
- Responsive design with TailwindCSS
- Component library using shadcn/ui

**Pages Structure**:
```
/                    → Course catalog
/lessons/[slug]      → Course lessons list
/lesson/[id]         → Individual lesson page
/topic/[id]          → Topic details
/activity/[id]       → Learning activities
/result/[id]         → Lesson results
/avatars/[id]        → Avatar selection
/conversation        → Voice conversation UI
```

### 2. LiveKit Server

**Purpose**: Real-time audio/video communication infrastructure

**Responsibilities**:
- WebRTC signaling
- Media routing
- Room management
- Participant coordination

**Ports**:
- 7880: HTTP API
- 7881: WebSocket
- 7882: UDP (media)

### 3. Voice Agent (LiveKit Agents)

**Purpose**: AI-powered conversational agent that conducts English lessons

**Components**:

```mermaid
graph LR
    A[Audio Input] --> B[STT]
    B --> C[LLM]
    C --> D[TTS]
    D --> E[Audio Output]
    
    F[Lesson State] --> C
    C --> G[Function Tools]
    G --> H[Update Section]
    G --> I[End Lesson]
```

**Agent Capabilities**:
- Speech recognition (STT)
- Natural language understanding (LLM)
- Speech synthesis (TTS)
- Lesson state management
- Interactive tools

### 4. Backend (FastAPI)

**Purpose**: API server for data management and business logic

**Current State**: Minimal implementation
- Health check endpoints
- CORS configured
- Ready for expansion

## Data Flow

### Lesson Session Flow

```mermaid
sequenceDiagram
    participant S as Student
    participant W as Web App
    participant L as LiveKit
    participant A as AI Agent
    
    S->>W: Select lesson
    W->>L: Connect to room
    L->>A: Spawn agent
    A->>S: Greeting message
    S->>A: Speak response
    A->>A: Process (STT→LLM→TTS)
    A->>S: Audio response
    A->>W: Update lesson section
    loop Continue lesson
        S-->>A: Conversation
        A-->>S: Response
    end
    A->>W: End lesson
```

### Course Navigation Flow

```mermaid
graph TD
    A[Home Page] --> B{Choose Course}
    B --> C[View Lessons]
    C --> D[Select Lesson]
    D --> E[Start Voice Session]
    E --> F[Interact with AI]
    F --> G[Complete Section]
    G --> H{More Sections?}
    H -->|Yes| F
    H -->|No| I[View Results]
    I --> J[Activities]
    J --> K[Next Lesson]
```

## Deployment Architecture

```mermaid
graph TB
    subgraph Docker Environment
        Backend[Backend Container<br/>Port 8080]
        Agent[Voice Agent Container]
        LiveKit[LiveKit Container<br/>Ports 7880-7882]
    end
    
    subgraph External Services
        LLM_API[LLM API<br/>OpenAI/Anthropic]
        STT_API[STT API<br/>Deepgram]
        TTS_API[TTS API<br/>ElevenLabs]
        Avatar_API[Avatar API<br/>Bithuman]
    end
    
    Agent --> LLM_API
    Agent --> STT_API
    Agent --> TTS_API
    Agent --> Avatar_API
```

## Technology Decisions

### Why Next.js 15?
- Server components for performance
- Built-in routing and i18n
- React 19 support
- Excellent developer experience

### Why LiveKit?
- Production-ready WebRTC
- Built-in agent framework
- Scalable architecture
- Real-time media handling

### Why FastAPI?
- Fast async Python
- Automatic API documentation
- Type safety with Pydantic
- Easy to extend

### Why LiveKit Agents?
- Purpose-built for voice AI
- Integrated STT/LLM/TTS pipeline
- Function calling support
- Session management

## Scalability Considerations

**Horizontal Scaling**:
- Multiple agent workers
- Load balancing via LiveKit
- Stateless frontend

**Vertical Scaling**:
- GPU acceleration for AI models
- Increased container resources
- Database optimization (future)

## Security Measures

- HTTPS for all communications
- API key authentication
- CORS configuration
- Environment variable management
- Secure token generation for LiveKit
