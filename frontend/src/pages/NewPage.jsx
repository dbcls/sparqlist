import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../auth';
import SparqletEditor from '../components/SparqletEditor';
import {
  createSparqlet,
  getErrorList,
  getSparqlet,
} from '../lib/api';

export default function NewPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [src, setSrc] = useState('');
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const forkFrom = searchParams.get('forkFrom');

  useEffect(() => {
    let cancelled = false;

    if (!forkFrom) {
      setSrc('');
      return undefined;
    }

    setIsLoading(true);

    async function loadOrigin() {
      try {
        const origin = await getSparqlet(forkFrom);

        if (!cancelled) {
          setSrc(origin.src);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorList(getErrorList(error));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadOrigin();

    return () => {
      cancelled = true;
    };
  }, [forkFrom]);

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setErrorList([]);

    try {
      const sparqlet = await createSparqlet({ name, src }, auth.token);
      navigate(`/${sparqlet.id}`);
    } catch (error) {
      setErrorList(getErrorList(error));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="alert alert-secondary mt-3">Loading...</div>;
  }

  return (
    <SparqletEditor
      dirty={Boolean(name || src)}
      errorList={errorList}
      mdPath=""
      name={name}
      onNameChange={setName}
      onSave={handleSave}
      onSrcChange={setSrc}
      saving={isSaving}
      src={src}
    />
  );
}
