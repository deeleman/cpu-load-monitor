/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.scss';
import { CpuLoadGauge, HistoryChart, NotificationBar, SettingsEditor } from './components';
import { AlertNotification, CpuLoadRecord, Stack } from './models';
import { AlertsNotificationService, CpuPollingService, formatTimestamp } from './services';
import { Settings, settings } from './settings';
import logo from './assets/logo.png';

const timestamp = Date.now();
const initialCpuLoadrecord: CpuLoadRecord = {
  loadAvg: 0,
  timestamp,
  timeLabel: formatTimestamp(timestamp),
};

function App() {
  const cpuLoadRecordsStack = new Stack<CpuLoadRecord>();
  const cpuPollingService = new CpuPollingService();
  const alertsNotificationService = new AlertsNotificationService();
 
  const [cpuLoadRecords, setCpuLoadRecords] = useState<CpuLoadRecord[]>([initialCpuLoadrecord]);
  const [alertNotification, setAlertNotification] = useState<AlertNotification>();
  const [settingsState, setSettings] = useState<Settings>(settings);

  useEffect(() => {
    const notificationsSubscription = alertsNotificationService.subscribe((alertNotification) => {
      setAlertNotification(alertNotification);
    });

    const cpuPollingSubscription = cpuPollingService.subscribe((cpuLoadRecord) => {
      const cpuLoadRecords = cpuLoadRecordsStack.add(cpuLoadRecord);
      setCpuLoadRecords(cpuLoadRecords);
      alertsNotificationService.pipe(cpuLoadRecord);
    });

    return () => {
      cpuPollingSubscription();
      notificationsSubscription();
    }
  }, []);

  useEffect(() => {
    cpuLoadRecordsStack.resize(settingsState.bufferSize);
    alertsNotificationService.updateSettings(settingsState);
    cpuPollingService.refreshRate = settingsState.refreshRate;
  }, [settingsState]);

  return (
    <div className="App">
      <header>
        <h1>CPU Load Monitor</h1>
        <img src={logo} alt="App Monitoring Logo" />
      </header>
      <main>
        <CpuLoadGauge
          currentRecord={cpuLoadRecords[0]}
          refreshRate={settingsState.refreshRate}
          alertThreshold={settingsState.cpuLoadAverageThreshold}></CpuLoadGauge>
        <HistoryChart
          records={cpuLoadRecords}
          size={settingsState.bufferSize}
          alertThreshold={settingsState.cpuLoadAverageThreshold}></HistoryChart>
        <NotificationBar alertNotification={alertNotification}></NotificationBar>
        <footer className="Settings">
          <SettingsEditor settings={settingsState} onChange={setSettings}></SettingsEditor>
        </footer>
      </main>
    </div>
  );
}

export default App;
