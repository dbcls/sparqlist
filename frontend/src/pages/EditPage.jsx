import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../auth';
import SparqletEditor from '../components/SparqletEditor';
import {
  getErrorList,
  getErrorMessage,
  getSparqlet,
  updateSparqlet,
} from '../lib/api';

export default function EditPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { sparqletId } = useParams();
  const [sparqlet, setSparqlet] = useState(null);
  const [src, setSrc] = useState('');
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      try {
        const nextSparqlet = await getSparqlet(sparqletId);

        if (!cancelled) {
          setSparqlet(nextSparqlet);
          setSrc(nextSparqlet.src);
          setErrorList([]);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorList([{ detail: getErrorMessage(error) }]);
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

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setErrorList([]);

    try {
      const nextSparqlet = await updateSparqlet(sparqletId, { src }, auth.token);
      navigate(`/${nextSparqlet.id}`);
    } catch (error) {
      setErrorList(getErrorList(error));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="alert alert-secondary mt-3">Loading...</div>;
  }

  if (!sparqlet) {
    return null;
  }

  return (
    <SparqletEditor
      dirty={src !== sparqlet.src}
      errorList={errorList}
      mdPath={sparqlet.mdPath}
      name={sparqlet.name}
      onNameChange={() => {}}
      onSave={handleSave}
      onSrcChange={setSrc}
      saving={isSaving}
      src={src}
    />
  );
}
