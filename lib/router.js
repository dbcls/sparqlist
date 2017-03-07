const crypto = require('crypto');
const router = require('express-promise-router')();
const mime = require('mime');

const Repository = require('./repository');

function hashPassword(password) {
  const h = crypto.createHash('sha256');
  h.update(password);
  return h.digest('hex');
}

module.exports = (repositoryPath, adminPassword) => {
  const hashedAdminPasswordBuffer = new Buffer(hashPassword(adminPassword));
  const adminDisabled = adminPassword === "";
  const repository = new Repository(repositoryPath);

  function validateToken(challenge) {
    const challengeBuffer = new Buffer(challenge);
    if (challengeBuffer.length != hashedAdminPasswordBuffer.length) {
      return false;
    }
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

  router.get('/api/:sparqlet_id.:format?', loadSparqlet, handleFormat, async (req, res) => {
    const data = await req.sparqlet.execute(req);
    res.set('Access-Control-Allow-Origin', '*');
    if (data.error) {
      return res.status(500).json({
        error: data.error.message
      });
    }
    if (data.contentType) {
      res.set('Content-Type', data.contentType);
    }
    res.send(data.results);
  });

  router.get('/trace/:sparqlet_id.:format?', loadSparqlet, handleFormat, async (req, res) => {
    const data = await req.sparqlet.execute(req);
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
    const src = req.body.data.attributes.src;
    const sparqlet = await repository.update(req.params.sparqlet_id, src);

    if (!sparqlet) {
      res.sendStatus(404);
    } else {
      res.json({
        data: sparqlet
      });
    }
  });

  router.post('/-api/sparqlets', requireAuthentication, async (req, res) => {
    const src = req.body.data.attributes.src || '';
    const id = req.body.data.id;
    if (!repository.isValidName(id)) {
      return res.status(422).json({errors: [{status: 400, detail: 'specified SPARQLet name is not valid'}]});
    }
    const sparqlet = await repository.create(id, src);

    if (!sparqlet) {
      res.sendStatus(404);
    } else {
      res.json({
        data: sparqlet
      });
    }
  });

  router.delete('/-api/sparqlets/:sparqlet_id', requireAuthentication, loadSparqlet, async (req, res) => {
    await repository.delete(req.params.sparqlet_id);
    res.sendStatus(204);
  });

  router.post('/token', async (req, res) => {
    if (adminDisabled) {
      return res.status(401).json({error: 'Authenitacion failed'});
    }
    if (req.body.grant_type !== 'password') {
      return res.status(403).json({error: 'Specified grant_type is not supported'});
    }
    const token = hashPassword(req.body.password);
    if (validateToken(token)) {
      res.json({access_token: hashPassword(req.body.password)});
    } else {
      res.status(403).json({error: 'Authenitacion failed'});
    }
  });

  return router;
};
