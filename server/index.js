const express = require('express');
const path = require('path');
const app = express();
const settings = require('./settings');
const cpuLoadavg = require('./cpu-loadavg');
const env = process.env.NODE_ENV || 'development';

app.use(express.static(path.join(__dirname, settings.BUILD_PATH)));

app.get('/api/cpu', (_, response) => {
  return response.json(cpuLoadavg.fetch());
});

app.get('/', (_, response) => {
  response.sendFile(path.join(__dirname, settings.BUILD_PATH, settings.BUILD_INDEX));
});

app.listen(settings.PORT, () => {
  if (env === 'development' || env === 'dev') {
    console.log(`⚡️ CPU Load Monitor: Server is running at http://localhost:${settings.PORT}`);
  }
});
