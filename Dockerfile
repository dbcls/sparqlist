# Dockerfile for https://github.com/dbcls/sparqlist

FROM node:14

ENV PORT 3000
ENV ADMIN_PASSWORD sparqlist
ENV ROOT_PATH=/sparqlist/

RUN useradd --create-home --home-dir /app app

USER app
WORKDIR /app
COPY --chown=app:app . .

RUN npm ci --production && npm run build
CMD npm start
