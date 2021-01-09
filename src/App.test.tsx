import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders last CPU load element', () => {
  render(<App />);
  const cpuLoadElement = screen.getByText(/CPU Load Monitor/i);
  expect(cpuLoadElement).toBeInTheDocument();
});
