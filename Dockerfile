# Dockerfile for https://github.com/dbcls/sparqlist

FROM node:20

ENV PORT 3000
ENV ADMIN_PASSWORD sparqlist
ENV ROOT_PATH=/sparqlist/

RUN npm -g install npm
RUN useradd --create-home --home-dir /app app

USER app
WORKDIR /app
COPY --chown=app:app . .

RUN npm ci --production && npm run build
CMD npm start
