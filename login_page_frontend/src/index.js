import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Attach basic meta tags for title/description if index.html is minimal
const ensureMeta = () => {
  const desc = document.querySelector('meta[name="description"]');
  if (!desc) {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Ocean Professional themed login page demo.';
    document.head.appendChild(meta);
  }
  const theme = document.querySelector('meta[name="theme-color"]');
  if (!theme) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#2563EB';
    document.head.appendChild(meta);
  }
  if (!document.title) {
    document.title = 'Login • Ocean Professional';
  }
};
ensureMeta();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
