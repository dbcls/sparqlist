const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async function sparql(query, endpoint) {
  const form = new FormData();
  form.append('query', query);

  const options = {
    method: 'POST',
    body: form,
    headers: {
      'Accept': 'application/sparql-results+json',
    }
  };

  const res = await fetch(endpoint, options);
  if (!res.ok) {
    throw new Error(`unexpected http response '${res.status} ${res.statusText}' from '${endpoint}'`);
  }
  return res.json();
};
