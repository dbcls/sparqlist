# Dockerfile for https://github.com/dbcls/sparqlist

FROM node:24 AS builder

ENV ROOT_PATH=/sparqlist/
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM node:24 AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV ADMIN_PASSWORD=sparqlist
ENV ROOT_PATH=/sparqlist/

RUN useradd --create-home --home-dir /app app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=app:app /app/index.mjs ./index.mjs
COPY --from=builder --chown=app:app /app/lib ./lib
COPY --from=builder --chown=app:app /app/repository ./repository
COPY --from=builder --chown=app:app /app/public ./public

USER app
CMD ["npm", "start"]
