import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
);