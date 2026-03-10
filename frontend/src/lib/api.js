function basePath(path) {
  const base = import.meta.env.BASE_URL;

  return `${base}${path.replace(/^\//, '')}`;
}

function absoluteUrl(path) {
  return new URL(path, window.location.origin).toString();
}

function normalizeSparqlet(resource) {
  const attributes = resource.attributes || {};

  return {
    id: resource.id,
    name: attributes.name || '',
    title: attributes.title || '',
    html: attributes.html || '',
    apiPath: attributes['api-path'] || '',
    traceModeApiPath: attributes['trace-mode-api-path'] || '',
    params: attributes.params || [],
    src: attributes.src || '',
    mdPath: attributes['md-path'] || '',
    mtime: attributes.mtime || '',
  };
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path, options = {}) {
  const response = await fetch(basePath(path), options);
  const payload = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(response.statusText || 'Request failed');

    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function jsonApiBody(attributes) {
  return JSON.stringify({
    data: {
      type: 'sparqlet',
      attributes,
    },
  });
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listSparqlets() {
  const payload = await request('/-api/sparqlets');

  return payload.data.map(normalizeSparqlet);
}

export async function getSparqlet(id) {
  const payload = await request(`/-api/sparqlets/${id}`);

  return normalizeSparqlet(payload.data);
}

export async function login(password) {
  const payload = await request('/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      password,
    }),
  });

  return payload.access_token;
}

export async function createSparqlet({ name, src }, token) {
  const payload = await request('/-api/sparqlets', {
    method: 'POST',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/vnd.api+json',
    },
    body: jsonApiBody({ name, src }),
  });

  return normalizeSparqlet(payload.data);
}

export async function updateSparqlet(id, { src }, token) {
  const payload = await request(`/-api/sparqlets/${id}`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/vnd.api+json',
    },
    body: jsonApiBody({ src }),
  });

  return normalizeSparqlet(payload.data);
}

export async function deleteSparqlet(id, token) {
  await request(`/-api/sparqlets/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export async function executeTrace(path, query) {
  const url = new URL(path, window.location.origin);

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.append(key, value);
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'text/html, application/json, */*; q=0.01',
    },
  });
  const payload = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    contentType: payload.contentType,
    results: response.ok ? payload.results : payload,
    traces: payload.traces,
    error: payload.error,
    elapsed: payload.elapsed,
  };
}

export function buildRequestUrl(path, query) {
  const url = new URL(path, window.location.origin);

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.append(key, value);
  }

  return url.toString();
}

export function apiPathToAbsoluteUrl(path) {
  return absoluteUrl(path);
}

export function getErrorMessage(error) {
  if (!error) {
    return 'Unknown error';
  }

  if (typeof error.payload === 'string') {
    return error.payload;
  }

  if (error.payload?.error) {
    return error.payload.error;
  }

  if (error.payload?.errors?.[0]?.detail) {
    return error.payload.errors[0].detail;
  }

  return error.message || 'Unknown error';
}

export function getErrorList(error) {
  if (Array.isArray(error?.payload?.errors)) {
    return error.payload.errors;
  }

  if (error?.message) {
    return [{ detail: error.message }];
  }

  return [];
}
