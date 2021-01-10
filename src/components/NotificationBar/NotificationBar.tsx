import React from 'react';
import { AlertNotification, AlertNotificationType } from '../../models';
import { formatTimestamp } from '../../services';
import { defaultSettings } from '../../settings';
import defaultIcon from './assets/default-icon.png';
import heavyLoadIcon from './assets/heavy-load-icon.png';
import increasingLoadIcon from './assets/increasing-load-icon.png';
import recoveryIcon from './assets/recovery-icon.png';
import './NotificationBar.scss';

type NotificationBarProps = {
  alertNotification?: AlertNotification;
  alertThreshold?: number;
  currentLoadAvg: number;
}

export const NotificationBar = ({ alertNotification, currentLoadAvg, alertThreshold = defaultSettings.cpuLoadAverageThreshold }: NotificationBarProps) => {
  if (alertNotification === void 0) {
    const icon = currentLoadAvg < alertThreshold ? defaultIcon : increasingLoadIcon;
    const statusText = currentLoadAvg < alertThreshold ? 'The sun shines on your CPU today' : 'Uh Oh... CPU load increasing!';

    return (
      <div role="status" className="status">
        <img src={icon} alt="CPU load status" width="64" height="64"></img>
        <p>{statusText}</p>
      </div>
    );
  } else {
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
  }
};
