import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders last CPU load element', () => {
  render(<App />);
  const cpuLoadElement = screen.getByText(/Time/i);
  expect(cpuLoadElement).toBeInTheDocument();
});
