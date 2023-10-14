import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = document.createElement('div');
root.className = 'container';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
