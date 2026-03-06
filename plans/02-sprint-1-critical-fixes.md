# Sprint 1: Critical Fixes

## Overview
**Duration**: 2-3 days
**Goal**: Fix all critical issues preventing production readiness
**Priority**: HIGH - Must complete before moving to other phases

---

## Task 1.1: Docker Fixes
**Estimated Time**: 2 hours

### Subtasks
- [ ] Fix `backend/Dockerfile:2` - Change `python:3.14-slim` → `python:3.12-slim`
- [ ] Verify voice-agents Dockerfile uses correct Python version
- [ ] Test build: `docker compose build`
- [ ] Test startup: `docker compose up -d`
- [ ] Verify all containers start successfully
- [ ] Test shutdown: `docker compose down`
- [ ] Test volume cleanup: `docker compose down -v`

### Commands to Run
```bash
# Build all services
docker compose build

# Start all services
docker compose up -d

# Check container status
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down

# Cleanup (includes volumes)
docker compose down -v
```

### Acceptance Criteria
- All Dockerfiles use valid Python 3.12 base images
- `docker compose build` completes without errors
- All containers start and run successfully
- No warnings in docker logs
- Cleanup works properly

---

## Task 1.2: Security Fixes
**Estimated Time**: 3 hours

### Subtasks
- [ ] Remove `allow_origins=["*"]` from `backend/main.py:11`
- [ ] Add environment-based CORS configuration
- [ ] Create `backend/settings.py` (template for now)
- [ ] Update `docker-compose.yaml` to pass CORS origins
- [ ] Test CORS with allowed origins
- [ ] Test CORS with disallowed origins (should fail)
- [ ] Review docker-compose for other security issues

### Code Changes

**backend/main.py** - Update CORS configuration:
```python
from fastapi.middleware.cors import CORSMiddleware
from settings import get_settings

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**backend/settings.py** - Create CORS settings:
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Existing settings...
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    class Config:
        env_file = ".env"
        extra = "ignore"

def get_settings() -> Settings:
    return Settings()
```

**docker-compose.yaml** - Add CORS origins:
```yaml
backend:
  environment:
    - CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
```

### Acceptance Criteria
- CORS no longer allows all origins
- Frontend can still connect to backend
- External domains are blocked
- Settings properly loaded from environment
- Documentation updated with CORS configuration

---

## Task 1.3: Next.js Configuration
**Estimated Time**: 1 hour

### Subtasks
- [ ] Enable `reactStrictMode: true` in `front-end/next.config.ts:5`
- [ ] Remove `eslint: { ignoreBuildErrors: true }`
- [ ] Remove `typescript: { ignoreBuildErrors: true }`
- [ ] Run `npm run build` and fix any errors
- [ ] Run `npm run lint` and fix any linting errors
- [ ] Test application still works after changes

### Code Changes

**front-end/next.config.ts**:
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,  // Changed from false
  async headers() {
    // ... existing code
  },
  output: "standalone",
  // Removed eslint and typescript ignoreBuildErrors
  devIndicators: false,
};
```

### Commands to Run
```bash
cd front-end

# Check for linting errors
npm run lint

# Try to build
npm run build

# If build fails, fix errors and try again
npm run build

# Run dev server to verify
npm run dev
```

### Acceptance Criteria
- `reactStrictMode` is enabled
- Build passes without ignoring errors
- Linting passes
- Application runs correctly
- No console warnings/errors

---

## Task 1.4: Logging & Monitoring
**Estimated Time**: 4 hours

### Subtasks
- [ ] Add Loguru to backend dependencies
- [ ] Configure structured logging in backend
- [ ] Add logging middleware to backend
- [ ] Add error tracking to frontend (Sentry or simple console.error wrapper)
- [ ] Add health check endpoint improvements
- [ ] Test logging output
- [ ] Document logging levels and format

### Code Changes

**backend/pyproject.toml** - Add Loguru:
```toml
dependencies = [
    "fastapi>=0.116.1",
    "loguru>=0.7.3",
    "uvicorn>=0.35.0",
]
```

**backend/main.py** - Add logging:
```python
from loguru import logger
import sys

# Remove default handler
logger.remove()

# Add stdout handler with INFO level
logger.add(sys.stdout, level="INFO")

# Add file handler for ERROR level
logger.add("logs/error.log", level="ERROR", rotation="10 MB")

# Add logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response

# Update endpoints with logging
@app.get("/")
async def root():
    logger.info("Health check requested")
    return {"message": "Ready", "status": "healthy"}

@app.get("/health")
async def health_check():
    logger.debug("Detailed health check")
    return {
        "status": "healthy",
        "service": "backend",
        "timestamp": logger.info("Health check completed")
    }
```

**front-end/lib/error-helper.ts** - Improve error handling:
```typescript
export const ErrorHelper = (message: string, error: unknown) => {
  console.error(`[ERROR] ${message}`, error);

  // Log to external service (Sentry, LogRocket, etc.) in production
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error);
  }
};
```

### Acceptance Criteria
- Structured logging in place for backend
- Error tracking for frontend
- Health check returns useful information
- Logs are readable and searchable
- Logs include timestamps and request info

---

## Sprint 1 Checklist

### Docker
- [ ] backend/Dockerfile uses Python 3.12
- [ ] voice-agents/Dockerfile uses Python 3.12
- [ ] All services build successfully
- [ ] All services start successfully
- [ ] Cleanup works properly

### Security
- [ ] CORS properly configured
- [ ] Environment variables used
- [ ] No `allow_origins=["*"]`
- [ ] Tested with allowed/disallowed origins

### Next.js
- [ ] `reactStrictMode: true`
- [ ] No build error ignoring
- [ ] Linting passes
- [ ] Application works correctly

### Logging
- [ ] Loguru configured in backend
- [ ] Error tracking in frontend
- [ ] Health check improved
- [ ] Logs are structured

### Testing
- [ ] All containers build and run
- [ ] Frontend can connect to backend
- [ ] No console errors
- [ ] No Docker warnings

---

## Definition of Done

A task is considered complete when:
- [ ] All subtasks are checked off
- [ ] Code changes are committed
- [ ] Changes are tested locally
- [ ] No regressions introduced
- [ ] Acceptance criteria met

A sprint is considered complete when:
- [ ] All tasks in the sprint are complete
- [ ] All acceptance criteria met
- [ ] No critical bugs remaining
- [ ] Code is ready for review/deployment

---

## Blocked By

None - this sprint has no dependencies on other sprints

---

## Risks

- **Medium Risk**: Enabling strict mode may reveal existing bugs
  - **Mitigation**: Fix bugs as they appear, don't disable strict mode again

- **Low Risk**: CORS changes may break local development
  - **Mitigation**: Add localhost to allowed origins for development

---

## Notes

- This is the foundation for all future work
- Take time to do this right - rushing here will cause problems later
- Document any deviations from this plan
- Keep changes minimal and focused

---

## Next Sprint

After completing Sprint 1, proceed to **Sprint 2: Backend MVP**
