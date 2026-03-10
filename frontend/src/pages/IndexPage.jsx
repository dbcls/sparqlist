import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getErrorMessage, listSparqlets } from '../lib/api';

export default function IndexPage() {
  const [sparqlets, setSparqlets] = useState([]);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = await listSparqlets();

        if (!cancelled) {
          setSparqlets(items);
          setErrorMessage('');
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
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
  }, []);

  const filtered = sparqlets
    .filter((sparqlet) =>
      search
        ? sparqlet.id.includes(search) || sparqlet.src.includes(search)
        : true
    )
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id));

  if (isLoading) {
    return <div className="alert alert-secondary mt-3">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="alert alert-danger mt-3">{errorMessage}</div>;
  }

  return (
    <div className="card">
      <div className="card-header d-flex">
        <Link to="/-new" className="btn btn-primary me-auto">
          New SPARQLet
        </Link>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search"
          className="form-control"
        />
      </div>

      <div className="list-group list-group-flush">
        {filtered.map((sparqlet) => (
          <Link
            to={`/${sparqlet.id}`}
            className="list-group-item list-group-item-action"
            key={sparqlet.id}
          >
            {sparqlet.title ? (
              <>
                {sparqlet.id} <span className="text-muted">- {sparqlet.title}</span>
              </>
            ) : (
              sparqlet.id
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
