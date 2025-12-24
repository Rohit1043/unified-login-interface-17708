import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

/**
 * Util: Compose a target URL display from environment variables (safe if empty).
 * The values are used only to show a potential target URL. No network requests are made.
 */
// PUBLIC_INTERFACE
export function getDisplayTargetUrl() {
  /** Compose a potential base URL from env vars; handle empty values gracefully. */
  const api = process.env.REACT_APP_API_BASE || '';
  const backend = process.env.REACT_APP_BACKEND_URL || '';
  const frontend = process.env.REACT_APP_FRONTEND_URL || '';
  const ws = process.env.REACT_APP_WS_URL || '';

  // Prefer API base; fallback to backend; otherwise frontend; else empty
  const base = api || backend || frontend || '';
  const url = base || (ws ? ws.replace(/^ws/, 'http') : '');
  return url;
}

/**
 * Simple email validation
 */
function isValidEmail(value) {
  // basic RFC5322-ish simple check
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).toLowerCase());
}

/**
 * Copy helper
 */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * LoginForm component: Handles form state, validation, and mock submit.
 */
// PUBLIC_INTERFACE
function LoginForm() {
  /** Login form with accessibility, validation, and mock async submit. */
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const idInputRef = useRef(null);

  useEffect(() => {
    // focus first input on mount
    idInputRef.current?.focus();
  }, []);

  const handleValidation = () => {
    const nextErrors = {};
    if (!identifier.trim()) {
      nextErrors.identifier = 'Please enter your email or username.';
    } else if (identifier.includes('@') && !isValidEmail(identifier.trim())) {
      nextErrors.identifier = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!handleValidation()) return;

    setSubmitting(true);
    // simulate async login
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success =
      (identifier.trim().toLowerCase() === 'demo@example.com' || identifier.trim().toLowerCase() === 'demo') &&
      password === 'Demo@123';

    if (success) {
      setMessage({ type: 'success', text: 'Login successful! Welcome back.' });
    } else {
      setMessage({
        type: 'error',
        text: 'Invalid credentials. Try demo@example.com with password Demo@123.',
      });
    }

    setSubmitting(false);
  };

  const targetUrl = useMemo(() => getDisplayTargetUrl(), []);

  const onCopy = async (text) => {
    const ok = await copyText(text);
    setMessage({
      type: ok ? 'success' : 'error',
      text: ok ? 'Copied to clipboard.' : 'Copy failed. Please copy manually.',
    });
  };

  return (
    <div className="login-wrapper" role="main">
      <div className="login-card" aria-live="polite">
        <div className="login-header">
          <div className="brand-circle" aria-hidden="true">🌊</div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to continue to your dashboard</p>
          {targetUrl ? (
            <p className="target-url" title={targetUrl}>
              Target: <span className="mono">{targetUrl}</span>
            </p>
          ) : null}
        </div>

        {message && (
          <div
            className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}
            role="status"
          >
            {message.text}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form-control">
            <label htmlFor="identifier" className="label">
              Email or Username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              ref={idInputRef}
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={errors.identifier ? 'identifier-error' : undefined}
              className={`input ${errors.identifier ? 'input-error' : ''}`}
              placeholder="e.g., demo@example.com"
            />
            {errors.identifier && (
              <p id="identifier-error" className="input-help error-text">
                {errors.identifier}
              </p>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p id="password-error" className="input-help error-text">
                {errors.password}
              </p>
            )}
          </div>

          <div className="form-row">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a className="link" href="#forgot" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="helper-panel" aria-labelledby="helper-title">
          <p id="helper-title" className="helper-title">
            Sample credentials
          </p>
          <div className="helper-row">
            <span className="mono">username:</span>
            <span className="mono value">demo@example.com</span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onCopy('demo@example.com')}
              aria-label="Copy username to clipboard"
            >
              Copy
            </button>
          </div>
          <div className="helper-row">
            <span className="mono">password:</span>
            <span className="mono value">Demo@123</span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onCopy('Demo@123')}
              aria-label="Copy password to clipboard"
            >
              Copy
            </button>
          </div>
        </div>

        <footer className="footer-note" aria-label="Demo notice">
          This is a demo UI. No real authentication is performed.
        </footer>
      </div>
    </div>
  );
}

/**
 * Root App component
 */
// PUBLIC_INTERFACE
function App() {
  /** App root that renders the login form centered on a gradient background. */
  useEffect(() => {
    document.title = 'Login • Ocean Professional';
  }, []);

  return (
    <div className="ocean-app">
      <LoginForm />
    </div>
  );
}

export default App;
