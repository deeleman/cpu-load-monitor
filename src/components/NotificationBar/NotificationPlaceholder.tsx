import React from 'react';
import defaultIcon from './assets/default-icon.png';
import increasingLoadIcon from './assets/increasing-load-icon.png';
import './NotificationPlaceholder.scss';

type NotificationPlaceholderProps = {
  alertThreshold: number;
  currentLoadAvg: number;
}

export const NotificationPlaceholder = ({ currentLoadAvg, alertThreshold }: NotificationPlaceholderProps) => {
  const icon = currentLoadAvg < alertThreshold ? defaultIcon : increasingLoadIcon;
  const statusText = currentLoadAvg < alertThreshold ?
    'The sun shines on your CPU today' :
    'Uh Oh... CPU load increasing!';

  return (
    <div role="status" className="status">
      <img src={icon} alt="CPU load status" width="64" height="64"></img>
      <p>{statusText}</p>
    </div>
  );
};
