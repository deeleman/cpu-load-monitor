/**
 * @description
 * Represents a CPU load record informing of the CPU load average and the record timestamp
 * both in UTC and readable human format.
 */
export interface CpuLoadRecord {
  loadAvg: number;
  timestamp: number;
  timeLabel: string;
}
