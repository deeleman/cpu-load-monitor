
import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { CpuLoadGauge } from './CpuLoadGauge';

describe('CpuLoadGauge', () => {
  const cpuLoadGaugePropsMock = {
    currentRecord: { loadAvg: 0.56435456, timestamp: 1609981538687, timeLabel: '02:05:38' },
    refreshRate: 10000,
    alertThreshold: 1,
  }

  afterEach(cleanup);

  test('should display current CPU Load Average as a float with two decimal digits', () => {
    render(<CpuLoadGauge {...cpuLoadGaugePropsMock} />);
    expect(screen.getByText('0.56')).toBeInTheDocument();
  });

  test('should display timestamp of latest CPU Load Average', () => {
    render(<CpuLoadGauge {...cpuLoadGaugePropsMock} />);
    expect(screen.getByText('02:05:38')).toBeInTheDocument();
  });

  test('should style the gauge bar and text with normal theme under regular CPU load', () => {
    render(<CpuLoadGauge {...cpuLoadGaugePropsMock} />);
    expect(document.querySelector('.gauge')).toHaveClass('gauge--normal');
  });

  test('should style the gauge bar and text with warning theme under high CPU load', () => {
    const currentRecord = { ...cpuLoadGaugePropsMock.currentRecord, loadAvg: 0.85 };
    const updatedPropsMock = { ...cpuLoadGaugePropsMock, currentRecord };
    render(<CpuLoadGauge {...updatedPropsMock} />);
    expect(document.querySelector('.gauge')).toHaveClass('gauge--warning');
  });

  test('should style the gauge bar and text with danger theme under heavy CPU load', () => {
    const currentRecord = { ...cpuLoadGaugePropsMock.currentRecord, loadAvg: 1.35 };
    const updatedPropsMock = { ...cpuLoadGaugePropsMock, currentRecord };
    render(<CpuLoadGauge {...updatedPropsMock} />);
    expect(document.querySelector('.gauge')).toHaveClass('gauge--danger');
  });
});