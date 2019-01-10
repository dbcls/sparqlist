# SPARQList

SPARQList is a REST API server which executes a SPARQL query, transform the result into formatted data if defined, and then send it back to a web client application. The configuration of API is written in the Markdown format in which parameters of the API, SPARQL endpoints and SPARQL queries, and JavaScript functions for data transformation are defined along with a free text documentation. Each SPARQList server instance can host multiple API configurations, therefore, each service can also be considered as a repository of reusable SPARQL queries with documentation. Find more information in [GUIDE](doc/GUIDE.md), [REFERENCE](doc/REFERENCE.md) and a [SWAT4HCLS 2017 abstract](http://ceur-ws.org/Vol-2042/paper47.pdf).

## Docker

    $ docker run dbcls/sparqlist

## Prerequisites

* [Node.js](https://nodejs.org/) v10.x
* [yarn](https://yarnpkg.com/) v1.12.3

## Install

    $ git clone git@github.com:dbcls/sparqlist.git
    $ cd sparqlist
    $ yarn install

If you want to deploy SPARQList under a subdirectory, pass the directory via `ROOT_PATH`:

    $ ROOT_PATH=/foo/ yarn install

(Note that `ROOT_PATH` must end with `/`.)

## Run

    $ PORT=3000 ADMIN_PASSWORD=changeme yarn start

If you want to deploy SPARQList under a subdirectory, pass the directory via `ROOT_PATH`:

    $ ROOT_PATH=/foo/ PORT=3000 ADMIN_PASSWORD=changeme yarn start

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

### `ROOT_PATH`

(default: `/`)

Path of root. If you want to deploy SPARQList under a subdirectory, specify the directory. Note that `ROOT_PATH` must end with `/`.

## Development

### Backend

    $ cd sparqlist
    $ yarn watch

Open http://localhost:3000 in your browser for backend development.

### Frontend

    $ cd sparqlist/frontend
    $ yarn start --proxy http://localhost:3000

Open http://localhost:4200 on your browser for frontend development.

Note that some requests, such as `/api`, can't be processed on http://localhost:4200 because the `--proxy` option does not work for these paths. Try them on http://localhost:3000.
