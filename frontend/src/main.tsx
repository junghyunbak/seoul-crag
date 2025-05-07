import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@mui/material';
import { theme } from '@/styles/theme.ts';

import App from './App.tsx';

import './index.css';
import '@/assets/fonts/index.css';

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://673026ed1c9b3da95c831f91524722e1@o4509263823241216.ingest.de.sentry.io/4509263825666128',
  sendDefaultPii: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
