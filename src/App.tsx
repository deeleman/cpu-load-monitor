/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.scss';
import { CpuLoadGauge, HistoryChart, NotificationBar, SettingsEditor } from './components';
import { AlertNotification, CpuLoadRecord, Stack } from './models';
import { AlertsNotificationService, CpuPollingService, formatTimestamp } from './services';
import { Settings, defaultSettings } from './settings';
import logo from './assets/logo.png';

const timestamp = Date.now();
const initialCpuLoadrecord: CpuLoadRecord = {
  loadAvg: 0,
  timestamp,
  timeLabel: formatTimestamp(timestamp),
};

const cpuLoadRecordsStack = new Stack<CpuLoadRecord>();
const cpuPollingService = new CpuPollingService();
const alertsNotificationService = new AlertsNotificationService();

function App() { 
  const [cpuLoadRecords, setCpuLoadRecords] = useState<CpuLoadRecord[]>([initialCpuLoadrecord]);
  const [alertNotification, setAlertNotification] = useState<AlertNotification>();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);

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
    cpuLoadRecordsStack.resize(settings.bufferSize);
    alertsNotificationService.updateSettings(settings);
    cpuPollingService.refreshRate = settings.refreshRate;
  }, [settings]);

  return (
    <div className="App">
      <header>
        <h1>CPU Load Monitor</h1>
        <img src={logo} alt="App Monitoring Logo" width="32" height="32" />
      </header>
      <main className={settingsVisible ? 'is-settings-enabled' : void 0}>
        <CpuLoadGauge
          currentRecord={cpuLoadRecords[0]}
          refreshRate={settings.refreshRate}
          alertThreshold={settings.cpuLoadAverageThreshold}></CpuLoadGauge>
        <HistoryChart
          records={cpuLoadRecords}
          size={settings.bufferSize}
          alertThreshold={settings.cpuLoadAverageThreshold}></HistoryChart>
        <NotificationBar alertNotification={alertNotification}></NotificationBar>
        <SettingsEditor
          settings={settings}
          onChange={setSettings}
          onToggle={() => setSettingsVisible(!settingsVisible)}></SettingsEditor>
      </main>
    </div>
  );
}

export default App;
