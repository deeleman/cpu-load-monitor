import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cpuLoadAvg, setCpuLoadAvg] = useState({ loadAvg: 0, timestamp : Date.now() });

  const updateData = () => {
    fetch('/api/cpu')
      .then((response: Response) => response.json())
      .then((cpuLoadAvg) => {
        setCpuLoadAvg(cpuLoadAvg);
        setTimeout(() => updateData(), 5000);
      });
  };

  useEffect(() => {
    updateData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
