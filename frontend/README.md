# SPARQList frontend

This frontend is a React application built with Vite.

## Development

Install dependencies and start the Vite dev server:

```sh
npm install
npm run dev
```

The backend still runs from the repository root:

```sh
cd ..
npm run watch
```

The Vite dev server proxies API requests to `http://127.0.0.1:3000`.

## Build

Build static assets:

```sh
npm run build
```

The repository root uses `npm run build` to emit the frontend into `../public`.
