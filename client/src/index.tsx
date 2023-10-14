import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const extensionRoot = document.createElement('div');
extensionRoot.id = 'extension-root';
document.body.appendChild(extensionRoot);


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);