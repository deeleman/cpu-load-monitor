/**
 * @description
 * Settings configuration for API consumption and CPU load data refresh
 */
export interface PollingSettings {
  /**
   * API request polling rate in milliseconds.
   */
  refreshRate: number;
  /**
   * Maximum time window allocated for historical CPU load information in milliseconds.
   */
  expirationWindow: number;
  /**
   * Maximum amount of items to be handled by objects persisting CPU load data items.
   */
  bufferSize: number;
  /**
   * PAth or URL to REST API endpoint serving CPU load data
   */
  pollingEndpoint: string;
}

/**
 * @description
 * Settings configuration for alert notifications buffer time and warning threshold
 */
export interface AlertSettings {
  /**
   * Minimum time required to consider that a CPU has recovered from heavy load, in milliseconds.
   */
  cpuRecoveryNotificationThreshold: number;
  /**
   * Minimum time required to consider that a CPU is under heavy load, in milliseconds.
   */
  cpuOverloadAlertingThreshold: number;
  /**
   * Average CPU load average rate that tells apart normal from heavy CPU load
   */
  cpuLoadAverageThreshold: number;
}

/**
 * @description
 * Global settings configuration type encompassing polling and alerting settings.
 */
export type Settings = PollingSettings & AlertSettings;
