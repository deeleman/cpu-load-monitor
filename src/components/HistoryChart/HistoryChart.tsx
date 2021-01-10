import React from 'react';
import { CpuLoadRecord } from '../../models';
import './HistoryChart.scss';

type HistoryChartProps = {
  records: CpuLoadRecord[];
  size: number;
  alertThreshold: number;
}

const chartHeight = 240; // Keep in sync with component CSS
const chartThreshold = chartHeight / 1.75; // Waypoint where records represent heavy load

export const HistoryChart = ({ records, size, alertThreshold }: HistoryChartProps) => {
  const ghostRecordsRequired = size - records.length;
  const ghostChartItems = [];
  for (let i = 0; i < ghostRecordsRequired; i++) {
    ghostChartItems.push(<li key={i} className="chart__item"><span></span></li>);
  }

  return (
    <div className="chart">
      <ul className="chart__items">
        {records.map((cpuLoadRecord) => (
          <li key={cpuLoadRecord.timestamp}
            className="chart__item chart__item--populated"
            style={{ height: `${Math.ceil(chartThreshold * (cpuLoadRecord.loadAvg / alertThreshold))}px` }}>
            <div className="chart__item-time">
              <span>
                <strong>{cpuLoadRecord.loadAvg.toFixed(2)}</strong> 
                {cpuLoadRecord.timeLabel}
              </span>
              <i></i>
            </div>
          </li>
        ))}
        {ghostChartItems}
      </ul>
    </div>
  );
};
