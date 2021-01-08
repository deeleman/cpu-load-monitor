/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.scss';
import { CpuLoadGauge } from './components';
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
  const alertsService = new AlertsNotificationService();
 
  const [cpuLoadRecords, setCpuLoadRecords] = useState<CpuLoadRecord[]>([initialCpuLoadrecord]);
  const [alertState, setAlertState] = useState<AlertNotification>();
  const [settingsState, setSettings] = useState<Settings>(settings);

  useEffect(() => {
    const notificationsSubscription = alertsService.subscribe((alertNotification) => {
      setAlertState(alertNotification);
    });

    const cpuPollingSubscription = cpuPollingService.subscribe((cpuLoadRecord) => {
      const cpuLoadRecords = cpuLoadRecordsStack.add(cpuLoadRecord);
      setCpuLoadRecords(cpuLoadRecords);
      alertsService.pipe(cpuLoadRecord);
    });

    return () => {
      cpuPollingSubscription();
      notificationsSubscription();
    }
  }, []);

  useEffect(() => {
    cpuLoadRecordsStack.resize(settingsState.bufferSize);
    alertsService.updateSettings(settingsState);
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
        {/*
        <HistoryChart records={cpuLoadRecords} size={settingsState.bufferSize}></HistoryChart>
        <NotificationBar currentAlert={alertState}></NotificationBar>
        <footer className="Settings">
          <Settings settings={settingsState}></Settings>
        </footer>
        */}
      </main>
    </div>
  );
}

export default App;
