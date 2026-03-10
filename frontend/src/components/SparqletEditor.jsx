import React from 'react';

import CodeEditor from './CodeEditor';

export default function SparqletEditor({
  dirty,
  errorList,
  mdPath,
  name,
  onNameChange,
  onSave,
  onSrcChange,
  saving,
  src,
}) {
  const buttonClass = dirty ? 'btn-primary' : 'btn-outline-primary';

  return (
    <>
      {errorList.map((error, index) => (
        <div className="alert alert-danger" key={`${error.detail}-${index}`}>
          <strong>Error</strong> {error.detail}
        </div>
      ))}

      <div className="card mt-1">
        <form onSubmit={onSave}>
          <div className="card-header d-flex align-items-center">
            <div className="me-auto">
              <strong>API code document</strong>

              {mdPath ? (
                <div>{mdPath}</div>
              ) : (
                <div className="row row-cols-lg-auto g-0 align-items-center">
                  <div className="col-auto">
                    <input
                      value={name}
                      onChange={(event) => onNameChange(event.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-auto">
                    <span>.md</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className={`btn ${buttonClass} float-right`}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>

          <div className="card-body">
            <CodeEditor value={src} onChange={onSrcChange} />
          </div>

          <div className="card-footer text-end">
            <div>
              <button
                type="submit"
                className={`btn ${buttonClass} float-right`}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
