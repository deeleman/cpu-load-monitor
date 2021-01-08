
import React from 'react';
import { AlertNotification, AlertNotificationType } from '../../models';
import './NotificationBar.scss';

interface NotificationBarProps {
  alertNotification?: AlertNotification;
}

export const NotificationBar: React.FC<NotificationBarProps> = ({ alertNotification }) => {

  return (
    <div className="notification">
      <div></div>
    </div>
  );
};
