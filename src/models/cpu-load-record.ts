/**
 * @description
 * Represents a CPU load record informing of the CPU load average and the record timestamp
 * both in UTC and readable human format.
 */
export interface CpuLoadRecord {
  /**
   * CPU load average during the last minute
   */
  loadAvg: number;
  /**
   * UTC timestamp of the record creation
   */
  timestamp: number;
  /**
   * UTC timestamp in human readable format (HH:mm:ss)
   */
  timeLabel: string;
}
