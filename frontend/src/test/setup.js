import React from 'react';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock('react-loading-indicators', () => ({
  OrbitProgress: () =>
    React.createElement('div', {
      'aria-label': 'Carregando',
      'data-testid': 'loading-indicator',
    }),
}));
