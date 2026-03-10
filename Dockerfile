# Dockerfile for https://github.com/dbcls/sparqlist

FROM node:24

ENV PORT=3000
ENV ADMIN_PASSWORD=sparqlist
ENV ROOT_PATH=/sparqlist/

RUN npm -g install npm
RUN useradd --create-home --home-dir /app app

USER app
WORKDIR /app
COPY --chown=app:app . .

RUN npm ci && npm run build && npm prune --omit=dev
CMD ["npm", "start"]
