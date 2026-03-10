import React from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './auth';
import Navbar from './components/Navbar';
import EditPage from './pages/EditPage';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import NewPage from './pages/NewPage';
import SparqletPage from './pages/SparqletPage';

function Layout() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/-login" element={<LoginPage />} />
          <Route
            path="/-new"
            element={
              <RequireAuth>
                <NewPage />
              </RequireAuth>
            }
          />
          <Route path="/:sparqletId" element={<SparqletPage />} />
          <Route
            path="/:sparqletId/edit"
            element={
              <RequireAuth>
                <EditPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    const next = `${location.pathname}${location.search}${location.hash}`;
    const params = new URLSearchParams({ next });

    return <Navigate to={`/-login?${params.toString()}`} replace />;
  }

  return children;
}

function NotFoundPage() {
  return (
    <div className="alert alert-danger mt-3">
      <strong>404 Not Found</strong>
      <div>
        <Link to="/">Back to top</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
