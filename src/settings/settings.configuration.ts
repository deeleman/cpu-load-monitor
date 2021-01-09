import { Settings } from './settings.types';

/**
 * MAIN APLICATION SETTINGS
 * --
 * Feel free to update these values to customize the overall 
 * application experience. You will want to reboot the application
 * in order to have the changes applied. This application should eventually
 * implement a visual settings update feature in its UI.
 */

/**
 * @description
 * `REFRESH_RATE_MS`: The time interval - in millliseconds - at which
 * rate the UI polls the backend API for the latest CPU load data.
 */
const REFRESH_RATE_MS = 10000;

/**
 * @description
 * `TIME_SERIES_EXPIRATION_LIMIT_MS`: The time window - in milliseconds - of
 * historical CPU load information to be visualized.
 */
const TIME_SERIES_EXPIRATION_LIMIT_MS = 600000;

/**
 * @description
 * `CPU_LOAD_RECOVERY_THRESHOLD_MS`: Minimum time period - in milliseconds - to enforce
 * in order to consider that the CPU is recovered from high average load.
 */
const CPU_LOAD_RECOVERY_THRESHOLD_MS = 120000;

/**
 * @description
 * CPU_OVERLOAD_ALERT_THRESHOLD_MS: Time period - in milliseconds - required
 * to be exceeded in order to consider that the CPU is under high average load.
 */
const CPU_OVERLOAD_ALERT_THRESHOLD_MS = 120000;

/**
 * @description
 * `LOAD_AVERAGE_THRESHOLD`: Defines which value will tell whenever CPU load average is TOO HIGH
 * (`>= LOAD_AVERAGE_THRESHOLD`) or CPU load is FAIR (`< LOAD_AVERAGE_THRESHOLD`).
 */
const LOAD_AVERAGE_THRESHOLD = 1;

/**
 * @description
 * `API_ENDPOINT`: The UI frontend application relies on a Node.js backend server to consume
 * CPU load information from the application host device. The HTTP client in use by the
 * frontend will fetch the required data from the API endpoint configured below.
 * Please keep this data in sync with the Node.js implementation.
 * 
 * Changes will require rebooting the application to take effect.
 * 
 * @see [Node.js Express implementation](/server/index.js)
 */
const API_ENDPOINT = '/api/cpu';

/**
 * @description
 * `BUFFER_SIZE`: The application displays data that falls within the `TIME_SERIES_EXPIRATION_LIMIT_MS` period.
 * However, the amount of data to be displayed is also dictated by the `REFRESH_RATE_MS`, since the application is expected
 * to visually render a {n} amount of CPU load entries, as follows:
 * 
 *   n = TIME_SERIES_EXPIRATION_LIMIT_MS / REFRESH_RATE_MS
 * 
 * Since both TIME_SERIES_EXPIRATION_LIMIT_MS or REFRESH_RATE_MS might eventually be edited by
 * the user, objects handling records subject to be capped by time expiration will want to leverage
 * the computed value above. We introduce the concept of `BUFFER_SIZE` as a computed property so
 * we spare the necessity for its consumers to compute it themselves.
 * 
 * This POC has `BUFFER_SIZE` configured in 'strict mode' and should not be updated by hand.
 * However, the concept of BUFFER is a pretty powerful one and can be extended in the future to 
 * prevent data loss scenarios when shrinking and broadening up the data persistence window.
 * 
 * @see TIME_SERIES_EXPIRATION_LIMIT_MS
 * @see REFRESH_RATE_MS
 */
const BUFFER_SIZE = Math.floor(TIME_SERIES_EXPIRATION_LIMIT_MS / REFRESH_RATE_MS);

/**
 * Default settings upon bootstrap - Do not mutate this object directly.
 */
export const defaultSettings: Settings = {
  // PollingSettings
  refreshRate: REFRESH_RATE_MS,
  expirationWindow: TIME_SERIES_EXPIRATION_LIMIT_MS,
  pollingEndpoint: API_ENDPOINT,
  
  // AlertSettings
  cpuRecoveryNotificationThreshold: CPU_LOAD_RECOVERY_THRESHOLD_MS,
  cpuOverloadAlertingThreshold: CPU_OVERLOAD_ALERT_THRESHOLD_MS,
  cpuLoadAverageThreshold: LOAD_AVERAGE_THRESHOLD,
  bufferSize: BUFFER_SIZE,
};