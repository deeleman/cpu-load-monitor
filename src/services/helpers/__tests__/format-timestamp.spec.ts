import { formatTimestamp } from '../format-timestamp';

describe('formatTimestamp', () => {
  const timestampMock = 1609981538687; // equals to 02:05:38 CET
  const formattedTimestamp = formatTimestamp(timestampMock);
  
  test('should convert an UTC timestamp into a human readable string formatted as HH:mm:ss', () => {
    expect(formattedTimestamp).toMatch(/([0-1][0-9]):([0-5][0-9]):([0-5][0-9])/i);
  });
  
  test('should parse an UTC timestamp and convert it into a local time string', () => {
    expect(formattedTimestamp.endsWith(':05:38')).toBeTruthy();
  });
});
