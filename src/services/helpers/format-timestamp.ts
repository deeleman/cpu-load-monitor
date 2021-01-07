/**
 * @description
 * Converts a timestamp number into a HH:mm:ss formatted string according
 * to local system (non UTC) timezone.
 * 
 * @param timestamp number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const minute = date.getMinutes().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hour}:${minute}:${seconds}`;
}
