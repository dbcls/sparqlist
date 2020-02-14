import crypto from 'crypto';
import mime from 'mime';
import promiseRouter from 'express-promise-router';

import Repository from './repository.mjs';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default function createRouter(repositoryPath, adminPassword, pathPrefix) {
  const hashedAdminPasswordBuffer = Buffer.from(hashPassword(adminPassword));
  const adminDisabled             = adminPassword === ''
  const repository                = new Repository(repositoryPath, pathPrefix);

  function validateToken(challenge) {
    const challengeBuffer = Buffer.from(challenge);

    if (challengeBuffer.length !== hashedAdminPasswordBuffer.length) { return false; }

    return crypto.timingSafeEqual(challengeBuffer, hashedAdminPasswordBuffer);
  }

  function requireAuthentication(req, res, next) {
    if (adminDisabled) {
      return res.sendStatus(401);
    }

    const auth = req.header('authorization');
    const match = auth.match(/^Bearer (.*)$/);

    if (!match) {
      return res.sendStatus(401);
    }

    const token = match[1];

    if (!validateToken(token)) {
      return res.sendStatus(403);
    }

    next();
  }

  async function loadSparqlet(req, res, next) {
    const sparqlet = await repository.find(req.params.sparqlet_id);

    if (!sparqlet) {
      return res.sendStatus(404);
    }

    req.sparqlet = sparqlet;

    next();
  }

  function handleFormat(req, res, next) {
    if (req.params.format) {
      req.headers.accept = mime.lookup(req.params.format);
    }

    next();
  }

  async function handleSparqlet(req, res) {
    const params = Object.assign({}, req.query, req.body);
    const data   = await req.sparqlet.execute(params, req.header('accept'));

    res.set('Access-Control-Allow-Origin', '*');

    if (data.error) {
      return res.status(500).send(data.error);
    }

    if (data.contentType) {
      res.set('Content-Type', data.contentType);
    }

    res.send(data.results);
  }

  const router = promiseRouter();

  router.get('/api/:sparqlet_id.:format?', loadSparqlet, handleFormat, handleSparqlet);
  router.post('/api/:sparqlet_id.:format?', loadSparqlet, handleFormat, handleSparqlet);

  router.get('/trace/:sparqlet_id.:format?', loadSparqlet, handleFormat, async (req, res) => {
    const data = await req.sparqlet.execute(req.query, req.header('accept'));

    res.set('Access-Control-Allow-Origin', '*');

    if (data.error) {
      res.status(500);
    }

    res.json(data);
  });

  router.get('/-api/sparqlets', async (req, res) => {
    const sparqlets = await repository.all();

    res.json({
      data: sparqlets
    });
  });

  router.get('/-api/sparqlets/:sparqlet_id', loadSparqlet, async (req, res) => {
    res.json({
      data: req.sparqlet
    });
  });

  router.patch('/-api/sparqlets/:sparqlet_id', requireAuthentication, async (req, res) => {
    const src      = req.body.data.attributes.src;
    const sparqlet = await repository.update(req.params.sparqlet_id, src);

    if (!sparqlet) {
      return res.sendStatus(404);
    }

    res.json({
      data: sparqlet
    });
  });

  router.post('/-api/sparqlets', requireAuthentication, async (req, res) => {
    const src = req.body.data.attributes.src || '';
    const id  = req.body.data.attributes.name;

    if (!repository.isValidName(id)) {
      return res.status(422).json({
        errors: [
          {
            status: 400,
            detail: 'specified SPARQLet name is not valid'
          }
        ]
      });
    }

    let sparqlet;

    try {
      sparqlet = await repository.create(id, src);
    } catch (e) {
      if (e.code === 'EEXIST') {
        return res.status(422).json({
          errors: [
            {
              status: 400,
              detail: 'specified SPARQLet name is already used'
            }
          ]
        });
      }
    }

    if (!sparqlet) {
      return res.sendStatus(404);
    }

    res.json({
      data: sparqlet
    });
  });

  router.delete('/-api/sparqlets/:sparqlet_id', requireAuthentication, loadSparqlet, async (req, res) => {
    await repository.delete(req.params.sparqlet_id);

    res.sendStatus(204);
  });

  router.post('/token', async (req, res) => {
    if (adminDisabled) {
      return res.status(401).json({
        error: 'Authenitacion failed'
      });
    }

    if (req.body.grant_type !== 'password') {
      return res.status(403).json({
        error: 'Specified grant_type is not supported'
      });
    }

    const token = hashPassword(req.body.password);

    if (!validateToken(token)) {
      return res.status(403).json({
        error: 'Authenitacion failed'
      });
    }

    res.json({
      access_token: hashPassword(req.body.password)
    });
  });

  return router;
};
