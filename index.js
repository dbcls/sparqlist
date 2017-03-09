const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const repositoryPath = process.env.REPOSITORY_PATH || './repository';
const adminPassword = process.env.ADMIN_PASSWORD || '';

const router = require('./lib/router')(repositoryPath, adminPassword);

app.set('query parser', 'extended');
app.set('json spaces', 2);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(router);
app.use(express.static(__dirname + '/public'));
app.get('/*', async (req, res) => {
  res.sendFile('index.html', {root: __dirname + '/public'});
});

app.use((err, req, res, next) => {
  if (err.code === 'ENOENT') {
    res.sendStatus(404);
  } else {
    console.log('ERROR', err);

    res.status(422).json({errors: [{status: 500, detail: err.message}]});
  }
});

app.listen(port, () => {
  console.log(`listening on ${port}, repository is at ${repositoryPath}`);
});
