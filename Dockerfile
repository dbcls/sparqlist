# Dockerfile for https://github.com/dbcls/sparqlist

FROM node:10.15

ENV PORT 3000
ENV ADMIN_PASSWORD sparqlist
ENV ROOT_PATH=/sparqlist/

RUN useradd --create-home sparqlist
RUN install --owner sparqlist --group sparqlist --directory /app

USER sparqlist
WORKDIR /app

RUN git clone https://github.com/dbcls/sparqlist.git .
RUN npm install
CMD npm start
