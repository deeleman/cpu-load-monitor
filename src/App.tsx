import React, { useState, useEffect } from 'react';
import { CpuPollingService, NotificationsService } from './services';
import './App.css';
import { CpuLoadRecord, Stack } from './models';

function App() {
  const cpuLoadRecordsStack = new Stack<CpuLoadRecord>();
  const [cpuLoadAvgStack, setCpuLoadRecordsStack] = useState<CpuLoadRecord[]>([{ loadAvg: 0, timestamp : Date.now(), timeLabel: '' }]);

  useEffect(() => {
    const notificationsService = new NotificationsService();
    const notificationsSubscription = notificationsService.subscribe(console.log);

    const cpuPollingService = new CpuPollingService();
    const cpuPollingSubscription = cpuPollingService.subscribe((cpuLoadRecord) => {
      notificationsService.add(cpuLoadRecord);
      const stack = cpuLoadRecordsStack.add(cpuLoadRecord);
      setCpuLoadRecordsStack(stack);
    });

    return () => {
      cpuPollingSubscription();
      notificationsSubscription();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CPU Load Tail</h1>
        <table>
          <thead>
            <tr>
              <th>Load Average</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {cpuLoadAvgStack.map((cpuLoadItem, index) => (
              <tr key={index}>
                <td>{cpuLoadItem.loadAvg.toFixed(2)}</td>
                <td>{cpuLoadItem.timeLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
