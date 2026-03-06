# Sprint 4: Authentication & Security

## Overview
**Duration**: 1 week
**Goal**: Add basic authentication and security measures
**Priority**: HIGH - Essential for production
**Depends On**: Sprint 3 (Frontend Integration)

---

## Task 4.1: User Authentication Backend
**Estimated Time**: 16 hours (2 days)

### Subtasks

#### 4.1.1: User Model & Database
- [ ] Add User model to backend models
- [ ] Add user CRUD operations to database
- [ ] Add password hashing (bcrypt)
- [ ] Add user validation

#### 4.1.2: Authentication Endpoints
- [ ] POST `/api/auth/register` - User registration
- [ ] POST `/api/auth/login` - User login
- [ ] POST `/api/auth/logout` - User logout
- [ ] POST `/api/auth/refresh` - Refresh token
- [ ] GET `/api/auth/me` - Get current user

#### 4.1.3: JWT Token Management
- [ ] Add JWT token generation
- [ ] Add JWT token validation
- [ ] Add token refresh logic
- [ ] Add token expiration handling

### Code Changes

**backend/models.py** - Add User model:
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class User(UserBase):
    id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    user_id: str
    email: str
    role: UserRole
```

**backend/database.py** - Add user management:
```python
from models import User, UserCreate, UserInDB
import bcrypt

class InMemoryDatabase:
    # ... existing code ...

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        if user_data.email in self.users_by_email:
            raise ValueError(f"User with email {user_data.email} already exists")

        user_id = str(len(self.users) + 1)
        hashed_password = bcrypt.hashpw(
            user_data.password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

        user = UserInDB(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            role=user_data.role,
            hashed_password=hashed_password
        )

        self.users[user_id] = user
        self.users_by_email[user_data.email] = user

        return User(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at,
            is_active=user.is_active
        )

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        if email not in self.users_by_email:
            return None

        user = self.users_by_email[email]

        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.hashed_password.encode('utf-8')
        ):
            return None

        return User(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at,
            is_active=user.is_active
        )
```

**backend/auth.py** (Create new file):
```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models import TokenData, User
from settings import get_settings
from database import get_db

settings = get_settings()
db = get_db()

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)

    to_encode.update({"exp": expire, "type": "access"})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token (longer lived)"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt

def verify_token(token: str, token_type: str = "access") -> TokenData:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )

        if payload.get("type") != token_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token type"
            )

        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        token_data = TokenData(
            user_id=user_id,
            email=payload.get("email"),
            role=payload.get("role")
        )

        return token_data

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current authenticated user from token"""
    token = credentials.credentials
    token_data = verify_token(token)

    user = db.users.get(token_data.user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return User(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        created_at=user.created_at,
        is_active=user.is_active
    )

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return current_user
```

**backend/routes/auth.py** (Create new file):
```python
from fastapi import APIRouter, HTTPException, status, Depends
from models import UserCreate, User, Token
from auth import (
    create_access_token,
    create_refresh_token,
    get_current_active_user
)
from database import get_db
from loguru import logger

router = APIRouter(prefix="/api/auth", tags=["auth"])
db = get_db()

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    logger.info(f"Registration attempt for email: {user_data.email}")

    try:
        user = db.create_user(user_data)
        logger.info(f"User registered successfully: {user.email}")
        return user
    except ValueError as e:
        logger.error(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login(email: str, password: str):
    """Authenticate user and return tokens"""
    logger.info(f"Login attempt for email: {email}")

    user = db.authenticate_user(email, password)

    if not user:
        logger.warning(f"Login failed for email: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    logger.info(f"Login successful for email: {email}")

    access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=3600  # 1 hour in seconds
    )

@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get current authenticated user"""
    return current_user

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """Logout current user (invalidate tokens)"""
    logger.info(f"Logout for user: {current_user.email}")
    # In a real app, you would add tokens to a blacklist
    return {"message": "Logged out successfully"}
```

**backend/main.py** - Add auth route:
```python
from routes import auth

app.include_router(auth.router)
```

### Acceptance Criteria
- User registration works
- Login returns valid JWT tokens
- Token validation works
- Passwords are hashed

---

## Task 4.2: Authorization
**Estimated Time**: 6 hours

### Subtasks

#### 4.2.1: Role-Based Access Control
- [ ] Add role checking middleware
- [ ] Add admin-only endpoints
- [ ] Add teacher-only endpoints
- [ ] Document permission levels

#### 4.2.2: Protect Sensitive Endpoints
- [ ] Protect session creation/update
- [ ] Protect progress updates
- [ ] Protect avatar management
- [ ] Protect course management

### Code Changes

**backend/auth.py** - Add role checking:
```python
from models import UserRole

def require_role(required_role: UserRole):
    """Dependency to check if user has required role"""
    async def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role != required_role and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

def require_admin(current_user: User = Depends(get_current_active_user)) -> User:
    """Require admin role"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user
```

**backend/routes/avatars.py** - Protect admin endpoints:
```python
from auth import require_admin

@router.post("", response_model=Avatar, status_code=status.HTTP_201_CREATED)
async def create_avatar(
    avatar_data: AvatarCreate,
    current_user: User = Depends(require_admin)
):
    """Create a new avatar (admin only)"""
    # ... existing code ...

@router.put("/{avatar_id}", response_model=Avatar)
async def update_avatar(
    avatar_id: str,
    avatar_data: AvatarUpdate,
    current_user: User = Depends(require_admin)
):
    """Update an existing avatar (admin only)"""
    # ... existing code ...

@router.delete("/{avatar_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_avatar(
    avatar_id: str,
    current_user: User = Depends(require_admin)
):
    """Delete an avatar (admin only)"""
    # ... existing code ...
```

### Acceptance Criteria
- RBAC works correctly
- Admin-only endpoints protected
- Role checking reliable
- Permissions documented

---

## Task 4.3: Security Hardening
**Estimated Time**: 8 hours

### Subtasks

#### 4.3.1: Rate Limiting
- [ ] Add slowapi for rate limiting
- [ ] Configure rate limits per endpoint
- [ ] Add rate limit headers
- [ ] Test rate limiting

#### 4.3.2: Input Validation
- [ ] Add input validation to all endpoints
- [ ] Sanitize user inputs
- [ ] Validate file uploads
- [ ] Validate query parameters

#### 4.3.3: Security Headers
- [ ] Add security headers middleware
- [ ] Configure CSP headers
- [ ] Add HSTS headers
- [ ] Add X-Frame-Options

### Code Changes

**backend/security.py** (Create new file):
```python
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

limiter = Limiter(key_func=get_remote_address)

def add_security_headers(app):
    """Add security headers to all responses"""

    @app.middleware("http")
    async def add_security_headers_middleware(request: Request, call_next):
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        return response

    return app

def add_rate_limiting(app):
    """Add rate limiting to the app"""
    app.state.limiter = limiter

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Rate limit exceeded. Please try again later.",
                "retry_after": exc.retry_after
            }
        )

    return app
```

**backend/main.py** - Add security:
```python
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from security import add_security_headers, add_rate_limiting

app = FastAPI()

# Add security features
app = add_security_headers(app)
app = add_rate_limiting(app)

# Add rate limit exception handler
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

### Acceptance Criteria
- Rate limiting works
- Input validation complete
- Security headers added
- CSRF protection in place

---

## Task 4.4: Frontend Authentication UI
**Estimated Time**: 10 hours

### Subtasks

#### 4.4.1: Auth Pages
- [ ] Create login page `/auth/login`
- [ ] Create register page `/auth/register`
- [ ] Create forgot password page `/auth/forgot-password`
- [ ] Add form validation

#### 4.4.2: Auth Actions
- [ ] Create `actions/auth.ts`
- [ ] Add login function
- [ ] Add register function
- [ ] Add logout function
- [ ] Add token refresh

#### 4.4.3: Protected Routes
- [ ] Add route protection middleware
- [ ] Redirect unauthenticated users
- [ ] Store tokens securely
- [ ] Handle token expiration

### Code Changes

**front-end/actions/auth.ts** (Create new file):
```typescript
import { User } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export const login = async (data: LoginData): Promise<TokenResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const tokenData = await response.json();

    // Store tokens
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", tokenData.access_token);
      localStorage.setItem("refresh_token", tokenData.refresh_token);
    }

    return tokenData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("access_token");

    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always clear tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return await response.json();
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};
```

**front-end/app/[locale]/(auth)/login/page.tsx** (Create new file):
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { useUserStore } from "@/store/user";
import { showToast } from "@/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      const user = await getCurrentUser();
      setUser(user);
      showToast.success("Login successful!");
      router.push("/");
    } catch (error) {
      showToast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-3xl font-bold text-center">Sign in</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Acceptance Criteria
- Login page works
- Registration page works
- Tokens stored securely
- Protected routes work

---

## Sprint 4 Checklist

### Backend Authentication
- [ ] User model created
- [ ] Registration endpoint
- [ ] Login endpoint
- [ ] JWT tokens working
- [ ] Token validation

### Authorization
- [ ] RBAC implemented
- [ ] Admin endpoints protected
- [ ] Role checking works
- [ ] Permissions documented

### Security Hardening
- [ ] Rate limiting added
- [ ] Input validation
- [ ] Security headers
- [ ] CSRF protection

### Frontend Auth UI
- [ ] Login page
- [ ] Register page
- [ ] Auth actions
- [ ] Protected routes

### Testing
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] Security tested
- [ ] UI tested

---

## Definition of Done

A task is complete when:
- [ ] All subtasks checked
- [ ] Code committed
- [ ] Locally tested
- [ ] No security vulnerabilities

Sprint complete when:
- [ ] Authentication working
- [ ] Authorization working
- [ ] Security hardened
- [ ] Frontend auth UI complete

---

## Blocked By

- Sprint 3: Frontend Integration (MUST be completed first)

---

## Risks

- **Medium Risk**: JWT token security
  - **Mitigation**: Use strong secrets, short expiration, refresh tokens

- **Medium Risk**: Password security
  - **Mitigation**: Use bcrypt, enforce strong passwords

---

## Notes

- Security is critical
- Test auth flows thoroughly
- Keep tokens secure
- Document permissions clearly

---

## Next Sprint

After completing Sprint 4, proceed to **Sprint 5: Testing Infrastructure**
