# Dockerfile for https://github.com/dbcls/sparqlist

FROM node:12

ENV PORT 3000
ENV ADMIN_PASSWORD sparqlist
ENV ROOT_PATH=/sparqlist/

RUN useradd --create-home app
RUN install --owner app --group app --directory /app

USER app
WORKDIR /app

RUN git clone https://github.com/dbcls/sparqlist.git .
RUN npm install && npm run build
CMD npm start
