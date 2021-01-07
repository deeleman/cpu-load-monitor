import React, { useState, useEffect } from 'react';
import { CpuPollingService, AlertNotificationsService } from './services';
import './App.css';
import { AlertNotification, CpuLoadRecord, Stack } from './models';

function App() {
  const cpuLoadRecordsStack = new Stack<CpuLoadRecord>();
  const [cpuLoadRecords, setCpuLoadRecords] = useState<CpuLoadRecord[]>([]);
  const [notification, setNotification] = useState<AlertNotification>();

  useEffect(() => {
    const cpuPollingService = new CpuPollingService();
    const notificationsService = new AlertNotificationsService();

    const notificationsSubscription = notificationsService.subscribe((notification) => {
      setNotification(notification);
    });

    const cpuPollingSubscription = cpuPollingService.subscribe((cpuLoadRecord) => {
      const cpuLoadRecords = cpuLoadRecordsStack.add(cpuLoadRecord);
      setCpuLoadRecords(cpuLoadRecords);
      notificationsService.add(cpuLoadRecord);
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
        <pre>{JSON.stringify(notification)}</pre>
        <table>
          <thead>
            <tr>
              <th>Load Average</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {cpuLoadRecords.map((cpuLoadItem, index) => (
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
