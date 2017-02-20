const crypto = require('crypto');
const router = require('express-promise-router')();

const Repository = require('./repository');

function hashPassword(password) {
  const h = crypto.createHash('sha256');
  h.update(password);
  return h.digest('hex');
}

module.exports = (repositoryPath, adminPassword) => {
  const hashedAdminPasswordBuffer = new Buffer(hashPassword(adminPassword));
  const adminDisabled = adminPassword === "";

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

  router.get('/-?api/:name.json', async (req, res) => {
    const repository = new Repository(repositoryPath);
    const name = req.params.name;
    const sparqlet = await repository.find(name);
    const traceMode = req.path.match(/^\/-api/);

    if (!sparqlet) {
      res.sendStatus(404);
    } else {
      const data = await sparqlet.execute(req.query);
      res.set('Access-Control-Allow-Origin', '*');
      if (data.error) {
        res.status(500);
      }
      if (traceMode) {
        res.json(data);
      } else {
        res.json(data.results);
      }
    }
  });

  router.get('/-api/sparqlets', async (req, res) => {
    const repository = new Repository(repositoryPath);
    const sparqlets = await repository.all();

    res.json({
      data: sparqlets
    });
  });

  router.get('/-api/sparqlets/:name', async (req, res) => {
    const repository = new Repository(repositoryPath);
    const name = req.params.name;
    const sparqlet = await repository.find(name);

    if (!sparqlet) {
      res.sendStatus(404);
    } else {
      res.json({
        data: sparqlet
      });
    }
  });

  router.patch('/-api/sparqlets/:name', requireAuthentication, async (req, res) => {
    const repository = new Repository(repositoryPath);
    const name = req.params.name;

    const src = req.body.data.attributes.src;
    const sparqlet = await repository.update(name, src);

    if (!sparqlet) {
      res.sendStatus(404);
    } else {
      res.json({
        data: sparqlet
      });
    }
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
