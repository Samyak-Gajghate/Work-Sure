FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source, scripts, and build
COPY tsconfig.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/
RUN npx tsc --noEmit && npm run build
RUN npx tsc scripts/migrate.ts --esModuleInterop --skipLibCheck

# ---- Runtime ----
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Only production deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled output, migrations, and compiled scripts
COPY --from=builder /app/dist ./dist
COPY migrations/ ./migrations/
COPY --from=builder /app/scripts/ ./scripts/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
