# Dockerfile for https://github.com/dbcls/sparqlist

FROM ubuntu:16.04

ARG node_version=v8.9.4

RUN apt-get -qq update && apt-get -qq install -y \
    pkg-config \
    sudo \
    curl \
    wget \
    git \
    jq \
    vim

# RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
# 
# RUN apt-get install yarn

WORKDIR /opt/src

RUN wget --no-check-certificate https://nodejs.org/dist/${node_version}/node-${node_version}-linux-x64.tar.xz
RUN tar xvf node-${node_version}-linux-x64.tar.xz

ENV PATH /opt/bin:$PATH

RUN ln -s /opt/src/node-${node_version}-linux-x64/bin /opt/bin
RUN npm install -g yarn
#RUN npm install -g forever

WORKDIR /opt/git

RUN useradd -m sparqlist
RUN chown sparqlist /opt/git
USER sparqlist

RUN git clone https://github.com/dbcls/sparqlist.git

WORKDIR /opt/git/sparqlist

ENV PORT 3000
ENV ADMIN_PASSWORD sparqlist
ENV ROOT_PATH=/sparqlist/

RUN yarn install

#CMD forever --workingDir=/opt/git/sparqlist yarn start > yarn.log
CMD yarn start


