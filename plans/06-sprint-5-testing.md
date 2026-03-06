# Sprint 5: Testing Infrastructure

## Overview
**Duration**: 1 week
**Goal**: Establish testing framework and write critical tests
**Priority**: MEDIUM - Important for code quality
**Depends On**: Sprint 4 (Authentication & Security)

---

## Task 5.1: Test Framework Setup
**Estimated Time**: 8 hours

### Subtasks

#### 5.1.1: Backend Testing
- [ ] Add pytest to backend dependencies
- [ ] Add pytest-asyncio for async tests
- [ ] Add httpx for testing FastAPI
- [ ] Configure pytest settings
- [ ] Create test directory structure

#### 5.1.2: Frontend Testing
- [ ] Jest already configured (verify)
- [ ] React Testing Library already installed (verify)
- [ ] Configure test environment
- [ ] Create test directory structure
- [ ] Add test utilities

#### 5.1.3: Voice Agents Testing
- [ ] Add pytest for voice agents
- [ ] Create mocks for LiveKit
- [ ] Create mocks for LLM
- [ ] Configure test settings

### Code Changes

**backend/pyproject.toml**:
```toml
[project]
name = "backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.116.1",
    "loguru>=0.7.3",
    "uvicorn>=0.35.0",
    "pydantic>=2.0.0",
    "pydantic-settings>=2.0.0",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
    "slowapi>=0.1.9",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.0",
    "httpx>=0.24.0",
    "pytest-cov>=4.1.0",
]
```

**backend/pytest.ini** (Create new file):
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
asyncio_mode = auto
addopts =
    -v
    --cov=.
    --cov-report=html
    --cov-report=term
```

**backend/tests/__init__.py** (Create new file):
```python
# Tests package
```

**backend/tests/conftest.py** (Create new file):
```python
import pytest
from fastapi.testclient import TestClient
from main import app
from database import InMemoryDatabase

@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)

@pytest.fixture
def db():
    """Create fresh database for each test"""
    db = InMemoryDatabase()
    return db

@pytest.fixture
def test_user():
    """Create test user"""
    return {
        "email": "test@example.com",
        "password": "testpass123",
        "name": "Test User"
    }
```

**front-end/jest.config.js** (Update if needed):
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'store/**/*.{js,jsx,ts,tsx}',
    'actions/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

**front-end/jest.setup.js** (Create new file):
```javascript
import '@testing-library/jest-dom'
```

### Acceptance Criteria
- Test frameworks installed
- Test directories created
- Test configs working
- Sample tests run successfully

---

## Task 5.2: Backend Tests
**Estimated Time**: 12 hours

### Subtasks

#### 5.2.1: API Endpoint Tests
- [ ] Test avatar endpoints
- [ ] Test course endpoints
- [ ] Test lesson endpoints
- [ ] Test session endpoints
- [ ] Test progress endpoints

#### 5.2.2: Authentication Tests
- [ ] Test user registration
- [ ] Test user login
- [ ] Test token validation
- [ ] Test protected routes
- [ ] Test authorization

#### 5.2.3: Error Handling Tests
- [ ] Test 404 errors
- [ ] Test validation errors
- [ ] Test authentication errors
- [ ] Test authorization errors
- [ ] Test rate limiting

### Code Changes

**backend/tests/test_avatars.py** (Create new file):
```python
import pytest
from fastapi.testclient import TestClient

def test_list_avatars(client):
    """Test listing all avatars"""
    response = client.get("/api/avatars")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "id" in data[0]
    assert "name" in data[0]

def test_get_avatar(client):
    """Test getting a specific avatar"""
    response = client.get("/api/avatars/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "1"
    assert "name" in data

def test_get_avatar_not_found(client):
    """Test getting a non-existent avatar"""
    response = client.get("/api/avatars/999")
    assert response.status_code == 404

def test_create_avatar(client):
    """Test creating a new avatar"""
    avatar_data = {
        "name": "Test Avatar",
        "description": "Test description",
        "character": "😊 Test",
        "src": "/test.mp4"
    }
    response = client.post("/api/avatars", json=avatar_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Avatar"
```

**backend/tests/test_auth.py** (Create new file):
```python
import pytest
from fastapi.testclient import TestClient

def test_register(client, test_user):
    """Test user registration"""
    response = client.post("/api/auth/register", json=test_user)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["name"] == test_user["name"]

def test_register_duplicate_email(client, test_user):
    """Test registering with duplicate email"""
    # First registration
    client.post("/api/auth/register", json=test_user)

    # Second registration with same email
    response = client.post("/api/auth/register", json=test_user)
    assert response.status_code == 400

def test_login(client, test_user):
    """Test user login"""
    # Register user first
    client.post("/api/auth/register", json=test_user)

    # Login
    login_data = {
        "email": test_user["email"],
        "password": test_user["password"]
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    login_data = {
        "email": "invalid@example.com",
        "password": "wrongpass"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 401

def test_protected_route_without_token(client):
    """Test accessing protected route without token"""
    response = client.get("/api/auth/me")
    assert response.status_code == 403

def test_protected_route_with_token(client, test_user):
    """Test accessing protected route with valid token"""
    # Register and login
    client.post("/api/auth/register", json=test_user)
    login_response = client.post("/api/auth/login", data={
        "email": test_user["email"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]

    # Access protected route
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
```

### Acceptance Criteria
- All endpoints tested
- Authentication flows tested
- Error handling tested
- Test coverage > 60%

---

## Task 5.3: Frontend Tests
**Estimated Time**: 12 hours

### Subtasks

#### 5.3.1: Component Tests
- [ ] Test critical components (Avatar, CourseCard, etc.)
- [ ] Test error boundary
- [ ] Test loading skeletons
- [ ] Test forms

#### 5.3.2: Integration Tests
- [ ] Test API integration
- [ ] Test auth flows
- [ ] Test session management
- [ ] Test error handling

#### 5.3.3: User Flow Tests
- [ ] Test login flow
- [ ] Test course selection
- [ ] Test lesson start
- [ ] Test progress tracking

### Code Changes

**front-end/components/__tests__/CourseCard.test.tsx** (Create new file):
```typescript
import { render, screen } from '@testing-library/react'
import CourseCard from '../course/Card'

describe('CourseCard', () => {
  const mockCourse = {
    slug: '/lessons/environment',
    title: 'Environment',
    description: 'Learn about nature',
    icon: 'Environment',
    lessons: []
  }

  it('renders course title', () => {
    render(<CourseCard course={mockCourse} />)
    expect(screen.getByText('Environment')).toBeInTheDocument()
  })

  it('renders course description', () => {
    render(<CourseCard course={mockCourse} />)
    expect(screen.getByText('Learn about nature')).toBeInTheDocument()
  })

  it('is clickable', () => {
    const handleClick = jest.fn()
    render(<CourseCard course={mockCourse} onClick={handleClick} />)
    screen.getByText('Environment').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

**front-end/actions/__tests__/courses.test.ts** (Create new file):
```typescript
import { getCourses } from '../courses'

global.fetch = jest.fn()

describe('Courses Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches courses successfully', async () => {
    const mockCourses = [
      {
        slug: '/lessons/environment',
        title: 'Environment',
        description: 'Test',
        icon: 'Environment',
        lessons: []
      }
    ]

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    })

    const courses = await getCourses()
    expect(courses).toHaveLength(1)
    expect(courses[0].title).toBe('Environment')
  })

  it('handles API errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    })

    await expect(getCourses()).rejects.toThrow()
  })
})
```

### Acceptance Criteria
- Critical components tested
- API integration tested
- User flows tested
- Test coverage > 60%

---

## Task 5.4: Voice Agent Tests
**Estimated Time**: 8 hours

### Subtasks

#### 5.4.1: Function Tool Tests
- [ ] Test update_lesson_section
- [ ] Test end_lesson_section
- [ ] Test tool error handling
- [ ] Test RPC calls

#### 5.4.2: Agent Tests
- [ ] Test agent initialization
- [ ] Test agent state management
- [ ] Test LLM integration (mocked)
- [ ] Test LiveKit integration (mocked)

### Code Changes

**voice-agents/tests/__init__.py** (Create new file):
```python
# Tests package
```

**voice-agents/tests/conftest.py** (Create new file):
```python
import pytest
from unittest.mock import Mock, AsyncMock
from livekit.agents import JobContext
from agent import LessonState

@pytest.fixture
def mock_job_context():
    """Create mock JobContext"""
    ctx = Mock(spec=JobContext)
    ctx.room = Mock()
    ctx.room.local_participant = Mock()
    ctx.room.remote_participants = {}
    return ctx

@pytest.fixture
def lesson_state(mock_job_context):
    """Create LessonState instance"""
    return LessonState(ctx=mock_job_context)
```

**voice-agents/tests/test_agent.py** (Create new file):
```python
import pytest
from agent import update_lession_section, end_lesson_section
from livekit.agents import RunContext

@pytest.mark.asyncio
async def test_update_lesson_section(lesson_state):
    """Test updating lesson section"""
    context = Mock(spec=RunContext)
    context.userdata = lesson_state

    result = await update_lession_section(context, "Introduction")

    assert lesson_state.type == "section_change"
    assert lesson_state.value == "Introduction"
    assert "Tool called done" in result

@pytest.mark.asyncio
async def test_end_lesson_section(lesson_state):
    """Test ending lesson section"""
    context = Mock(spec=RunContext)
    context.userdata = lesson_state

    result = await end_lesson_section(context)

    assert lesson_state.type == "section_end"
    assert lesson_state.value == "true"
    assert "Tool called done" in result
```

### Acceptance Criteria
- Function tools tested
- Agent tested
- LLM integration mocked
- LiveKit integration mocked

---

## Task 5.5: CI/CD Integration
**Estimated Time**: 8 hours

### Subtasks

#### 5.5.1: GitHub Actions Workflow
- [ ] Create .github/workflows/test.yml
- [ ] Add backend tests
- [ ] Add frontend tests
- [ ] Add voice agent tests
- [ ] Add linting checks

#### 5.5.2: Build Verification
- [ ] Verify Docker builds
- [ ] Verify frontend builds
- [ ] Verify backend builds
- [ ] Add build status badges

### Code Changes

**.github/workflows/test.yml** (Create new file):
```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'

      - name: Install uv
        run: pip install uv

      - name: Install dependencies
        working-directory: ./backend
        run: |
          uv sync --dev
          uv pip install pytest pytest-asyncio pytest-cov httpx

      - name: Run tests
        working-directory: ./backend
        run: pytest --cov=. --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: ./front-end
        run: npm ci

      - name: Run linting
        working-directory: ./front-end
        run: npm run lint

      - name: Run tests
        working-directory: ./front-end
        run: npm run test -- --coverage

      - name: Build
        working-directory: ./front-end
        run: npm run build

  voice-agents-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'

      - name: Install uv
        run: pip install uv

      - name: Install dependencies
        working-directory: ./voice-agents
        run: |
          uv sync --dev
          uv pip install pytest pytest-asyncio pytest-cov

      - name: Run tests
        working-directory: ./voice-agents
        run: pytest --cov=. --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Acceptance Criteria
- CI/CD pipeline works
- Tests run on every push
- Linting checks pass
- Builds verified

---

## Sprint 5 Checklist

### Test Framework Setup
- [ ] Backend testing configured
- [ ] Frontend testing configured
- [ ] Voice agent testing configured
- [ ] Test directories created

### Backend Tests
- [ ] API endpoints tested
- [ ] Authentication tested
- [ ] Error handling tested
- [ ] Coverage > 60%

### Frontend Tests
- [ ] Components tested
- [ ] API integration tested
- [ ] User flows tested
- [ ] Coverage > 60%

### Voice Agent Tests
- [ ] Function tools tested
- [ ] Agent tested
- [ ] Mocks created
- [ ] Coverage > 60%

### CI/CD Integration
- [ ] GitHub Actions workflow
- [ ] Tests run on push
- [ ] Linting checks
- [ ] Build verification

---

## Definition of Done

A task is complete when:
- [ ] All subtasks checked
- [ ] Tests written
- [ ] Tests pass
- [ ] CI/CD working

Sprint complete when:
- [ ] Test coverage > 60%
- [ ] CI/CD pipeline working
- [ ] All tests pass
- [ ] Code quality improved

---

## Blocked By

- Sprint 4: Authentication & Security (MUST be completed first)

---

## Risks

- **Low Risk**: Test maintenance overhead
  - **Mitigation**: Write clear, maintainable tests

- **Low Risk**: Slow test execution
  - **Mitigation**: Use parallel execution, mock external services

---

## Notes

- Tests are essential for code quality
- Focus on critical paths first
- Mock external dependencies
- Keep tests fast and reliable
- Document test cases

---

## Next Sprint

After completing Sprint 5, proceed to **Sprint 6: Data Persistence**
