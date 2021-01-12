import React from 'react';
import { AlertNotification } from '../../models';
import { defaultSettings } from '../../settings';
import { NotificationAlert } from './NotificationAlert';
import { NotificationPlaceholder } from './NotificationPlaceholder';

type NotificationBarProps = {
  alertNotification?: AlertNotification;
  alertThreshold?: number;
  currentLoadAvg: number;
}

export const NotificationBar = ({ alertNotification, currentLoadAvg, alertThreshold = defaultSettings.cpuLoadAverageThreshold }: NotificationBarProps) => {
  return (alertNotification === void 0) ?
    (<NotificationPlaceholder currentLoadAvg={currentLoadAvg} alertThreshold={alertThreshold}></NotificationPlaceholder>) :
    (<NotificationAlert alertNotification={alertNotification}></NotificationAlert>);
};
