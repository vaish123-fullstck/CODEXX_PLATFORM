import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Import Mantine's CSS
import '@mantine/core/styles.css';

// 2. Import the MantineProvider
import { MantineProvider } from '@mantine/core';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 3. Wrap your App component */}
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </React.StrictMode>
);