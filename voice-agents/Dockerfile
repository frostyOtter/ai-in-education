# Use Python 3.12 slim image as the base
FROM python:3.12-slim-bookworm AS base

# Build stage - prepare dependencies and application
FROM base AS builder

# Copy uv package manager from official image
COPY --from=ghcr.io/astral-sh/uv:0.7.12 /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
WORKDIR /app

COPY uv.lock pyproject.toml /app/

RUN uv sync --locked
RUN uv pip install bithuman==0.5.22

COPY . /app

# Final runtime stage - minimal image with only what's needed
FROM base

# Install OpenGL libraries required for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app /app

WORKDIR /app

ENV PATH="/app/.venv/bin:$PATH"

CMD ["python", "main.py", "start"]