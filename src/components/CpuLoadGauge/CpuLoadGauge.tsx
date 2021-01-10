import React, { useEffect, useState } from 'react';
import { CpuLoadRecord } from '../../models';
import { defaultSettings } from '../../settings';
import './CpuLoadGauge.scss';

type CpuLoadGaugeProps = {
  currentRecord: CpuLoadRecord;
  refreshRate: number;
  alertThreshold?: number;
};

enum GaugeTheme {
  Normal = 'gauge--normal',
  Warning = 'gauge--warning',
  Danger = 'gauge--danger'
}

const warningThreshold = 0.85; // Enables warning theme on {warningThreshold}% of normal load

export const CpuLoadGauge = ({ currentRecord, refreshRate, alertThreshold = defaultSettings.cpuLoadAverageThreshold }: CpuLoadGaugeProps) => {
  const animationDurationStyle = { animationDuration: `${Math.round(refreshRate / 1000)}s` };
  const gaugeTheme = currentRecord.loadAvg >= alertThreshold ? GaugeTheme.Danger :
    currentRecord.loadAvg >= (alertThreshold * warningThreshold) ? GaugeTheme.Warning :
    GaugeTheme.Normal;
    
  // The following state+effect hooks do unmount/mount the progress bar on 
  //  each iteration in order to reset the CSS animation back to the start:
  const [progressBarEnabled, setProgressBarEnabled] = useState(false);
  useEffect(() => {
    setProgressBarEnabled(false);
    setTimeout(() => setProgressBarEnabled(true));
  }, [currentRecord]);
  
  return (
    <div className="cpu-load-gauge">
      <div className={`gauge ${gaugeTheme}`}>
        { progressBarEnabled && (
          <React.Fragment>
            <div className="gauge__mask gauge__mask--full" style={animationDurationStyle}>
              <div className="gauge__mask-fill" style={animationDurationStyle}></div>
            </div>

            <div className="gauge__mask gauge__mask--half">
              <div className="gauge__mask-fill" style={animationDurationStyle}></div>
            </div>
          </React.Fragment>
        )}
  
        <div className="gauge__content">
          <span className="gauge__content-load">{ currentRecord.loadAvg.toFixed(2) }</span>
          <span className="gauge__content-time">{ currentRecord.timeLabel }</span>
        </div>
      </div>
    </div>
  );
};
