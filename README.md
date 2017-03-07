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

## Development

### Backend

    $ cd sparqlist
    $ yarn watch

Open http://localhost:3000 in your browser for backend development.

### Frontend

    $ cd sparqlist/frontend
    $ yarn start -- --proxy http://localhost:3000

Open http://localhost:4200 on your browser for frontend development.

Note that some requests, such as `/api`, can't be processed on http://localhost:4200 because the `--proxy` option does not work for these paths. Try them on http://localhost:3000.
