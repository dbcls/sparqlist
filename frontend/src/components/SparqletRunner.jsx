import React, { useEffect, useState } from 'react';

import { buildRequestUrl, executeTrace } from '../lib/api';
import { formatJson, isHtmlContentType, isJsonContentType } from '../lib/content';
import HtmlContent from './HtmlContent';

function buildInitialFields(params) {
  return params.map((param) => ({
    param,
    value: param.default || '',
  }));
}

function responseBody(response) {
  if (isHtmlContentType(response.contentType)) {
    return <HtmlContent html={response.results} />;
  }

  if (isJsonContentType(response.contentType)) {
    return (
      <pre>
        <code>{formatJson(response.results)}</code>
      </pre>
    );
  }

  return (
    <pre>
      <code>{String(response.results ?? '')}</code>
    </pre>
  );
}

function traceBody(trace) {
  if (trace.error) {
    return (
      <>
        <div className="badge bg-danger">Error</div>
        <pre>
          <code>{trace.error}</code>
        </pre>
      </>
    );
  }

  if (!trace.results) {
    return null;
  }

  return (
    <>
      <div className="badge bg-success">Results</div>
      {isJsonContentType(trace.contentType) ? (
        <pre>
          <code>{formatJson(trace.results)}</code>
        </pre>
      ) : (
        <pre>
          <code>{String(trace.results)}</code>
        </pre>
      )}
    </>
  );
}

export default function SparqletRunner({ sparqlet }) {
  const [queryFields, setQueryFields] = useState(buildInitialFields(sparqlet.params));
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [openTraceIndex, setOpenTraceIndex] = useState(null);

  useEffect(() => {
    setQueryFields(buildInitialFields(sparqlet.params));
    setResponse(null);
    setError('');
    setOpenTraceIndex(null);
  }, [sparqlet.id, sparqlet.params]);

  function updateField(index, value) {
    setQueryFields((current) =>
      current.map((field, currentIndex) =>
        currentIndex === index ? { ...field, value } : field
      )
    );
  }

  const query = queryFields.reduce((accumulator, field) => {
    accumulator[field.param.name] = field.value;
    return accumulator;
  }, {});
  const requestUrl = buildRequestUrl(sparqlet.apiPath, query);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsRunning(true);
    setError('');

    try {
      const nextResponse = await executeTrace(sparqlet.traceModeApiPath, query);
      setResponse(nextResponse);
      setOpenTraceIndex(null);
    } catch (nextError) {
      setResponse(null);
      setError(nextError.message || String(nextError));
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-3">Run</h4>

        <form onSubmit={handleSubmit}>
          {queryFields.map((field, index) => (
            <div className="form-group mt-3" key={field.param.name}>
              <label>
                <code>{field.param.name}</code> {field.param.description}
              </label>
              <input
                value={field.value}
                onChange={(event) => updateField(index, event.target.value)}
                className="form-control"
              />

              {field.param.example ? (
                <small className="form-text text-muted">
                  example: {field.param.example}
                </small>
              ) : null}
            </div>
          ))}

          <div className="mt-3">
            <a href={requestUrl}>{requestUrl}</a>
          </div>

          <div className="d-flex align-items-center mt-3">
            <button type="submit" className="btn btn-primary me-2" disabled={isRunning}>
              Execute
            </button>

            {isRunning ? (
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            ) : null}
          </div>
        </form>

        {response ? (
          <>
            <hr />

            <h4>
              Response{' '}
              <span className={`badge align-top ${response.ok ? 'bg-success' : 'bg-danger'}`}>
                {response.status} {response.statusText}
              </span>
            </h4>

            <div className={`card mt-3 ${response.ok ? '' : 'border-danger'}`}>
              <div className="card-header">
                {response.ok ? 'Output' : 'Error'}
                {response.ok && response.contentType ? (
                  <span className="text-muted">
                    <span className="mx-1">:</span>
                    <small className="font-monospace">{response.contentType}</small>
                  </span>
                ) : null}
              </div>

              <div className="card-body">
                {response.ok ? responseBody(response) : (
                  <pre>
                    <code>{String(response.error || response.results || '')}</code>
                  </pre>
                )}
              </div>
            </div>

            {response.traces?.length ? (
              <>
                <hr />

                <div className="d-flex align-items-center mt-3 mb-1">
                  <h4 className="card-title me-auto">Traces</h4>

                  <small className="text-muted">Total: {response.elapsed} ms</small>
                </div>

                <div className="traces">
                  {response.traces.map((trace, index) => {
                    const isOpen = openTraceIndex === index;

                    return (
                      <div
                        className={`card mt-1 ${trace.error ? 'border-danger' : ''}`}
                        key={`${trace.step.type}-${index}`}
                      >
                        <button
                          type="button"
                          className={`card-header trace-toggle text-start ${
                            isOpen ? '' : 'collapsed'
                          }`}
                          onClick={() => setOpenTraceIndex(isOpen ? null : index)}
                        >
                          <div className="d-flex align-items-center">
                            <div className="trace-chevron">{isOpen ? '▾' : '▸'}</div>

                            <div className="me-auto px-2">
                              {trace.step.name ? trace.step.name : (
                                <span className="fst-italic">(no title)</span>
                              )}

                              <span className="text-muted">
                                <span className="mx-1">:</span>
                                <small className="font-monospace">{trace.step.type}</small>
                              </span>

                              {trace.step.bindingName ? (
                                <>
                                  {' '}
                                  <span className="mx-1">-&gt;</span>
                                  <code>{trace.step.bindingName}</code>
                                </>
                              ) : null}
                            </div>

                            <div>
                              <small className="text-muted">{trace.elapsed} ms</small>
                            </div>
                          </div>
                        </button>

                        {isOpen ? (
                          <div className="card-body">
                            {trace.logEntries.map((logEntry, logIndex) => (
                              <React.Fragment key={`${logEntry.type}-${logIndex}`}>
                                <div className="badge bg-light text-dark">{logEntry.type}</div>
                                <pre>
                                  <code>{logEntry.message}</code>
                                </pre>
                              </React.Fragment>
                            ))}

                            {traceBody(trace)}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {error ? <div className="alert alert-danger mt-3">{error}</div> : null}
      </div>
    </div>
  );
}
