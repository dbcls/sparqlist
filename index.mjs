import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import url from 'url';

import createRouter from './lib/create-router.mjs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const port = process.env.PORT || 3000;
const repositoryPath = process.env.REPOSITORY_PATH || './repository';
const adminPassword = process.env.ADMIN_PASSWORD || '';
const pathPrefix = process.env.ROOT_PATH || '/';
const bodySizeLimit = process.env.BODY_SIZE_LIMIT || '10mb';
const timeoutMillisec = Number(process.env.SERVER_TIMEOUT || 0);
const router = createRouter(
  repositoryPath,
  adminPassword,
  pathPrefix,
  timeoutMillisec
);

const app = express();

app.set('query parser', 'extended');
app.set('json spaces', 2);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(
  bodyParser.json({ type: 'application/vnd.api+json', limit: bodySizeLimit })
);
app.use(bodyParser.urlencoded({ extended: true, limit: bodySizeLimit }));

app.use(pathPrefix, router);
app.use(pathPrefix, express.static(__dirname + '/public'));

app.get('/*', async (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.use((err, req, res, next) => {
  if (req.timedout && !res.headerSent) {
    res.status(503).json({ error: 'request timeout' });
  } else {
    if (err.code === 'ENOENT') {
      res.sendStatus(404);
    } else {
      console.log('ERROR', err);

      res.status(422).json({ errors: [{ status: 500, detail: err.message }] });
    }
  }
});

app.listen(port, () => {
  const timeoutMessage = timeoutMillisec
    ? `timeout in ${timeoutMillisec}ms`
    : `no timeout`;

  console.log(
    `listening on ${port}, repository is at ${repositoryPath}, body size limit ${bodySizeLimit}, ${timeoutMessage}`
  );
});
