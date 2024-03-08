# SPARQList

SPARQList is a REST API server which executes a SPARQL query, transform the result into formatted data if defined, and then send it back to a web client application. The configuration of API is written in the Markdown format in which parameters of the API, SPARQL endpoints and SPARQL queries, and JavaScript functions for data transformation are defined along with a free text documentation. Each SPARQList server instance can host multiple API configurations, therefore, each service can also be considered as a repository of reusable SPARQL queries with documentation. Find more information in [GUIDE](doc/GUIDE.md), [REFERENCE](doc/REFERENCE.md) and a [SWAT4HCLS 2017 abstract](http://ceur-ws.org/Vol-2042/paper47.pdf).

## Docker

    $ docker run ghcr.io/dbcls/sparqlist

## Prerequisites

- [Node.js](https://nodejs.org/) 20.11.1 or later

## Install and Run

    $ git clone https://github.com/dbcls/sparqlist.git
    $ cd sparqlist
    $ npm install
    $ npm run build

Then, start SPARQList:

    $ PORT=3000 ADMIN_PASSWORD=changeme npm start

### Deploy under a subdirectory

If you want to deploy SPARQList under a subdirectory (say, `/foo/`), pass the directory via `ROOT_PATH` to `npm run build` and `npm start`:

    $ ROOT_PATH=/foo/ npm run build
    $ ROOT_PATH=/foo/ PORT=3000 ADMIN_PASSWORD=changeme npm start

(Note that `ROOT_PATH` must end with `/`.)

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

### `BODY_SIZE_LIMIT`

(default: '10mb')

Limit of maximum request body size.

### `SERVER_TIMEOUT`

(default: 0)

API timeout in milliseconds (0 means no timeout). Effective for '/api' and '/trace' paths only.

## Development

### Backend

    $ cd sparqlist
    $ npm run watch

### Frontend

    $ cd sparqlist/frontend
    $ npm run build -- --output ../public --watch

Open http://localhost:3000 in your browser.
