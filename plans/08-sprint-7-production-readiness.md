# Sprint 7: Production Readiness

## Overview
**Duration**: 1 week
**Goal**: Prepare application for production deployment
**Priority**: HIGH - Essential for production
**Depends On**: Sprint 6 (Data Persistence)

---

## Task 7.1: Performance Optimization
**Estimated Time**: 12 hours

### Subtasks

#### 7.1.1: Database Optimization
- [ ] Add database indexes
- [ ] Optimize slow queries
- [ ] Add connection pooling
- [ ] Configure query caching
- [ ] Test query performance

#### 7.1.2: API Caching
- [ ] Add Redis to docker-compose
- [ ] Configure Redis connection
- [ ] Add caching to GET endpoints
- [ ] Implement cache invalidation
- [ ] Test cache hit rates

#### 7.1.3: Frontend Optimization
- [ ] Analyze bundle size
- [ ] Implement code splitting
- [ ] Lazy load components
- [ ] Optimize images
- [ ] Add CDN support

### Code Changes

**docker-compose.yaml** - Add Redis:
```yaml
services:
  # ... existing services ...

  redis:
    container_name: aie-redis
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - aie-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  aie-network:
    driver: bridge

volumes:
  postgres-data:
  livekit-data:
  redis-data:
```

**backend/database.py** - Add indexes:
```python
from sqlalchemy import Index

class User(Base):
    __tablename__ = "users"

    # ... existing columns ...

    __table_args__ = (
        Index('idx_user_email', 'email'),
    )

class Session(Base):
    __tablename__ = "sessions"

    # ... existing columns ...

    __table_args__ = (
        Index('idx_session_user', 'user_id'),
        Index('idx_session_course', 'course_slug'),
    )

class Progress(Base):
    __tablename__ = "progress"

    # ... existing columns ...

    __table_args__ = (
        Index('idx_progress_user', 'user_id'),
        Index('idx_progress_course', 'course_slug'),
    )
```

**backend/cache.py** (Create new file):
```python
from redis import Redis
from json import dumps, loads
from settings import get_settings
from loguru import logger

settings = get_settings()

# Create Redis client
redis_client = Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=0,
    decode_responses=True
)

class CacheService:
    """Cache service for caching API responses"""

    @staticmethod
    def get(key: str):
        """Get value from cache"""
        try:
            value = redis_client.get(key)
            if value:
                return loads(value)
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None

    @staticmethod
    def set(key: str, value, ttl: int = 3600):
        """Set value in cache"""
        try:
            redis_client.setex(key, ttl, dumps(value))
        except Exception as e:
            logger.error(f"Cache set error: {e}")

    @staticmethod
    def delete(key: str):
        """Delete value from cache"""
        try:
            redis_client.delete(key)
        except Exception as e:
            logger.error(f"Cache delete error: {e}")

    @staticmethod
    def delete_pattern(pattern: str):
        """Delete all keys matching pattern"""
        try:
            keys = redis_client.keys(pattern)
            if keys:
                redis_client.delete(*keys)
        except Exception as e:
            logger.error(f"Cache delete pattern error: {e}")
```

**backend/routes/avatars.py** - Add caching:
```python
from cache import CacheService
import hashlib

router = APIRouter(prefix="/api/avatars", tags=["avatars"])

@router.get("", response_model=List[Avatar])
async def list_avatars(db: Session = Depends(get_db)):
    """List all available avatars (cached)"""
    cache_key = "avatars:all"

    # Try cache first
    cached = CacheService.get(cache_key)
    if cached:
        logger.info("Returning cached avatars")
        return cached

    # Cache miss - fetch from DB
    logger.info("Fetching avatars from database")
    avatars = db.query(database.Avatar).all()
    result = [Avatar(...) for a in avatars]

    # Cache for 1 hour
    CacheService.set(cache_key, result, ttl=3600)

    return result
```

**front-end/next.config.ts** - Optimization:
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },

  // Bundle optimization
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output optimization
  output: 'standalone',

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      },
    ];
  },
};
```

### Acceptance Criteria
- Database queries optimized
- Caching implemented
- Bundle size reduced
- Performance improved

---

## Task 7.2: Monitoring & Observability
**Estimated Time**: 10 hours

### Subtasks

#### 7.2.1: Application Monitoring
- [ ] Add Prometheus metrics
- [ ] Configure metrics collection
- [ ] Add custom metrics
- [ ] Test metrics endpoint

#### 7.2.2: Error Tracking
- [ ] Add Sentry to backend
- [ ] Add Sentry to frontend
- [ ] Configure error alerts
- [ ] Test error tracking

#### 7.2.3: Logging
- [ ] Structured logging
- [ ] Log aggregation
- [ ] Log rotation
- [ ] Log levels configured

### Code Changes

**backend/metrics.py** (Create new file):
```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import Response
from loguru import logger

# Metrics
request_count = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

active_sessions = Gauge(
    'active_sessions',
    'Number of active sessions'
)

active_users = Gauge(
    'active_users',
    'Number of active users'
)

def metrics_endpoint():
    """Prometheus metrics endpoint"""
    return Response(
        content=generate_latest(),
        media_type="text/plain"
    )
```

**backend/main.py** - Add metrics endpoint:
```python
from metrics import metrics_endpoint, request_count, request_duration
import time

@app.middleware("http")
async def track_requests(request, call_next):
    """Track request metrics"""
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time

    # Record metrics
    request_count.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    request_duration.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)

    return response

@app.get("/metrics")
async def metrics():
    """Prometheus metrics"""
    return metrics_endpoint()
```

**backend/sentry.py** (Create new file):
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.loguru import LoguruIntegration
from settings import get_settings

settings = get_settings()

def init_sentry():
    """Initialize Sentry error tracking"""
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            integrations=[
                FastApiIntegration(),
                LoguruIntegration()
            ],
            traces_sample_rate=0.1,
            environment=settings.ENVIRONMENT,
            release=settings.VERSION
        )
        logger.info("Sentry initialized")
```

**backend/settings.py** - Add monitoring settings:
```python
class Settings(BaseSettings):
    # ... existing settings ...

    # Monitoring
    SENTRY_DSN: str = ""
    ENVIRONMENT: str = "development"
    VERSION: str = "1.0.0"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
```

### Acceptance Criteria
- Metrics collected
- Error tracking working
- Logging structured
- Alerts configured

---

## Task 7.3: Deployment Configuration
**Estimated Time**: 10 hours

### Subtasks

#### 7.3.1: Docker Production Config
- [ ] Create production docker-compose
- [ ] Configure resource limits
- [ ] Add health checks
- [ ] Configure restart policies

#### 7.3.2: Reverse Proxy
- [ ] Add nginx to docker-compose
- [ ] Configure SSL/TLS
- [ ] Configure load balancing
- [ ] Configure security headers

#### 7.3.3: Environment Management
- [ ] Create production .env template
- [ ] Document all env vars
- [ ] Add secrets management
- [ ] Add config validation

### Code Changes

**docker-compose.prod.yml** (Create new file):
```yaml
version: '3.8'

services:
  backend:
    container_name: aie-backend-prod
    restart: unless-stopped
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/db
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - aie-network
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    container_name: aie-frontend-prod
    restart: unless-stopped
    build:
      context: ./front-end
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - aie-network
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    container_name: aie-postgres-prod
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres-prod-data:/var/lib/postgresql/data
    networks:
      - aie-network
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    container_name: aie-redis-prod
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-prod-data:/data
    networks:
      - aie-network
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    container_name: aie-nginx-prod
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - aie-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  aie-network:
    driver: bridge

volumes:
  postgres-prod-data:
  redis-prod-data:
```

**nginx/nginx.conf** (Create new file):
```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8080;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 80;
        server_name example.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name example.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### Acceptance Criteria
- Production compose working
- Nginx configured
- SSL/TLS working
- Health checks passing

---

## Task 7.4: Documentation
**Estimated Time**: 8 hours

### Subtasks

#### 7.4.1: Deployment Docs
- [ ] Create DEPLOYMENT.md
- [ ] Document deployment process
- [ ] Add troubleshooting guide
- [ ] Add rollback procedures

#### 7.4.2: API Documentation
- [ ] Complete OpenAPI docs
- [ ] Add examples
- [ ] Document error codes
- [ ] Add rate limit info

#### 7.4.3: Architecture Docs
- [ ] Create ARCHITECTURE.md
- [ ] Document system design
- [ ] Add diagrams
- [ ] Document data flow

### Code Changes

**DEPLOYMENT.md** (Create new file):
```markdown
# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured
- SSL certificates obtained
- Environment variables set

## Environment Variables

Create `.env.prod` file:

```env
# Database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Backend
API_HOST=0.0.0.0
API_PORT=8080
DATABASE_URL=postgresql://user:pass@postgres:5432/db

# Frontend
NEXT_PUBLIC_API_URL=https://api.example.com

# Monitoring
SENTRY_DSN=your_sentry_dsn
ENVIRONMENT=production
```

## Deployment Steps

1. **Build and start services**
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

2. **Verify services are running**
   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

3. **Run database migrations**
   ```bash
   docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

4. **Check health**
   ```bash
   curl https://your-domain.com/health
   ```

## Monitoring

- Metrics: https://your-domain.com/metrics
- Logs: `docker compose -f docker-compose.prod.yml logs -f`
- Health: https://your-domain.com/health

## Troubleshooting

### Services not starting
Check logs: `docker compose -f docker-compose.prod.yml logs [service]`

### Database connection issues
Verify DATABASE_URL and check postgres logs

### SSL certificate errors
Ensure certificates are in nginx/ssl/ directory
```

**ARCHITECTURE.md** (Create new file):
```markdown
# System Architecture

## Overview

AI-in-Education is a language learning platform with real-time voice interactions.

## Components

### Frontend (Next.js)
- User interface
- LiveKit client integration
- State management

### Backend (FastAPI)
- REST API
- Authentication
- Business logic
- Database operations

### Voice Agents (Python)
- LiveKit agent worker
- LLM integration
- Bithuman avatar

### Infrastructure
- PostgreSQL (database)
- Redis (cache)
- Nginx (reverse proxy)
- LiveKit Server (real-time)

## Data Flow

1. User selects course/lesson
2. Frontend calls backend API
3. Backend returns data (cached)
4. User starts session
5. Frontend connects to LiveKit room
6. Voice agent joins room
7. Real-time audio communication
8. Progress tracked and updated

## Technology Stack

- Frontend: Next.js 15, React 19, TypeScript
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Voice: LiveKit Agents, Gemini 2.0 Flash
- Infrastructure: Docker, Nginx, Redis
```

### Acceptance Criteria
- Deployment docs complete
- API docs complete
- Architecture docs complete
- Easy to deploy

---

## Sprint 7 Checklist

### Performance Optimization
- [ ] Database indexes added
- [ ] Redis caching implemented
- [ ] Frontend optimized
- [ ] Performance improved

### Monitoring & Observability
- [ ] Metrics endpoint
- [ ] Error tracking (Sentry)
- [ ] Structured logging
- [ ] Alerts configured

### Deployment Configuration
- [ ] Production compose
- [ ] Nginx configured
- [ ] SSL/TLS working
- [ ] Health checks passing

### Documentation
- [ ] Deployment guide
- [ ] API documentation
- [ ] Architecture docs
- [ ] Troubleshooting guide

---

## Definition of Done

A task is complete when:
- [ ] All subtasks checked
- [ ] Code committed
- [ ] Tested in production-like env
- [ ] Documented

Sprint complete when:
- [ ] Application production-ready
- [ ] Monitoring in place
- [ ] Deployment automated
- [ ] Documentation complete

---

## Blocked By

- Sprint 6: Data Persistence (MUST be completed first)

---

## Risks

- **Low Risk**: Performance issues
  - **Mitigation**: Monitor closely, optimize as needed

- **Low Risk**: Deployment failures
  - **Mitigation**: Test thoroughly, have rollback plan

---

## Notes

- Test in staging first
- Monitor closely after deployment
- Have rollback plan ready
- Document everything
- Keep security in mind

---

## Next Sprint

After completing Sprint 7, proceed to **Sprint 8: Enhancement Sprint**
