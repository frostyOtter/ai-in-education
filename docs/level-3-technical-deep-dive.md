# AI-in-Education Platform - Level 3: Technical Deep Dive

## Application Structure

### Directory Layout

```
ai-in-education/
├── front-end/              # Next.js 15 application
│   ├── app/
│   │   ├── [locale]/      # Internationalized routes
│   │   │   ├── (user)/    # User-facing pages
│   │   │   └── api/       # API routes
│   │   └── globals.css    # Global styles
│   ├── components/        # React components
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utilities
│   ├── hooks/            # Custom hooks
│   ├── store/            # Zustand stores
│   ├── actions/          # Server actions
│   ├── types/            # TypeScript types
│   └── enum/             # Enums
│
├── backend/              # FastAPI application
│   ├── main.py          # Application entry
│   ├── routes/          # API routes
│   ├── data/            # Data storage
│   └── settings.py      # Configuration
│
├── voice-agents/        # LiveKit agents
│   ├── main.py         # Agent worker
│   ├── agent.py        # Agent logic
│   ├── models.py       # AI model initialization
│   ├── settings.py     # Configuration
│   └── prompt/         # Agent prompts
│       └── system_v2.py
│
└── docker-compose.yaml  # Service orchestration
```

## Frontend Architecture

### App Router Structure

```mermaid
graph TB
    subgraph "Root Layout"
        A[layout.tsx]
    end
    
    subgraph "Locale Route /[locale]"
        B[layout.tsx - i18n provider]
        
        subgraph "User Group /(user)"
            C[layout.tsx - sidebar]
            D[page.tsx - Home]
            E[lessons/ - Course list]
            F[lesson/[id]/ - Lesson detail]
            G[conversation/ - Voice UI]
            H[topic/[id]/ - Topics]
            I[activity/[id]/ - Activities]
            J[result/[id]/ - Results]
            K[avatars/[id]/ - Avatar picker]
        end
    end
    
    subgraph "API Routes /api"
        L[connection-details/]
        M[change-language/]
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    C --> H
    C --> I
    C --> J
    C --> K
    B --> L
    B --> M
```

### Component Hierarchy

```mermaid
graph TD
    A[Root Layout] --> B[Locale Provider]
    B --> C[Theme Provider]
    C --> D[User Layout]
    D --> E[Sidebar]
    D --> F[Header]
    D --> G[Main Content]
    
    E --> E1[Navigation Menu]
    E --> E2[Course List]
    E --> E3[Progress Stats]
    
    G --> G1[Courses Component]
    G --> G2[Lessons Component]
    G --> G3[LiveKit Room]
    G --> G4[Lesson Summary]
    
    G3 --> G3a[Audio Controls]
    G3 --> G3b[Transcription]
    G3 --> G3c[Avatar Display]
```

### State Management

**Zustand Store**:
```typescript
// Global state structure
interface AppState {
  user: UserState
  course: CourseState
  lesson: LessonState
  connection: ConnectionState
}
```

**Server Actions**:
- `getCourses()` - Fetch course catalog
- `getLessonById(id)` - Get lesson details
- `getTopics()` - Retrieve topic list

### Type System

```mermaid
classDiagram
    class Course {
        +string slug
        +string title
        +string description
        +Icon icon
        +Lesson[] lessons
    }
    
    class Lesson {
        +number id
        +string title
        +string description
        +Level level
        +number progress
        +boolean completed
        +string[] tags
    }
    
    class Topic {
        +number id
        +string title
        +string content
        +string[] vocabulary
    }
    
    class Connection {
        +string serverUrl
        +string roomName
        +string participantName
        +string accessToken
    }
    
    Course "1" --> "*" Lesson
    Lesson "1" --> "*" Topic
```

## Voice Agent Architecture

### Agent Session Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Initializing: Job Start
    Initializing --> Connecting: Load Models
    Connecting --> Ready: Room Connected
    Ready --> Listening: User Starts
    Listening --> Processing: Audio Received
    Processing --> Speaking: Response Ready
    Speaking --> Listening: Response Complete
    Listening --> Idle: Turn Ended
    Idle --> Listening: User Resumes
    Ready --> Disconnected: End Lesson
    Disconnected --> [*]: Cleanup
```

### Agent Pipeline

```mermaid
graph TB
    subgraph "Input Processing"
        A[Audio Stream] --> B[VAD - Voice Activity Detection]
        B --> C[STT - Speech to Text]
        C --> D[Transcript]
    end
    
    subgraph "AI Processing"
        D --> E[LLM - Language Model]
        E --> F[Tool Calling]
        F --> G{Function Tool?}
        G -->|Yes| H[Execute Tool]
        G -->|No| I[Generate Response]
        H --> I
    end
    
    subgraph "Output Processing"
        I --> J[TTS - Text to Speech]
        J --> K[Audio Output]
        K --> L[Avatar Animation]
    end
    
    subgraph "State Management"
        M[Lesson State] --> E
        H --> M
        N[Context] --> E
    end
```

### Function Tools

**1. update_lesson_section**:
```python
Purpose: Notify frontend of lesson section changes
Parameters: section_name (str)
Valid values: ["Introduction", "Main Activities", "Conclusion"]
Action: Sends RPC to client with section update
```

**2. end_lesson_section**:
```python
Purpose: Signal lesson completion
Parameters: None
Action: Sends RPC to client with end signal
```

### Agent Prompt Structure

```mermaid
graph LR
    A[System Prompt] --> B[Lesson Script]
    B --> C[Section 1: Greeting]
    B --> D[Section 2: Topic Introduction]
    B --> E[Section 3: Main Question]
    B --> F[Section 4: Follow-up Questions]
    
    C --> G[Tool: update_lesson_section]
    D --> G
    E --> G
    F --> G
    F --> H[Tool: end_lesson_section]
```

## LiveKit Integration

### Room Management

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server Action
    participant L as LiveKit Server
    participant A as Agent Worker
    
    C->>S: Request connection
    S->>S: Generate JWT token
    S->>C: Return connection details
    C->>L: Connect with token
    L->>L: Create room
    L->>A: Dispatch agent job
    A->>L: Join room
    L->>C: Agent joined event
    C->>A: Ready for interaction
```

### RPC Communication

**Client → Agent**:
- `start_turn` - Begin listening to user
- `end_turn` - Stop listening, process input
- `cancel_turn` - Discard current input

**Agent → Client**:
- `client.update_lesson_state` - Update UI state
  ```json
  {
    "type": "section_change" | "section_end",
    "value": "section_name" | "true"
  }
  ```

### Audio Configuration

```yaml
Input:
  - Audio num channels: 1 (mono)
  - Video: Disabled
  - Noise cancellation: Optional
  
Output:
  - Sync transcription: Enabled
  - Audio format: Opus
  - Sample rate: 48000 Hz
```

## Backend API

### Endpoints

**GET /** - Root health check
```json
Response: {
  "message": "Ready",
  "status": "healthy"
}
```

**GET /health** - Detailed health check
```json
Response: {
  "status": "healthy",
  "service": "backend"
}
```

**GET /api/connection-details** - LiveKit connection info
```json
Response: {
  "serverUrl": "wss://...",
  "roomName": "...",
  "participantName": "...",
  "accessToken": "..."
}
```

## Docker Configuration

### Service Definitions

```mermaid
graph TB
    subgraph "Docker Network: aie-network"
        Backend[aie-backend<br/>Port 8080]
        VoiceAgent[aie-voice-agent]
        LiveKit[aie-livekit-server<br/>Ports 7880, 7881, 7882/udp]
    end
    
    VoiceAgent -->|depends on| LiveKit
    
    subgraph "External APIs"
        LLM[LLM Provider]
        STT[STT Provider]
        TTS[TTS Provider]
        Avatar[Avatar Provider]
    end
    
    VoiceAgent -.->|API calls| LLM
    VoiceAgent -.->|API calls| STT
    VoiceAgent -.->|API calls| TTS
    VoiceAgent -.->|API calls| Avatar
```

### Container Configuration

**Backend**:
- Base: Python 3.12
- Port: 8080
- Platform: linux/arm64
- Restart: always

**Voice Agent**:
- Base: Python 3.12
- Platform: linux/arm64
- Dependencies: LiveKit server
- Environment: From .env file

**LiveKit Server**:
- Image: livekit/livekit-server:latest
- Mode: Development (--dev flag)
- Ports: 7880 (HTTP), 7881 (WS), 7882 (UDP)
- Volume: livekit-data for persistence

## Data Models

### Course Data Structure

```typescript
Course {
  slug: "environment"
  title: "Environment & Nature"
  description: "Learn about environmental issues..."
  icon: TreePineIcon
  lessons: [
    {
      id: 1
      title: "Introduction to Environment"
      level: "beginner"
      progress: 0
      completed: false
      tags: ["nature", "climate", "recycling"]
    },
    ...
  ]
}
```

### Lesson Session State

```python
@dataclass
class LessonState:
    ctx: JobContext       # LiveKit context
    type: str            # Event type
    value: str           # Event value
    
    Methods:
    - update_section(section_name)
    - end_section()
```

## Performance Optimizations

### Frontend
- Server Components for static content
- Turbopack for faster builds
- Image optimization via Next.js
- Code splitting per route
- Lazy loading of components

### Voice Agent
- Manual turn detection for control
- VAD threshold optimization (0.65)
- Connection timeouts (180s for TTS)
- Audio buffering for smooth playback

### Caching Strategy
- Static course data: Client-side cache
- Lesson content: Server-side cache
- LiveKit tokens: Generated per session
- API responses: No caching (real-time)

## Error Handling

### Frontend
- Error boundaries for React errors
- Suspense for async components
- Not found pages for invalid routes
- Toast notifications for user feedback

### Voice Agent
- Exception logging with Loguru
- Graceful degradation on API failures
- Retry logic for transient errors
- RPC error handling

### Backend
- FastAPI exception handlers
- CORS error responses
- Health check endpoints
- Structured logging

## Security Considerations

### Authentication
- LiveKit JWT tokens (short-lived)
- API key/secret for agent workers
- Environment variable management

### Data Protection
- HTTPS only in production
- Secure WebRTC connections
- No sensitive data in client storage
- CORS restrictions

### Access Control
- Room-based isolation
- Token-scoped permissions
- API rate limiting (future)
- Input validation
