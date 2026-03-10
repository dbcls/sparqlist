import React from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../auth';
import LoginForm from '../components/LoginForm';
import { getErrorMessage } from '../lib/api';

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/';

  if (auth.isAuthenticated) {
    return <Navigate to={next} replace />;
  }

  async function handleLogin(password) {
    try {
      await auth.login(password);
      navigate(next, { replace: true });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  return <LoginForm onSubmit={handleLogin} />;
}
