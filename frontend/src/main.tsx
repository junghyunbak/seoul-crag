import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@mui/material';
import { theme } from '@/styles/theme.ts';

import App from './App.tsx';

import './index.css';
import '@/assets/fonts/index.css';

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://2a903d9270df609c8d6c89ad14185efc@o4508379534458880.ingest.us.sentry.io/4509263291744257',
  sendDefaultPii: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
