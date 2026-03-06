# Sprint 6: Data Persistence

## Overview
**Duration**: 1 week
**Goal**: Replace in-memory database with real database (PostgreSQL)
**Priority**: MEDIUM - Important for production
**Depends On**: Sprint 5 (Testing Infrastructure)

---

## Task 6.1: Database Setup
**Estimated Time**: 8 hours

### Subtasks

#### 6.1.1: Choose and Configure Database
- [ ] Choose PostgreSQL (recommended)
- [ ] Add PostgreSQL to docker-compose
- [ ] Configure database connection
- [ ] Set up database user and password
- [ ] Test database connectivity

#### 6.1.2: ORM Setup
- [ ] Add SQLAlchemy to backend
- [ ] Add Alembic for migrations
- [ ] Configure ORM settings
- [ ] Create base model class
- [ ] Test ORM connection

### Code Changes

**docker-compose.yaml** - Add PostgreSQL:
```yaml
services:
  # ... existing services ...

  postgres:
    container_name: aie-postgres
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: aie_user
      POSTGRES_PASSWORD: aie_password
      POSTGRES_DB: aie_db
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - aie-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aie_user -d aie_db"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  aie-network:
    driver: bridge

volumes:
  postgres-data:
  livekit-data:
```

**backend/pyproject.toml** - Add ORM dependencies:
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
    "sqlalchemy>=2.0.0",
    "asyncpg>=0.29.0",
    "alembic>=1.12.0",
]
```

**backend/database.py** - Create ORM models:
```python
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.exc import SQLAlchemyError
from loguru import logger
from datetime import datetime
from settings import get_settings

settings = get_settings()

# Create async engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="student")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    sessions = relationship("Session", back_populates="user")
    progress = relationship("Progress", back_populates="user")

class Avatar(Base):
    __tablename__ = "avatars"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    character = Column(String)
    src = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    level = Column(String, nullable=False)
    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    tags = Column(String)  # JSON string
    course_slug = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Course(Base):
    __tablename__ = "courses"

    slug = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_slug = Column(String, nullable=False)
    lesson_id = Column(Integer, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime)
    completed = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="sessions")

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_slug = Column(String, nullable=False)
    lesson_id = Column(Integer, nullable=False)
    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="progress")

# Database dependency
def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except SQLAlchemyError as e:
        logger.error(f"Error creating database tables: {e}")
        raise
```

**backend/alembic.ini** (Create new file):
```ini
# A generic, single database configuration.

[alembic]
# path to migration scripts
script_location = alembic

# template used to generate migration file names
file_template = %%(year)d%%(month).2d%%(day).2d_%%(hour).2d%%(minute).2d_%%(rev)s_%%(slug)s

# sys.path path, will be prepended to sys.path if present.
prepend_sys_path = .

# timezone to use when rendering the date within the migration file
timezone = UTC

# max length of characters to apply to the
# "slug" field
truncate_slug_length = 40

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
revision_environment = false

# set to 'true' to allow .pyc and .pyo files without
# a source .py file to be detected as revisions in the
# versions/ directory
sourceless = false

# version location specification; This defaults
# to alembic/versions.  When using multiple version
# directories, initial revisions must be specified with --version-path.
version_locations = %(here)s/alembic/versions

# version path separator; As mentioned above, this is the character used to split
# version_locations. The default within new alembic.ini files is "os", which uses os.pathsep.
version_path_separator = os

# set to 'true' to search source files recursively
# in each "version_locations" directory
recursive_version_locations = false

# the output encoding used when revision files
# are written from script.py.mako
output_encoding = utf-8

sqlalchemy.url = postgresql://aie_user:aie_password@localhost:5432/aie_db


[post_write_hooks]
# post_write_hooks defines scripts or Python functions that are run
# on newly generated revision scripts.  See the documentation for further
# detail and examples

# format using "black" - use the console_scripts runner, against the "black" entrypoint
# hooks = black
# black.type = console_scripts
# black.entrypoint = black
# black.options = -l 79 REVISION_SCRIPT_FILENAME

# lint with attempts to fix using "ruff" - use the exec runner, execute a binary
# hooks = ruff
# ruff.type = exec
# ruff.executable = %(here)s/.venv/bin/ruff
# ruff.options = --fix REVISION_SCRIPT_FILENAME

# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

**backend/alembic/env.py** (Create new file):
```python
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Import models
from database import Base
from settings import get_settings

settings = get_settings()

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here
target_metadata = Base.metadata

# Set sqlalchemy.url from settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

### Acceptance Criteria
- PostgreSQL running in docker
- ORM configured
- Database models created
- Connection tested

---

## Task 6.2: Backend Integration
**Estimated Time**: 16 hours (2 days)

### Subtasks

#### 6.2.1: Create Migrations
- [ ] Create initial migration
- [ ] Add migration for seed data
- [ ] Test migrations
- [ ] Document migration process

#### 6.2.2: Update Routes
- [ ] Update avatar routes to use ORM
- [ ] Update course routes to use ORM
- [ ] Update lesson routes to use ORM
- [ ] Update session routes to use ORM
- [ ] Update progress routes to use ORM

#### 6.2.3: Update Auth
- [ ] Update user auth to use ORM
- [ ] Update password hashing
- [ ] Update token validation
- [ ] Test auth flows

### Code Changes

**backend/routes/avatars.py** - Update to use ORM:
```python
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from models import Avatar, AvatarCreate, AvatarUpdate
from database import get_db
from loguru import logger

router = APIRouter(prefix="/api/avatars", tags=["avatars"])

@router.get("", response_model=List[Avatar])
async def list_avatars(db: Session = Depends(get_db)):
    """List all available avatars"""
    logger.info("Fetching all avatars")
    avatars = db.query(database.Avatar).all()
    return [Avatar(
        id=str(a.id),
        name=a.name,
        description=a.description or "",
        character=a.character or "",
        src=a.src or "",
        created_at=a.created_at
    ) for a in avatars]

@router.get("/{avatar_id}", response_model=Avatar)
async def get_avatar(avatar_id: str, db: Session = Depends(get_db)):
    """Get avatar by ID"""
    logger.info(f"Fetching avatar {avatar_id}")
    avatar = db.query(database.Avatar).filter(
        database.Avatar.id == avatar_id
    ).first()

    if not avatar:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Avatar {avatar_id} not found"
        )

    return Avatar(
        id=str(avatar.id),
        name=avatar.name,
        description=avatar.description or "",
        character=avatar.character or "",
        src=avatar.src or "",
        created_at=avatar.created_at
    )

@router.post("", response_model=Avatar, status_code=status.HTTP_201_CREATED)
async def create_avatar(
    avatar_data: AvatarCreate,
    db: Session = Depends(get_db)
):
    """Create a new avatar"""
    logger.info(f"Creating new avatar: {avatar_data.name}")

    avatar = database.Avatar(
        id=str(uuid.uuid4()),
        name=avatar_data.name,
        description=avatar_data.description,
        character=avatar_data.character,
        src=avatar_data.src
    )

    db.add(avatar)
    db.commit()
    db.refresh(avatar)

    return Avatar(
        id=str(avatar.id),
        name=avatar.name,
        description=avatar.description or "",
        character=avatar.character or "",
        src=avatar.src or "",
        created_at=avatar.created_at
    )
```

### Acceptance Criteria
- All routes use ORM
- Migrations working
- Auth uses ORM
- Data persists

---

## Task 6.3: Migration Path
**Estimated Time**: 8 hours

### Subtasks

#### 6.3.1: Data Migration
- [ ] Create migration script for in-memory data
- [ ] Test data migration
- [ ] Validate migrated data
- [ ] Backup in-memory data

#### 6.3.2: Remove Old Code
- [ ] Remove in-memory database
- [ ] Remove seed data (now in migrations)
- [ ] Update tests
- [ ] Update documentation

### Code Changes

**backend/scripts/migrate_data.py** (Create new file):
```python
import sys
from loguru import logger
from database import SessionLocal, Base, init_db

def migrate_data():
    """Migrate data from in-memory to database"""
    logger.info("Starting data migration...")

    db = SessionLocal()

    try:
        # Avatars
        avatars = [
            {
                "id": "1",
                "name": "Luna",
                "description": "A warm and patient teacher",
                "character": "😄 Friendly and encouraging",
                "src": "/luna.mp4"
            },
            {
                "id": "2",
                "name": "Jay",
                "description": "A structured instructor",
                "character": "😊 Professional and focused",
                "src": "/jay.mp4"
            },
            {
                "id": "3",
                "name": "Emma",
                "description": "An enthusiastic mentor",
                "character": "🔥 Energetic and fun",
                "src": "/emma.mp4"
            },
        ]

        for avatar_data in avatars:
            avatar = database.Avatar(**avatar_data)
            db.add(avatar)

        # Courses
        courses = [
            {
                "slug": "/lessons/environment",
                "title": "Environment",
                "description": "Learn about nature, climate, and environmental",
                "icon": "Environment"
            },
            {
                "slug": "/lessons/traffic",
                "title": "Traffic",
                "description": "Transportation, driving, and city navigation",
                "icon": "Traffic"
            },
            # ... more courses
        ]

        for course_data in courses:
            course = database.Course(**course_data)
            db.add(course)

        db.commit()
        logger.info("Data migration completed successfully")

    except Exception as e:
        logger.error(f"Error migrating data: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    migrate_data()
```

### Acceptance Criteria
- Data migrated successfully
- Old code removed
- Tests updated
- Documentation updated

---

## Sprint 6 Checklist

### Database Setup
- [ ] PostgreSQL in docker
- [ ] ORM configured
- [ ] Models created
- [ ] Connection tested

### Backend Integration
- [ ] Migrations created
- [ ] Routes updated
- [ ] Auth updated
- [ ] All endpoints working

### Migration Path
- [ ] Data migration script
- [ ] Data migrated
- [ ] Old code removed
- [ ] Tests updated

### Testing
- [ ] Database tests pass
- [ ] Integration tests pass
- [ ] Data persisted
- [ ] No data loss

---

## Definition of Done

A task is complete when:
- [ ] All subtasks checked
- [ ] Code committed
- [ ] Tests pass
- [ ] Data persists

Sprint complete when:
- [ ] Database fully functional
- [ ] All data persisted
- [ ] Migrations working
- [ ] No in-memory DB

---

## Blocked By

- Sprint 5: Testing Infrastructure (MUST be completed first)

---

## Risks

- **Medium Risk**: Data migration issues
  - **Mitigation**: Test thoroughly, backup data, have rollback plan

- **Low Risk**: Performance degradation
  - **Mitigation**: Add indexes, optimize queries

---

## Notes

- Test migrations thoroughly
- Backup data before migration
- Use transactions for data integrity
- Monitor database performance
- Plan for scaling

---

## Next Sprint

After completing Sprint 6, proceed to **Sprint 7: Production Readiness**
