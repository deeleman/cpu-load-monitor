import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AlertNotification, AlertNotificationType } from '../../models';
import { NotificationBar } from './NotificationBar';

describe('NotificationBar', () => {
  let alertNotificationMock: AlertNotification;

  const generateAlertNotificationMock = (type = AlertNotificationType.HeavyLoad): AlertNotification => {
    const loadAvg = type === AlertNotificationType.HeavyLoad ? 1.25 : 0.35;
    return {
      type,
      createdOn: 1609932400001,
      emittedOn: 1609932410003,
      cpuLoadRecords: [
        { loadAvg, timeLabel: '14:57:00', timestamp: 1609932400001 },
        { loadAvg, timeLabel: '14:57:10', timestamp: 1609932405002 },
        { loadAvg, timeLabel: '14:57:20', timestamp: 1609932410003 }
      ],
    };
  }

  beforeEach(() => {
    alertNotificationMock = generateAlertNotificationMock();
  });

  test('should display the default notification placeholder if no notification has been emitted', () => {
    render(<NotificationBar currentLoadAvg={0.30} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('should display the alert notification element if a notification has been finally emitted', () => {
    render(<NotificationBar currentLoadAvg={0.30} alertNotification={alertNotificationMock} />);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});