import * as configuration from '../configuration';

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

export const pollingSettings: PollingSettings = {
  refreshRate: configuration.REFRESH_RATE_MS,
  expirationWindow: configuration.TIME_SERIES_EXPIRATION_LIMIT_MS,
  bufferSize: configuration.BUFFER_SIZE,
  pollingEndpoint: configuration.API_ENDPOINT,
}

export const alertSettings: AlertSettings = {
  cpuRecoveryNotificationThreshold: configuration.CPU_LOAD_RECOVERY_THRESHOLD_MS,
  cpuOverloadAlertingThreshold: configuration.CPU_OVERLOAD_ALERT_THRESHOLD_MS,
  cpuLoadAverageThreshold: configuration.LOAD_AVERAGE_THRESHOLD,
}

export type Settings = PollingSettings & AlertSettings;

export const settings: Settings = {
  ...pollingSettings,
  ...alertSettings,
};
