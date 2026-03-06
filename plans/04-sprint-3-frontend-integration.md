# Sprint 3: Frontend Integration

## Overview
**Duration**: 1 week
**Goal**: Connect frontend to backend API and improve user experience
**Priority**: HIGH - Essential for production
**Depends On**: Sprint 2 (Backend MVP)

---

## Task 3.1: API Integration
**Estimated Time**: 12 hours (1.5 days)

### Subtasks

#### 3.1.1: Update Avatar Actions
- [ ] Update `actions/avatar.ts` to call backend API
- [ ] Add error handling for API failures
- [ ] Add loading states
- [ ] Test avatar selection flow

#### 3.1.2: Update Course Actions
- [ ] Update `actions/courses.ts` to call backend API
- [ ] Add error handling for API failures
- [ ] Add loading states
- [ ] Test course browsing flow

#### 3.1.3: Update Lesson Actions
- [ ] Update `actions/lesson.ts` to call backend API
- [ ] Add error handling for API failures
- [ ] Add loading states
- [ ] Test lesson selection flow

#### 3.1.4: Update Session Actions
- [ ] Create `actions/session.ts` backend integration
- [ ] Add session creation/update/delete functions
- [ ] Add error handling
- [ ] Test session management

#### 3.1.5: Update Progress Actions
- [ ] Create `actions/progress.ts` backend integration
- [ ] Add progress tracking functions
- [ ] Add error handling
- [ ] Test progress updates

### Code Changes

**front-end/actions/avatar.ts**:
```typescript
import { Avatar } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getAvatars = async (): Promise<Avatar[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/avatars`);

    if (!response.ok) {
      throw new Error(`Failed to fetch avatars: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform backend data to frontend format
    return data.map((avatar: any) => ({
      id: parseInt(avatar.id),
      name: avatar.name,
      description: avatar.description,
      character: avatar.character,
      src: avatar.src,
    }));
  } catch (error) {
    console.error("Error fetching avatars:", error);
    throw error;
  }
};

export const getAvatarById = async (id: number): Promise<Avatar | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/avatars/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: parseInt(data.id),
      name: data.name,
      description: data.description,
      character: data.character,
      src: data.src,
    };
  } catch (error) {
    console.error("Error fetching avatar:", error);
    throw error;
  }
};
```

**front-end/actions/courses.ts**:
```typescript
import { Course } from "@/types/course";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`);

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform backend data to frontend format
    return data.map((course: any) => ({
      slug: course.slug,
      title: course.title,
      description: course.description,
      icon: course.icon,
      lessons: course.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        progress: lesson.progress,
        completed: lesson.completed,
        tags: lesson.tags,
      })),
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const getCourseBySlug = async (slug: string): Promise<Course | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      slug: data.slug,
      title: data.title,
      description: data.description,
      icon: data.icon,
      lessons: data.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        progress: lesson.progress,
        completed: lesson.completed,
        tags: lesson.tags,
      })),
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};
```

**front-end/actions/lesson.ts**:
```typescript
import { Lesson } from "@/types/lesson";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getLessons = async (courseSlug?: string): Promise<Lesson[]> => {
  try {
    const url = courseSlug
      ? `${API_BASE_URL}/api/lessons?course_slug=${encodeURIComponent(courseSlug)}`
      : `${API_BASE_URL}/api/lessons`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }

    const data = await response.json();

    return data.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      level: lesson.level,
      progress: lesson.progress,
      completed: lesson.completed,
      tags: lesson.tags,
    }));
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

export const getLessonById = async (id: number): Promise<Lesson | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lessons/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch lesson: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      level: data.level,
      progress: data.progress,
      completed: data.completed,
      tags: data.tags,
    };
  } catch (error) {
    console.error("Error fetching lesson:", error);
    throw error;
  }
};
```

**front-end/actions/session.ts** (Create new file):
```typescript
import { Session } from "@/types/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface CreateSessionData {
  user_id: string;
  course_slug: string;
  lesson_id: number;
}

export const createSession = async (sessionData: CreateSessionData): Promise<Session> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      user_id: data.user_id,
      course_slug: data.course_slug,
      lesson_id: data.lesson_id,
      started_at: new Date(data.started_at),
      ended_at: data.ended_at ? new Date(data.ended_at) : undefined,
      completed: data.completed,
    };
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const getSession = async (sessionId: string): Promise<Session> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch session: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      user_id: data.user_id,
      course_slug: data.course_slug,
      lesson_id: data.lesson_id,
      started_at: new Date(data.started_at),
      ended_at: data.ended_at ? new Date(data.ended_at) : undefined,
      completed: data.completed,
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};

export const updateSession = async (
  sessionId: string,
  updateData: Partial<Session>
): Promise<Session> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update session: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      user_id: data.user_id,
      course_slug: data.course_slug,
      lesson_id: data.lesson_id,
      started_at: new Date(data.started_at),
      ended_at: data.ended_at ? new Date(data.ended_at) : undefined,
      completed: data.completed,
    };
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};
```

**front-end/actions/progress.ts** (Create new file):
```typescript
import { Progress } from "@/types/progress";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface UpdateProgressData {
  progress: number;
  completed: boolean;
}

export const getUserProgress = async (
  userId: string,
  courseSlug?: string
): Promise<Progress[]> => {
  try {
    const url = courseSlug
      ? `${API_BASE_URL}/api/progress/${userId}?course_slug=${encodeURIComponent(courseSlug)}`
      : `${API_BASE_URL}/api/progress/${userId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch progress: ${response.statusText}`);
    }

    const data = await response.json();

    return data.map((p: any) => ({
      user_id: p.user_id,
      course_slug: p.course_slug,
      lesson_id: p.lesson_id,
      progress: p.progress,
      completed: p.completed,
      last_updated: new Date(p.last_updated),
    }));
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw error;
  }
};

export const updateProgress = async (
  userId: string,
  courseSlug: string,
  lessonId: number,
  updateData: UpdateProgressData
): Promise<Progress> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/progress/${userId}?course_slug=${encodeURIComponent(courseSlug)}&lesson_id=${lessonId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update progress: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      user_id: data.user_id,
      course_slug: data.course_slug,
      lesson_id: data.lesson_id,
      progress: data.progress,
      completed: data.completed,
      last_updated: new Date(data.last_updated),
    };
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
};
```

**front-end/types/session.ts** (Create new file):
```typescript
export interface Session {
  id: string;
  user_id: string;
  course_slug: string;
  lesson_id: number;
  started_at: Date;
  ended_at?: Date;
  completed: boolean;
}
```

**front-end/types/progress.ts** (Create new file):
```typescript
export interface Progress {
  user_id: string;
  course_slug: string;
  lesson_id: number;
  progress: number;
  completed: boolean;
  last_updated: Date;
}
```

### Acceptance Criteria
- All actions call backend API
- Error handling in place
- Loading states work
- Data transformation correct
- No hardcoded data

---

## Task 3.2: Error Handling & UX Improvements
**Estimated Time**: 10 hours

### Subtasks

#### 3.2.1: Global Error Boundary
- [ ] Create error boundary component
- [ ] Add error boundary to root layout
- [ ] Add fallback UI for errors
- [ ] Log errors to console/service

#### 3.2.2: Toast Notifications
- [ ] Install and configure Sonner (already in package.json)
- [ ] Create toast utility functions
- [ ] Add toast for API errors
- [ ] Add toast for success messages
- [ ] Add toast for loading states

#### 3.2.3: Retry Logic
- [ ] Add retry utility for failed API calls
- [ ] Implement exponential backoff
- [ ] Add max retry limit
- [ ] Show retry status to user

#### 3.2.4: Loading Indicators
- [ ] Add loading spinner component
- [ ] Add skeleton screens
- [ ] Add loading states to all async operations
- [ ] Improve existing loading states

### Code Changes

**front-end/components/error-boundary.tsx** (Create new file):
```typescript
"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      // Sentry.captureException(error);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            {this.state.error?.message ||
              "An unexpected error occurred. Please try again."}
          </p>
          <Button onClick={this.handleReset}>Try Again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**front-end/lib/toast.ts** (Create new file):
```typescript
import { toast } from "sonner";

export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string, error?: unknown) => {
    console.error(message, error);
    toast.error(message);
  },

  info: (message: string) => {
    toast.info(message);
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};
```

**front-end/lib/api-client.ts** (Create new file):
```typescript
import { showToast } from "./toast";

interface RequestOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithRetry(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, fetchOptions);

      if (response.ok) {
        return response;
      }

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        const error = new Error(`Request failed with status ${response.status}`);
        showToast.error(error.message);
        throw error;
      }

      // Retry on server errors (5xx)
      if (response.status >= 500 && i < retries) {
        const error = new Error(`Server error: ${response.status}`);
        lastError = error;

        // Exponential backoff
        const delay = retryDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));

        continue;
      }

      const error = new Error(`Request failed with status ${response.status}`);
      showToast.error(error.message);
      throw error;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on network errors if we've exhausted retries
      if (i >= retries) {
        showToast.error("Network error. Please check your connection.");
        throw error;
      }

      // Retry after delay
      const delay = retryDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Request failed after retries");
}
```

**front-end/components/loading-skeleton.tsx** (Create new file):
```typescript
import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function LessonListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
```

**front-end/app/[locale]/layout.tsx** - Add error boundary:
```typescript
import { ErrorBoundary } from "@/components/error-boundary";

// ... existing imports

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // ... existing code

  return (
    <ErrorBoundary>
      {/* existing layout content */}
    </ErrorBoundary>
  );
}
```

### Acceptance Criteria
- Error boundary catches and displays errors
- Toast notifications work for all actions
- Retry logic works for failed calls
- Loading states shown consistently
- Good user experience during errors/loads

---

## Task 3.3: Type Safety
**Estimated Time**: 8 hours

### Subtasks

#### 3.3.1: TypeScript Configuration
- [ ] Review tsconfig.json settings
- [ ] Enable strict mode if not already
- [ ] Configure path aliases
- [ ] Add type checking to build

#### 3.3.2: Add Missing Types
- [ ] Create TypeScript interfaces for all API responses
- [ ] Add types for components props
- [ ] Add types for Zustand stores
- [ ] Add types for hooks

#### 3.3.3: Fix Type Errors
- [ ] Run `npm run build` to find type errors
- [ ] Fix all type errors
- [ ] Enable strict type checking
- [ ] Verify no any types

#### 3.3.4: Runtime Validation
- [ ] Add Zod schemas for API responses
- [ ] Add validation at API boundaries
- [ ] Add validation for user inputs
- [ ] Add validation for environment variables

### Code Changes

**front-end/lib/validation.ts** (Create new file):
```typescript
import { z } from "zod";

// API Response Schemas
export const AvatarSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  character: z.string(),
  src: z.string(),
  created_at: z.string().optional(),
});

export const CourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  lessons: z.array(z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "UPPER_INTERMEDIATE", "ADVANCED"]),
    progress: z.number().min(0).max(100),
    completed: z.boolean(),
    tags: z.array(z.string()),
  })),
  created_at: z.string().optional(),
});

export const SessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  course_slug: z.string(),
  lesson_id: z.number(),
  started_at: z.string(),
  ended_at: z.string().optional(),
  completed: z.boolean(),
});

export const ProgressSchema = z.object({
  user_id: z.string(),
  course_slug: z.string(),
  lesson_id: z.number(),
  progress: z.number().min(0).max(100),
  completed: z.boolean(),
  last_updated: z.string(),
});

// Validation Helper
export function validateApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data);
}

export function safeValidateApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error("Validation error:", error);
    return null;
  }
}
```

**front-end/lib/api-client.ts** - Add validation:
```typescript
import { validateApiResponse, AvatarSchema, CourseSchema } from "./validation";

export async function fetchValidated<T>(
  url: string,
  schema: z.ZodSchema<T>,
  options?: RequestOptions
): Promise<T> {
  const response = await fetchWithRetry(url, options);
  const data = await response.json();
  return validateApiResponse(schema, data);
}
```

### Acceptance Criteria
- TypeScript strict mode enabled
- No type errors in build
- All API responses validated
- Runtime validation in place
- Good type coverage

---

## Task 3.4: State Management
**Estimated Time**: 6 hours

### Subtasks

#### 3.4.1: Review Zustand Stores
- [ ] Review existing stores
- [ ] Ensure stores follow best practices
- [ ] Add TypeScript types to stores
- [ ] Add persistence where needed

#### 3.4.2: Add New Stores
- [ ] Create user store for auth state
- [ ] Create session store for active session
- [ ] Create progress store for tracking

#### 3.4.3: Optimize State
- [ ] Implement optimistic updates
- [ ] Add caching strategies
- [ ] Add local storage persistence
- [ ] Add state hydration

### Code Changes

**front-end/store/user.ts** (Create new file):
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
```

**front-end/store/session.ts** (Create new file):
```typescript
import { create } from "zustand";
import { Session } from "@/types/session";

interface SessionStore {
  activeSession: Session | null;
  setActiveSession: (session: Session | null) => void;
  updateSession: (updates: Partial<Session>) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  activeSession: null,
  setActiveSession: (session) => set({ activeSession: session }),
  updateSession: (updates) =>
    set((state) => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, ...updates }
        : null,
    })),
  clearSession: () => set({ activeSession: null }),
}));
```

### Acceptance Criteria
- All stores typed properly
- State persisted where needed
- Optimistic updates working
- Clean state management

---

## Sprint 3 Checklist

### API Integration
- [ ] Avatar actions updated
- [ ] Course actions updated
- [ ] Lesson actions updated
- [ ] Session actions created
- [ ] Progress actions created

### Error Handling
- [ ] Error boundary implemented
- [ ] Toast notifications working
- [ ] Retry logic implemented
- [ ] Loading states improved

### Type Safety
- [ ] TypeScript strict mode enabled
- [ ] All types defined
- [ ] No type errors
- [ ] Runtime validation added

### State Management
- [ ] Stores reviewed
- [ ] New stores created
- [ ] Optimistic updates
- [ ] Persistence working

### Testing
- [ ] API integration tested
- [ ] Error handling tested
- [ ] Type checking passes
- [ ] State management tested

---

## Definition of Done

A task is complete when:
- [ ] All subtasks checked
- [ ] Code committed
- [ ] Locally tested
- [ ] No regressions

Sprint complete when:
- [ ] Frontend integrated with backend
- [ ] Error handling robust
- [ ] Type-safe codebase
- [ ] Good UX throughout

---

## Blocked By

- Sprint 2: Backend MVP (MUST be completed first)

---

## Risks

- **Medium Risk**: API changes may break frontend
  - **Mitigation**: Keep frontend flexible, use validation

- **Low Risk**: State management complexity
  - **Mitigation**: Keep stores simple, document clearly

---

## Notes

- Focus on user experience
- Make errors friendly and helpful
- Keep loading states fast
- Type safety is important
- Test thoroughly

---

## Next Sprint

After completing Sprint 3, proceed to **Sprint 4: Authentication & Security**
