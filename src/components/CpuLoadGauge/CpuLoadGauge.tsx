import React from 'react';
import { CpuLoadRecord } from '../../models';
import './CpuLoadGauge.scss';

interface CpuLoadGaugeProps {
  currentRecord: CpuLoadRecord;
  refreshRate: number;
  alertThreshold: number;
}

enum GaugeTheme {
  Normal = 'gauge--normal',
  Warning = 'gauge--warning',
  Danger = 'gauge--danger'
}

const warningThreshold = 0.85; // Enables warning theme on {warningThreshold}% of normal load

export const CpuLoadGauge: React.FC<CpuLoadGaugeProps> = ({ currentRecord, refreshRate, alertThreshold }) => {
  const animationDurationStyle = { animationDuration: `${Math.round(refreshRate / 1000)}s` };
  const gaugeTheme = currentRecord.loadAvg >= alertThreshold ? GaugeTheme.Danger :
    currentRecord.loadAvg >= (alertThreshold * warningThreshold) ? GaugeTheme.Warning :
    GaugeTheme.Normal;

  return (
    <div className="cpu-load-gauge">
      <div className={`gauge ${gaugeTheme}`}>
        <div className="gauge__mask gauge__mask--full" style={animationDurationStyle}>
          <div className="gauge__mask-fill" style={animationDurationStyle}></div>
        </div>

        <div className="gauge__mask gauge__mask--half">
          <div className="gauge__mask-fill" style={animationDurationStyle}></div>
        </div>
  
        <div className="gauge__content">
          <span className="gauge__content-load">{ currentRecord.loadAvg.toFixed(2) }</span>
          <span className="gauge__content-time">{ currentRecord.timeLabel }</span>
        </div>
      </div>
    </div>
  );
};
