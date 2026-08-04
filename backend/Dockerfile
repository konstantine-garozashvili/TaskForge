# syntax=docker/dockerfile:1

# ---- Stage 1 : dépendances de production ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---- Stage 2 : runtime minimal ----
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Utilisateur non-root (CDC §8)
RUN addgroup -S taskforge && adduser -S taskforge -G taskforge

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY openapi.yaml ./
COPY src ./src

USER taskforge
EXPOSE 5000
CMD ["node", "src/server.js"]
