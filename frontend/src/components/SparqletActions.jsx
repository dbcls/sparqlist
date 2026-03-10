import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../auth';
import { deleteSparqlet, getErrorMessage } from '../lib/api';

export default function SparqletActions({ sparqlet }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteSparqlet(sparqlet.id, auth.token);
      navigate('/');
    } catch (error) {
      window.alert(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Link
        to={`/-new?forkFrom=${encodeURIComponent(sparqlet.id)}`}
        className="btn btn-outline-primary"
      >
        Fork
      </Link>{' '}
      <Link to={`/${sparqlet.id}/edit`} className="btn btn-outline-primary">
        Edit
      </Link>{' '}
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        Delete
      </button>
    </div>
  );
}
