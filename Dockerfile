# Dockerfile for https://github.com/dbcls/sparqlist

FROM node:10.15

WORKDIR /opt/git

RUN useradd -m sparqlist
RUN chown sparqlist /opt/git
USER sparqlist

RUN git clone https://github.com/dbcls/sparqlist.git

WORKDIR /opt/git/sparqlist

ENV PORT 3000
ENV ADMIN_PASSWORD sparqlist
ENV ROOT_PATH=/sparqlist/

RUN npm install

CMD npm start
