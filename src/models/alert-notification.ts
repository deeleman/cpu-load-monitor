import { CpuLoadRecord } from './cpu-load-record';

/**
 * @description
 * Alert notification type, depicting either a heavy CPU load scenario or a recovery one.
 */
export enum AlertNotificationType {
  /**
   * CPU heavy load alert
   */
  HeavyLoad,
  /**
   * CPU recovery alert after a previous heavy load
   */
  Recovery,
}

/**
 * @description
 * An CPU load alert notification depicting a given alert type, when was it started, when was emitted and how many times it has occured.
 */
export interface AlertNotification {
  type: AlertNotificationType;
  createdOn: number;
  emittedOn?: number;
  cpuLoadRecords: CpuLoadRecord[];
}
