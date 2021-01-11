import React from 'react';
import { AlertNotification, AlertNotificationType } from '../../models';
import { formatTimestamp } from '../../services';
import heavyLoadIcon from './assets/heavy-load-icon.png';
import recoveryIcon from './assets/recovery-icon.png';
import './NotificationAlert.scss';

type NotificationAlertProps = {
  alertNotification: AlertNotification;
}

export const NotificationAlert = ({ alertNotification }: NotificationAlertProps) => {
  const alertClassName = alertNotification.type === AlertNotificationType.HeavyLoad ? 'alert--heavyload' : 'alert--recovery';
  const icon = alertNotification.type === AlertNotificationType.HeavyLoad ? heavyLoadIcon : recoveryIcon;
  const headerText = alertNotification.type === AlertNotificationType.HeavyLoad ? 'CPU under heavy load' : 'Your CPU is recovered';

  return (
    <div role="alert" className={`alert ${alertClassName}`}>
      <img className="alert__icon" src={icon} alt={headerText} width="32" height="32"></img>
      <div className="alert__status">
        <h3>{headerText}</h3>
        <span>Last on {formatTimestamp(alertNotification.emittedOn!)}</span>
      </div>
      <div className="alert__details">
        <h4>{alertNotification.cpuLoadRecords.length} </h4>
        <p>
          alerts since 
          <strong> {formatTimestamp(alertNotification.createdOn)}</strong>
        </p>
      </div>
    </div>
  );
};
