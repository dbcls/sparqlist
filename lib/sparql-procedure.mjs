import Handlebars from 'handlebars';
import fetch from 'node-fetch';
import is from 'type-is';
import { URLSearchParams } from 'url';

import LogEntry from './log-entry.mjs';

export default class SPARQLProcedure {
  constructor(data) {
    this.data = data;
  }

  async execute(context, logEntries, accept) {
    const endpointTemplate = Handlebars.compile(this.data.endpoint, {noEscape: true});
    const endpoint         = endpointTemplate(context);

    logEntries.push(new LogEntry('SPARQL endpoint', endpoint));

    const template = Handlebars.compile(this.data.data, {noEscape: true});
    const query    = template(context);

    logEntries.push(new LogEntry('SPARQL query', query));

    return await sparql(query, endpoint, accept);
  }
};

async function sparql(query, endpoint, accept) {
  const params = new URLSearchParams();

  params.append('query', query);

  const options = {
    method: 'POST',
    body: params,
    headers: {
      'Accept': accept || 'application/sparql-results+json',
      'content-type': 'application/x-www-form-urlencoded'
    }
  };

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error(`unexpected http response '${res.status} ${res.statusText}' from '${endpoint}'`);
  }

  const contentType = res.headers.get('Content-Type');
  const method      = is.is(contentType, ['json', '+json']) ? 'json' : 'text';

  return {
    results: await res[method](),
    contentType
  };
}
