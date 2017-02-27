# SPARQList

## Prerequisites

* [Node.js](https://nodejs.org/) v7.6.0
* [yarn](https://yarnpkg.com/) v0.20.3

## Install

    $ git clone git@github.com:enishitech/sparqlist.git
    $ cd sparqlist
    $ yarn install

## Run

    $ PORT=3000 ADMIN_PASSWORD=changeme yarn start

## Configuration

All configurations are done with environment variables.

### `PORT`

(default: `3000`)

Port to listen on.

### `REPOSITORY_PATH`

(default: `./repository`)

Path to SPARQLet repository.

### `ADMIN_PASSWORD`

(default: empty)

Admin password. If left empty, all administrative features are disabled.
