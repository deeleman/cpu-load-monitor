import React, { useState, useEffect } from 'react';
import { CpuPollingService } from './services';
import './App.css';

function App() {
  const [cpuLoadAvg, setCpuLoadRecord] = useState({ loadAvg: 0, timestamp : Date.now() });

  useEffect(() => {
    const service = new CpuPollingService(5000);
    service.subscribe((cpuLoadRecord) => setCpuLoadRecord(cpuLoadRecord));
    service.subscribe(console.log);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <code>{cpuLoadAvg.loadAvg} || {cpuLoadAvg.timestamp}</code>
        </p>
      </header>
    </div>
  );
}

export default App;
