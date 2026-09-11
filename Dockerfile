# ══════════════════════════════════════════════════════════
# Stage 1: Dependencies
# ══════════════════════════════════════════════════════════
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY .npmrc ./

# Install exact production & build dependencies
RUN npm ci --legacy-peer-deps

# ══════════════════════════════════════════════════════════
# Stage 2: Builder
# ══════════════════════════════════════════════════════════
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables for static code generation and bundle build
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy?schema=public"
ENV AUTH_SECRET="build_dummy_secret_32_chars_long_for_nextjs"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma Client (outputs to src/generated/prisma)
RUN npx prisma generate

# Build Next.js with standalone output
RUN npm run build

# ══════════════════════════════════════════════════════════
# Stage 3: Runner (Production Runtime)
# ══════════════════════════════════════════════════════════
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3010
ENV HOSTNAME="0.0.0.0"

# Security Hardening: Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and public directory
COPY --from=builder /app/public ./public

# Ensure upload directory exists with write permissions for nextjs user
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Copy standalone output and static chunks
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and generated client for migrations and runtime queries
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
ENV PATH="/app/node_modules/.bin:${PATH}"
COPY --chmod=755 docker-entrypoint.sh ./

USER nextjs

EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3010/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]

