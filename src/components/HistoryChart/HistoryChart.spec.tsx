
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HistoryChart } from './HistoryChart';

describe('HistoryChart', () => {
  const recordsMock = [
    { loadAvg: 0.56435456, timestamp: 1609981510000, timeLabel: '02:05:00' },
    { loadAvg: 0.50665429, timestamp: 1609981515000, timeLabel: '02:05:10' },
    { loadAvg: 0.42668646, timestamp: 1609981520000, timeLabel: '02:05:20' },
  ];

  test('should display the records passed in the input property as chart bars', () => {
    render(<HistoryChart records={recordsMock} size={20} alertThreshold={1} />);
    expect(document.querySelectorAll('.chart__item--populated').length).toBe(3);
  });

  test('should fill out the chart with non populated bars till matching the size property', () => {
    render(<HistoryChart records={recordsMock} size={20} alertThreshold={1} />);
    expect(document.querySelectorAll('.chart__item').length).toBe(20);
  });

  test('should display the time of each record bar', () => {
    render(<HistoryChart records={recordsMock} size={20} alertThreshold={1} />);
    expect(screen.getByText('02:05:00')).toBeInTheDocument();
    expect(screen.getByText('02:05:10')).toBeInTheDocument();
    expect(screen.getByText('02:05:20')).toBeInTheDocument();
  });
});