const os = require('os');
require('loadavg-windows'); // Serves as a ponyfill for os.loadavg() in Win32 platforms

const cpus = os.cpus();

const fetchCpuLoadavg = () => {
  const [lastMinuteLoadavg] = os.loadavg();

  return {
    loadAvg: lastMinuteLoadavg / cpus.length,
    timestamp: Date.now(),
  };
};

exports.fetch = fetchCpuLoadavg;
