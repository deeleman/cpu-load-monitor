import React from 'react';
import { AlertNotification, AlertNotificationType } from '../../models';
import { formatTimestamp } from '../../services';
import defaultIcon from './assets/default-icon.png';
import heavyLoadIcon from './assets/heavy-load-icon.png';
import recoveryIcon from './assets/recovery-icon.png';
import './NotificationBar.scss';

interface NotificationBarProps {
  alertNotification?: AlertNotification;
}

export const NotificationBar: React.FC<NotificationBarProps> = ({ alertNotification }) => {
  if (alertNotification === void 0) {
    return (
      <div className="notification-bar">
        <img src={defaultIcon} alt="CPU normal load"></img>
        <p>The sun shines on your CPU today</p>
      </div>
    );
  } else {
    const alertClassName = alertNotification.type === AlertNotificationType.HeavyLoad ? 'alert--heavyload' : 'alert--recovery';
    const icon = alertNotification.type === AlertNotificationType.HeavyLoad ? heavyLoadIcon : recoveryIcon;
    const headerText = alertNotification.type === AlertNotificationType.HeavyLoad ? 'CPU under heavy load' : 'Your CPU is recovered';

    return (
      <React.Fragment>
        <div className={`alert ${alertClassName}`}>
          <img className="alert__icon" src={icon} alt="CPU alert"></img>
          <div className="alert__status">
            <h3>{headerText}</h3>
            <span>Last on {formatTimestamp(alertNotification.emittedOn!)}</span>
          </div>
          <div className="alert__details">
            <h4>{alertNotification.cpuLoadRecords.length}</h4>
            <p>
              alerts since
              <strong>{formatTimestamp(alertNotification.createdOn)}</strong>
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
};
