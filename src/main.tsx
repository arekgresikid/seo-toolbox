import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <App />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  </React.StrictMode>
);
