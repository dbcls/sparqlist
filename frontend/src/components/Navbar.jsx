import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../auth';

export default function Navbar() {
  const auth = useAuth();

  function handleLogout(event) {
    event.preventDefault();
    auth.logout();
  }

  return (
    <nav
      className={`navbar navbar-expand fixed-top ${
        auth.isAuthenticated ? 'navbar-dark bg-dark' : 'navbar-light bg-light'
      }`}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          SPARQList
        </Link>

        <div className="navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              {auth.isAuthenticated ? (
                <a href="/" onClick={handleLogout} className="nav-link">
                  Logout
                </a>
              ) : (
                <Link to="/-login" className="nav-link">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
