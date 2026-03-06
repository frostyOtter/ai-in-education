# Base image
FROM node:20-alpine AS builder

# Working directory
WORKDIR /app

# Build arguments for environment variables
ARG LIVEKIT_URL
ARG API_DATA_URL
ARG LIVEKIT_EMAIL
ARG LIVEKIT_PASSWORD

# env variables
ENV LIVEKIT_URL=${LIVEKIT_URL}
ENV API_DATA_URL=${API_DATA_URL}
ENV LIVEKIT_EMAIL=${LIVEKIT_EMAIL}
ENV LIVEKIT_PASSWORD=${LIVEKIT_PASSWORD}

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build app
RUN npm run build

# ----------------------------
# Runner image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install gettext (includes envsubst)
RUN apk add --no-cache gettext

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/messages ./messages
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server.js"]
