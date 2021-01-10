
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
    expect(screen.getByRole('status')).toHaveTextContent('The sun shines on your CPU today');
  });
  
  test('should display a CPU load warning when load avg goes beyond the threshold but no notification has been emitted yet', () => {
    render(<NotificationBar currentLoadAvg={1.10} />);
    expect(screen.getByRole('status')).toHaveTextContent('Uh Oh... CPU load increasing!');
  });

  test('should display the alert notification element if a notification has been finally emitted', () => {
    render(<NotificationBar currentLoadAvg={0.30} alertNotification={alertNotificationMock} />);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('should style the notification accordingly with a heavy load notification', () => {
    render(<NotificationBar currentLoadAvg={1.25} alertNotification={alertNotificationMock} />);
    expect(screen.getByRole('alert')).toHaveTextContent('CPU under heavy load');
    expect(screen.getByAltText('CPU under heavy load')).toBeInTheDocument();
    expect(document.querySelector('.alert.alert--heavyload')).toBeInTheDocument();
  });

  test('should style the notification accordingly with a recovery notification', () => {
    alertNotificationMock = generateAlertNotificationMock(AlertNotificationType.Recovery);
    render(<NotificationBar currentLoadAvg={0.33} alertNotification={alertNotificationMock} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Your CPU is recovered');
    expect(screen.getByAltText('Your CPU is recovered')).toBeInTheDocument();
    expect(document.querySelector('.alert.alert--recovery')).toBeInTheDocument();
  });

  test('should display the timestamp when the last alert was emitted formatted as HH:mm:sss', () => {
    render(<NotificationBar currentLoadAvg={1.25} alertNotification={alertNotificationMock} />);
    expect(screen.getByRole('alert')).toHaveTextContent(/Last on ([0-1][0-9]):26:50/i);
  });
  
  test('should display how many times this alert has occured in the scope of the current alert state', () => {
    render(<NotificationBar currentLoadAvg={1.25} alertNotification={alertNotificationMock} />);
    expect(screen.getByRole('alert')).toHaveTextContent(/3 alerts since ([0-1][0-9]):26:40/i);
  });
});