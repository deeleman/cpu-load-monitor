const os = require('os');
const cpuLoadavg = require('../cpu-loadavg');

jest.mock('os', () => ({
  loadavg: jest.fn().mockImplementation(() => [0.72, 1, 1]),
  cpus: jest.fn().mockImplementation(() => [{}, {}]),
  platform: jest.fn().mockImplementation(() => 'Darwin'),
}));

describe('fetchCpuLoadavg', () => {
  describe('fetch()', () => {
    it('should return latest loadAvg info', () => {
      const osLoadavgSpy = jest.spyOn(os, 'loadavg');
      const cpuLoadavgInfo = cpuLoadavg.fetch();

      expect(cpuLoadavgInfo.loadAvg).not.toBeUndefined();
      expect(typeof cpuLoadavgInfo.loadAvg).toBe('number');
      expect(osLoadavgSpy).toHaveBeenCalled();
    });

    it('should append its corresponding timestamp record to the returned loadAvg info', () => {
      const realDateNow = Date.now.bind(global.Date);
      const dateNowStub = jest.fn(() => 1609852671832);
      global.Date.now = dateNowStub;

      const cpuLoadavgInfo = cpuLoadavg.fetch();

      expect(cpuLoadavgInfo.timestamp).toBe(1609852671832);
      expect(dateNowStub).toHaveBeenCalled();

      global.Date.now = realDateNow;
    });
    
    it('should normalize the returned loadAvg info depending on the amount of CPU cores', () => {
      const osCpusSpy = jest.spyOn(os, 'cpus');
      const cpuLoadavgInfo = cpuLoadavg.fetch();

      expect(cpuLoadavgInfo.loadAvg).toBe(0.36);
      expect(osCpusSpy).toHaveBeenCalled();
    });
  });
});