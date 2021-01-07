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
  /**
   * Alert notification type, signaling whether this object is heavy load alert or a recovery alert.
   */
  type: AlertNotificationType;
  /**
   * UTC timestamp from the moment this CPU load scenario started.
   */
  createdOn: number;
  /**
   * UTC timestamp from the moment this alert notification was emitted.
   */
  emittedOn?: number;
  /**
   * Collection of CPU load records that originated this alert scenario.
   * This signals how many times the CPU has notified this scenario in the scope of this alert.
   */
  cpuLoadRecords: CpuLoadRecord[];
}
