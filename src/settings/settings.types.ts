export interface PollingSettings {
  refreshRate: number;
  expirationWindow: number;
  bufferSize: number;
  pollingEndpoint: string;
}

export interface AlertSettings {
  cpuRecoveryNotificationThreshold: number;
  cpuOverloadAlertingThreshold: number;
  cpuLoadAverageThreshold: number;
}

export type Settings = PollingSettings & AlertSettings;
