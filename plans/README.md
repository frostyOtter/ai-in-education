# Project Rebuild Plans

This directory contains comprehensive plans for rebuilding the AI-in-Education project with minimal effort.

## 📋 Overview

The rebuild is organized into **8 sprints** spanning **8-9 weeks**, each delivering incremental value and production-ready code.

### Quick Navigation

| Sprint | Duration | Focus | Status |
|--------|----------|-------|--------|
| [Sprint 1](./02-sprint-1-critical-fixes.md) | 2-3 days | Critical Fixes | ⏳ Not Started |
| [Sprint 2](./03-sprint-2-backend-mvp.md) | 1 week | Backend MVP | ⏳ Not Started |
| [Sprint 3](./04-sprint-3-frontend-integration.md) | 1 week | Frontend Integration | ⏳ Not Started |
| [Sprint 4](./05-sprint-4-authentication.md) | 1 week | Authentication & Security | ⏳ Not Started |
| [Sprint 5](./06-sprint-5-testing.md) | 1 week | Testing Infrastructure | ⏳ Not Started |
| [Sprint 6](./07-sprint-6-data-persistence.md) | 1 week | Data Persistence | ⏳ Not Started |
| [Sprint 7](./08-sprint-7-production-readiness.md) | 1 week | Production Readiness | ⏳ Not Started |
| [Sprint 8](./09-sprint-8-enhancements.md) | 2 weeks | Enhancements | ⏳ Not Started |

## 📊 Project Timeline

```
Week 1        : Sprint 1 - Critical Fixes
Week 2        : Sprint 2 - Backend MVP
Week 3        : Sprint 3 - Frontend Integration
Week 4        : Sprint 4 - Authentication & Security
Week 5        : Sprint 5 - Testing Infrastructure
Week 6        : Sprint 6 - Data Persistence
Week 7        : Sprint 7 - Production Readiness
Weeks 8-9     : Sprint 8 - Enhancements
```

## 🎯 Sprint Summaries

### Sprint 1: Critical Fixes
**Duration**: 2-3 days
**Goal**: Fix all critical issues preventing production readiness

**Key Tasks**:
- Fix Docker Python version (3.14 → 3.12)
- Remove insecure CORS configuration
- Enable Next.js strict mode
- Add structured logging

**Deliverables**:
- ✅ All containers build and run
- ✅ Security vulnerabilities addressed
- ✅ Build process passes
- ✅ Logging infrastructure

---

### Sprint 2: Backend MVP
**Duration**: 1 week
**Goal**: Implement minimal viable backend API

**Key Tasks**:
- Implement Pydantic Settings
- Create data models with validation
- Build in-memory database with seed data
- Implement core API endpoints (Avatars, Courses, Lessons, Sessions, Progress)
- Add Swagger documentation

**Deliverables**:
- ✅ Working backend API
- ✅ Swagger docs at `/docs`
- ✅ In-memory database
- ✅ Frontend can fetch data

---

### Sprint 3: Frontend Integration
**Duration**: 1 week
**Goal**: Connect frontend to backend API

**Key Tasks**:
- Update all actions to call backend API
- Add error handling and retry logic
- Implement type safety with Zod validation
- Optimize state management
- Add loading states and toasts

**Deliverables**:
- ✅ Frontend integrated with backend
- ✅ Robust error handling
- ✅ Type-safe codebase
- ✅ Improved UX

---

### Sprint 4: Authentication & Security
**Duration**: 1 week
**Goal**: Add authentication and security measures

**Key Tasks**:
- Implement JWT authentication
- Add role-based access control
- Rate limiting and input validation
- Security headers
- Frontend auth UI

**Deliverables**:
- ✅ Working authentication
- ✅ Protected routes
- ✅ Security hardened
- ✅ Auth UI complete

---

### Sprint 5: Testing Infrastructure
**Duration**: 1 week
**Goal**: Establish testing framework

**Key Tasks**:
- Set up pytest (backend) and Jest (frontend)
- Write API endpoint tests
- Write component tests
- Write integration tests
- Set up CI/CD with GitHub Actions

**Deliverables**:
- ✅ Test coverage > 60%
- ✅ CI/CD pipeline
- ✅ Automated tests
- ✅ Code quality checks

---

### Sprint 6: Data Persistence
**Duration**: 1 week
**Goal**: Replace in-memory database with PostgreSQL

**Key Tasks**:
- Set up PostgreSQL in Docker
- Implement SQLAlchemy ORM
- Create Alembic migrations
- Migrate data
- Update all routes to use ORM

**Deliverables**:
- ✅ PostgreSQL database
- ✅ ORM integration
- ✅ Data migrations
- ✅ No in-memory DB

---

### Sprint 7: Production Readiness
**Duration**: 1 week
**Goal**: Prepare for production deployment

**Key Tasks**:
- Performance optimization (caching, indexing)
- Monitoring and observability (Prometheus, Sentry)
- Deployment configuration (nginx, SSL)
- Documentation (deployment, API, architecture)

**Deliverables**:
- ✅ Performance optimized
- ✅ Monitoring in place
- ✅ Deployment automated
- ✅ Documentation complete

---

### Sprint 8: Enhancement Sprint
**Duration**: 2 weeks
**Goal**: Add nice-to-have features

**Key Tasks**:
- Lesson builder (admin UI)
- Session recording and playback
- Real-time analytics dashboard
- Multi-language support
- Dark mode
- Accessibility improvements
- Code refactoring

**Deliverables**:
- ✅ Enhanced features
- ✅ Improved UX
- ✅ High code quality
- ✅ Complete documentation

---

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js 20+ and Python 3.12+
- Git

### Starting the Rebuild

1. **Review the overall plan**:
   ```bash
   cat plans/01-project-rebuild-overview.md
   ```

2. **Begin Sprint 1**:
   ```bash
   cat plans/02-sprint-1-critical-fixes.md
   ```

3. **Track progress**:
   - Check off completed tasks
   - Update sprint status
   - Report blockers

### Working with the Plans

Each sprint document includes:
- **Overview**: Goal, duration, dependencies
- **Detailed tasks**: With estimated time and acceptance criteria
- **Code examples**: Ready-to-use code snippets
- **Checklists**: To track completion
- **Risks and mitigation**: To plan ahead

---

## 📈 Success Criteria

The rebuild is successful when:

- ✅ All critical issues from code review resolved
- ✅ Backend API fully functional with Swagger docs
- ✅ Frontend integrated with backend
- ✅ Authentication system working
- ✅ Test coverage > 60%
- ✅ Application deployable to production
- ✅ Documentation complete
- ✅ Performance optimized
- ✅ Monitoring in place
- ✅ Enhanced features implemented

---

## ⚠️ Important Notes

### Minimal Effort Approach
This plan prioritizes:
1. **Fix critical issues first** (Sprint 1)
2. **Build MVP backend** (Sprint 2)
3. **Integrate frontend** (Sprint 3)
4. **Add essential features** (Sprints 4-7)
5. **Enhance and polish** (Sprint 8)

### Sprint Dependencies
Each sprint depends on the previous one:
- Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 5 → Sprint 6 → Sprint 7 → Sprint 8

You can skip or reorder sprints based on business priorities, but the recommended order ensures smooth progression.

### Risk Mitigation
- **Low complexity**: Start with simple, incremental changes
- **Testing integrated**: Tests added throughout, not just in Sprint 5
- **Documentation ongoing**: Docs updated as we go
- **Progress visible**: Each sprint delivers deployable code

---

## 🔄 Iteration and Adaptation

This plan is a guide. You can:

- **Adjust sprint duration** based on team size and experience
- **Prioritize different features** based on business needs
- **Skip optional features** in Sprint 8 if time is tight
- **Add parallel work** if you have more developers

### Example Adaptations

**Single Developer**: Follow the plan as-is (8-9 weeks)

**2-3 Developers**:
- Run Sprints 2 and 3 in parallel (backend + frontend)
- Complete in 5-6 weeks

**4+ Developers**:
- Run multiple sprints in parallel
- Complete in 3-4 weeks
- Split into focused squads (Backend, Frontend, DevOps)

---

## 📞 Support and Questions

If you have questions about the plan:
1. Review the specific sprint document for details
2. Check the code examples provided
3. Refer to the acceptance criteria
4. Consider the risks and mitigation strategies

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-03-06 | Initial plan creation |

---

## 🎓 Resources

### Documentation
- [AGENTS.md](../AGENTS.md) - Development guidelines
- [README.md](../README.md) - Project overview

### Technology Stack
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: Next.js 15, React 19, TypeScript
- **Voice**: LiveKit Agents, Gemini 2.0 Flash
- **Infrastructure**: Docker, Nginx, Redis

### Best Practices
- **Backend**: Follow AGENTS.md Python guidelines
- **Frontend**: Follow AGENTS.md TypeScript/React guidelines
- **Git**: Commit frequently, write clear messages

---

## ✅ Definition of Done

A task is complete when:
- [ ] All subtasks checked off
- [ ] Code changes committed
- [ ] Changes tested locally
- [ ] No regressions introduced
- [ ] Acceptance criteria met

A sprint is complete when:
- [ ] All tasks in the sprint are complete
- [ ] All acceptance criteria met
- [ ] No critical bugs remaining
- [ ] Code is ready for review/deployment

---

## 🚀 Next Steps

1. **Review this overview** ✓
2. **Read Sprint 1 details** → [Sprint 1: Critical Fixes](./02-sprint-1-critical-fixes.md)
3. **Begin implementation**
4. **Track progress in GitHub Projects** or your preferred tool
5. **Adjust plan as needed** based on feedback

---

**Good luck with the rebuild! 🎉**

Remember: This is a guide, not a rigid requirement. Adapt it to your needs, timeline, and team capabilities. The goal is to deliver a production-ready application with minimal effort while maintaining code quality and user experience.
