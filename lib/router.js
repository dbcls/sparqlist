const router = require('express-promise-router')();

const Repository = require('./repository');

module.exports = (repositoryPath) => {
  router.get('/-?api/:name.json', async (req, res) => {
    const repository = new Repository(repositoryPath);
    const name = req.params.name;
    const sparqlet = await repository.find(name);
    const traceMode = req.path.match(/^\/-api/);

    if (!sparqlet) {
      res.sendStatus(404);
    } else {
      const data = await sparqlet.execute(req.query, traceMode);
      res.set('Access-Control-Allow-Origin', '*');
      res.json(data);
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

  router.patch('/-api/sparqlets/:name', async (req, res) => {
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

  return router;
};
