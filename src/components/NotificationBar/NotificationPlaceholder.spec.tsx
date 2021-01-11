
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { NotificationPlaceholder } from './NotificationPlaceholder';

describe('NotificationPlaceholder', () => {
  test('should display the default placeholder if no notification has been emitted', () => {
    render(<NotificationPlaceholder currentLoadAvg={0.30} alertThreshold={1} />);
    expect(screen.getByRole('status')).toHaveTextContent('The sun shines on your CPU today');
  });
  
  test('should display a CPU load warning when load avg goes beyond the threshold but no notification has been emitted yet', () => {
    render(<NotificationPlaceholder currentLoadAvg={1.10} alertThreshold={1} />);
    expect(screen.getByRole('status')).toHaveTextContent('Uh Oh... CPU load increasing!');
  });
});
