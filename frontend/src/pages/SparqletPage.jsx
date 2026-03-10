import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import HtmlContent from '../components/HtmlContent';
import SparqletActions from '../components/SparqletActions';
import SparqletRunner from '../components/SparqletRunner';
import { apiPathToAbsoluteUrl, getErrorMessage, getSparqlet } from '../lib/api';

export default function SparqletPage() {
  const { sparqletId } = useParams();
  const [sparqlet, setSparqlet] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      try {
        const nextSparqlet = await getSparqlet(sparqletId);

        if (!cancelled) {
          setSparqlet(nextSparqlet);
          setErrorMessage('');
          setActiveTab('html');
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
          setSparqlet(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [sparqletId]);

  if (isLoading) {
    return <div className="alert alert-secondary mt-3">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="alert alert-danger mt-3">{errorMessage}</div>;
  }

  if (!sparqlet) {
    return null;
  }

  return (
    <>
      <h1>{sparqlet.title || sparqlet.id}</h1>

      <p>
        <a href={sparqlet.apiPath}>{apiPathToAbsoluteUrl(sparqlet.apiPath)}</a>
      </p>

      <SparqletRunner sparqlet={sparqlet} />

      <div className="card my-3">
        <div className="card-header">
          <div className="d-flex align-items-center">
            <div className="me-auto">
              <strong>API code document</strong>
              <div>
                {sparqlet.mdPath}{' '}
                <span className="text-muted">(version: {sparqlet.mtime})</span>
              </div>
            </div>

            <SparqletActions sparqlet={sparqlet} />
          </div>

          <ul className="nav nav-tabs card-header-tabs mt-2">
            <li className="nav-item">
              <a
                href="#html"
                className={`nav-link ${activeTab === 'html' ? 'active' : ''}`}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveTab('html');
                }}
              >
                HTML
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#markdown"
                className={`nav-link ${activeTab === 'markdown' ? 'active' : ''}`}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveTab('markdown');
                }}
              >
                Markdown
              </a>
            </li>
          </ul>
        </div>

        <div className="card-body tab-content">
          {activeTab === 'html' ? (
            <HtmlContent html={sparqlet.html} />
          ) : (
            <pre>
              <code>{sparqlet.src}</code>
            </pre>
          )}
        </div>
      </div>
    </>
  );
}
