import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services', () => ({
  CpuPollingService: jest.fn().mockImplementation(() => ({
    subscribe: jest.fn().mockImplementation((observer) => { 
      observer({ 
        loadAvg: 0.22233332102006,
        timestamp: Date.now(),
        timeLabel: '12:34:56',
      });

      return () => void 0;
    }),
  })),
  AlertsNotificationService: jest.fn().mockImplementation(() => ({
    pipe: jest.fn(),
    updateSettings: jest.fn(),
    subscribe: jest.fn().mockImplementation((observer) => { 
      observer({
        type: 0, // AlertNotificationType.HeavyLoad,
        createdOn: 1609932400001,
        emittedOn: 1609932410003,
        cpuLoadRecords: [
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932400003 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932405004 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932410005 }
        ],
      });

      return () => void 0;
    }),
  })),
  formatTimestamp: jest.fn(),
}));

describe('App', () => {

  afterEach(cleanup);

  test('renders last CPU load element', () => {
    render(<App />);
    expect(screen.getByText(/CPU Load Monitor/i)).toBeInTheDocument();
  });

  test('should update the UI with the latest cpuLoadRecord emitted by the CpuPollingService observable', () => {
    render(<App />);
    expect(screen.getAllByText('0.22').length).toBe(3);
  });

  test('should intialize with the settings collapsed by default', () => {
    render(<App />);
    expect(document.querySelector('.is-settings-enabled')).toBeNull();
  });

  test('should react to the toggle event dispatched by the Settings child component', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('toggle'));
    expect(document.querySelector('.is-settings-enabled')).not.toBeNull();
  });

});