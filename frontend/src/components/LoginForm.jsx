import React, { useState } from 'react';

export default function LoginForm({ onSubmit }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onSubmit(password);
    } catch (error) {
      setErrorMessage(error.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="row row-cols-xs-auto g-3">
        <div className="col-12 mb-2 me-sm-2 mb-sm-0">
          <label htmlFor="password" className="visually-hidden">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter Password"
            className="form-control"
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Login
          </button>
        </div>
      </form>

      {errorMessage ? (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      ) : null}
    </>
  );
}
