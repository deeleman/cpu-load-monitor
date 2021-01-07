import { cpuLoadRecordSerializer, RawCpuLoadRecord } from '../cpu-load-record-serializer';

describe('cpuLoadRecordSerializer', () => {
  const rawCpuLoadRecord: RawCpuLoadRecord = {
    loadAvg: 2154541015625,
    timestamp: 1609981538687, // equals to 02:05:38 CET
  };

  const serializedCpuLoadRecord = cpuLoadRecordSerializer(rawCpuLoadRecord);

  test('should populate the timeLabel property of a raw cpuLoadRecord object', () => {
    expect(serializedCpuLoadRecord.timeLabel).toMatch(/([0-1][0-9]):([0-5][0-9]):([0-5][0-9])/i);
    expect(serializedCpuLoadRecord.timeLabel.endsWith(':05:38')).toBeTruthy();
  });

  test('should leave all other properties unaltered', () => {
    expect(serializedCpuLoadRecord.loadAvg).toBe(2154541015625);
    expect(serializedCpuLoadRecord.timestamp).toBe(1609981538687);
  });
});
