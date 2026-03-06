# Project Rebuild Plan - Minimal Effort Approach

## Overview
This plan outlines a systematic approach to rebuild the AI-in-Education project with minimal effort while addressing critical issues and missing functionality.

## Project Status Assessment
- ✅ **Working**: Frontend (Next.js 15), Voice Agents (LiveKit), Docker setup
- ❌ **Critical Issues**: Python 3.14 in Dockerfile, CORS security, disabled strict mode
- ❌ **Missing**: Backend implementation, authentication, database, tests
- ⚠️ **Needs Improvement**: Error handling, type safety, documentation

---

## Phase 1: Critical Fixes (Sprint 1 - 2-3 days)
**Goal**: Fix all critical issues preventing production readiness

### 1.1 Docker Fixes
- [ ] Fix backend Dockerfile Python version: `3.14` → `3.12`
- [ ] Verify all services build successfully
- [ ] Test docker-compose up/down cycles

### 1.2 Security Fixes
- [ ] Remove `allow_origins=["*"]` from backend CORS
- [ ] Add environment-based CORS configuration
- [ ] Review and update docker-compose security settings

### 1.3 Next.js Configuration
- [ ] Enable `reactStrictMode: true` in next.config.ts
- [ ] Remove `ignoreBuildErrors: true`
- [ ] Enable TypeScript strict mode checks

### 1.4 Logging & Monitoring
- [ ] Add structured logging to backend (Loguru)
- [ ] Add error tracking to frontend
- [ ] Set up health check endpoints

**Deliverables**:
- All Docker containers build and run successfully
- Security vulnerabilities addressed
- Build process passes without errors
- Logging infrastructure in place

---

## Phase 2: Backend MVP (Sprint 2 - 1 week)
**Goal**: Implement minimal viable backend API

### 2.1 Configuration & Settings
- [ ] Implement `backend/settings.py` with Pydantic Settings
- [ ] Add environment variable validation
- [ ] Create `.env.example` for backend
- [ ] Document required environment variables

### 2.2 Data Models
- [ ] Create models for: User, Course, Lesson, Avatar, Session, Progress
- [ ] Implement simple in-memory database (using Python dicts/lists)
- [ ] Add data seeding for development
- [ ] Create migration path for future real database

### 2.3 Core API Endpoints
- [ ] **Avatars**: GET `/api/avatars`, GET `/api/avatars/{id}`
- [ ] **Courses**: GET `/api/courses`, GET `/api/courses/{slug}`
- [ ] **Lessons**: GET `/api/lessons`, GET `/api/lessons/{id}`
- [ ] **Sessions**: POST `/api/sessions`, GET `/api/sessions/{id}`
- [ ] **Progress**: GET `/api/progress/{user_id}`, PATCH `/api/progress/{user_id}`

### 2.4 API Documentation
- [ ] Add OpenAPI/Swagger UI (`/docs`)
- [ ] Document all endpoints with examples
- [ ] Add request/response schemas

**Deliverables**:
- Working backend API with all core endpoints
- Swagger documentation available
- In-memory database with seed data
- Frontend can fetch data from backend

---

## Phase 3: Frontend Integration (Sprint 3 - 1 week)
**Goal**: Connect frontend to backend API and improve UX

### 3.1 API Integration
- [ ] Update all actions to call backend API instead of hardcoded data
- [ ] Replace mock data with real API calls
- [ ] Add proper error handling for API failures
- [ ] Implement loading states for all async operations

### 3.2 Error Handling & UX
- [ ] Add global error boundary
- [ ] Implement toast notifications for errors/success
- [ ] Add retry logic for failed API calls
- [ ] Improve loading indicators across all pages

### 3.3 Type Safety
- [ ] Add TypeScript interfaces for all API responses
- [ ] Enable strict type checking
- [ ] Fix any type errors
- [ ] Add runtime type validation (Zod)

### 3.4 State Management
- [ ] Review and optimize Zustand stores
- [ ] Add data persistence (localStorage for user preferences)
- [ ] Implement optimistic updates where appropriate

**Deliverables**:
- Frontend fully integrated with backend
- Robust error handling throughout
- Type-safe codebase
- Improved user experience

---

## Phase 4: Authentication & Security (Sprint 4 - 1 week)
**Goal**: Add basic authentication and security measures

### 4.1 User Authentication
- [ ] Add user registration endpoint: POST `/api/auth/register`
- [ ] Add user login endpoint: POST `/api/auth/login`
- [ ] Implement JWT token generation and validation
- [ ] Add protected routes middleware
- [ ] Implement session management

### 4.2 Authorization
- [ ] Add role-based access control (student, teacher, admin)
- [ ] Protect sensitive endpoints
- [ ] Add user context to requests

### 4.3 Security Hardening
- [ ] Add rate limiting to API endpoints
- [ ] Implement CSRF protection
- [ ] Add input validation and sanitization
- [ ] Secure environment variables

### 4.4 Frontend Auth UI
- [ ] Add login/register pages
- [ ] Implement protected routes
- [ ] Add logout functionality
- [ ] Store tokens securely (httpOnly cookies)

**Deliverables**:
- Working authentication system
- Protected routes and endpoints
- Secure API access
- User authentication UI

---

## Phase 5: Testing Infrastructure (Sprint 5 - 1 week)
**Goal**: Establish testing framework and write critical tests

### 5.1 Test Framework Setup
- [ ] Backend: Add pytest with pytest-asyncio
- [ ] Frontend: Add Jest + React Testing Library
- [ ] Voice Agents: Add pytest with mock LiveKit
- [ ] Configure test databases/fixtures

### 5.2 Backend Tests
- [ ] Unit tests for all API endpoints
- [ ] Integration tests for database operations
- [ ] Authentication flow tests
- [ ] Error handling tests

### 5.3 Frontend Tests
- [ ] Component tests for critical components
- [ ] Integration tests for API calls
- [ ] User flow tests (login → select course → start lesson)
- [ ] Error boundary tests

### 5.4 Voice Agent Tests
- [ ] Unit tests for function tools
- [ ] Mock tests for LiveKit integration
- [ ] LLM response generation tests

### 5.5 CI/CD Integration
- [ ] Add GitHub Actions workflow
- [ ] Run tests on every push
- [ ] Add linting checks
- [ ] Add build verification

**Deliverables**:
- Comprehensive test suite
- Automated CI/CD pipeline
- Test coverage for critical paths
- Documentation for running tests

---

## Phase 6: Data Persistence (Sprint 6 - 1 week)
**Goal**: Replace in-memory database with real database

### 6.1 Database Setup
- [ ] Choose and set up database (PostgreSQL recommended)
- [ ] Add database to docker-compose
- [ ] Create migration scripts
- [ ] Seed database with initial data

### 6.2 Backend Integration
- [ ] Add ORM (SQLAlchemy recommended)
- [ ] Update models to use ORM
- [ ] Migrate in-memory data to database
- [ ] Add connection pooling

### 6.3 Migration Path
- [ ] Create migration from in-memory to database
- [ ] Test data migration
- [ ] Update all endpoints to use database
- [ ] Remove in-memory database code

**Deliverables**:
- Production-ready database setup
- All data persisted in database
- Migration scripts for future updates
- Database backup strategy

---

## Phase 7: Production Readiness (Sprint 7 - 1 week)
**Goal**: Prepare application for production deployment

### 7.1 Performance Optimization
- [ ] Add database indexes
- [ ] Implement API response caching (Redis)
- [ ] Optimize frontend bundle size
- [ ] Add CDN configuration for static assets

### 7.2 Monitoring & Observability
- [ ] Add application performance monitoring (APM)
- [ ] Set up error tracking (Sentry)
- [ ] Add health check endpoints with metrics
- [ ] Implement log aggregation

### 7.3 Deployment Configuration
- [ ] Create production Docker configurations
- [ ] Add environment-specific configs
- [ ] Set up reverse proxy (nginx)
- [ ] Configure SSL/TLS certificates

### 7.4 Documentation
- [ ] Update README with deployment instructions
- [ ] Add API documentation
- [ ] Document environment variables
- [ ] Create contributor guide

**Deliverables**:
- Production-ready application
- Comprehensive monitoring
- Complete deployment documentation
- Performance optimized

---

## Phase 8: Enhancement Sprint (Sprint 8 - 2 weeks)
**Goal**: Add nice-to-have features and polish

### 8.1 Features
- [ ] Add lesson builder UI for admins
- [ ] Implement session recording/playback
- [ ] Add real-time progress tracking
- [ ] Multi-language support expansion
- [ ] Student analytics dashboard

### 8.2 UX Improvements
- [ ] Add animations and transitions
- [ ] Improve mobile responsiveness
- [ ] Add dark mode
- [ ] Optimize for accessibility (a11y)

### 8.3 Code Quality
- [ ] Refactor重复代码
- [ ] Add more comprehensive error messages
- [ ] Improve code documentation
- [ ] Add code coverage reporting

**Deliverables**:
- Enhanced feature set
- Improved user experience
- Polished codebase
- Optional features implemented

---

## Implementation Timeline

| Phase | Duration | Start | End | Status |
|-------|----------|-------|-----|--------|
| Phase 1: Critical Fixes | 2-3 days | Week 1 | Week 1 | ⏳ Not Started |
| Phase 2: Backend MVP | 1 week | Week 2 | Week 2 | ⏳ Not Started |
| Phase 3: Frontend Integration | 1 week | Week 3 | Week 3 | ⏳ Not Started |
| Phase 4: Authentication | 1 week | Week 4 | Week 4 | ⏳ Not Started |
| Phase 5: Testing | 1 week | Week 5 | Week 5 | ⏳ Not Started |
| Phase 6: Data Persistence | 1 week | Week 6 | Week 6 | ⏳ Not Started |
| Phase 7: Production Ready | 1 week | Week 7 | Week 7 | ⏳ Not Started |
| Phase 8: Enhancements | 2 weeks | Week 8 | Week 9 | ⏳ Not Started |

**Total Estimated Time**: 8-9 weeks

---

## Risk Assessment

### High Risk
- **Database migration complexity**: Mitigate by starting with in-memory DB
- **LiveKit integration changes**: Test thoroughly in isolation

### Medium Risk
- **Authentication implementation**: Use well-established libraries (fastapi-users)
- **State management complexity**: Keep Zustand simple, document clearly

### Low Risk
- **Frontend UI changes**: Component-based approach minimizes risk
- **Docker configuration**: Can be rolled back easily

---

## Success Criteria

- ✅ All critical issues from code review resolved
- ✅ Backend API fully functional with Swagger docs
- ✅ Frontend integrated with backend
- ✅ Authentication system working
- ✅ Test coverage > 60%
- ✅ Application deployable to production
- ✅ Documentation complete

---

## Next Steps

1. **Review and approve this plan** with stakeholders
2. **Set up project management tools** (GitHub Projects, Jira, etc.)
3. **Begin Phase 1** - Critical Fixes
4. **Weekly sync meetings** to track progress
5. **Adjust timeline** as needed based on feedback

---

## Notes

- This plan prioritizes **minimal effort** while delivering a production-ready application
- Phases can be **reordered** based on business priorities
- Each phase delivers **incremental value** and can be deployed independently
- **Testing is integrated** throughout, not just in Phase 5
- **Documentation** is ongoing, not just at the end
