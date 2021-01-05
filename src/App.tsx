import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [cpuLoadAvg, setCpuLoadAvg] = useState({ loadAvg: 0, timestamp : Date.now() });

  useEffect(() => {
    fetch('/api/cpu')
      .then((response: Response) => response.json())
      .then((cpuLoadAvg) => {
        setCpuLoadAvg(cpuLoadAvg);
      });
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
