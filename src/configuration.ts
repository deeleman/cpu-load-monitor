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
const REFRESH_RATE_MS = 2000; // 10000;

/**
 * @description
 * `TIME_SERIES_EXPIRATION_LIMIT_MS`: The time window - in milliseconds - of
 * historical CPU load information to be visualized.
 */
const TIME_SERIES_EXPIRATION_LIMIT_MS = 100000; // 600000;

/**
 * @description
 * `BUFFER_SIZE`: The application displays data that belongs in the `TIME_SERIES_EXPIRATION_LIMIT_MS`.
 * The amount of data will be also dictated by the `REFRESH_RATE_MS`, since the application is expected
 * to visually render a {n} amount of CPU load entries, as follows:
 * 
 *   n = TIME_SERIES_EXPIRATION_LIMIT_MS / REFRESH_RATE_MS
 * 
 * Since both TIME_SERIES_EXPIRATION_LIMIT_MS or REFRESH_RATE_MS might eventually be edited by
 * the user, leading to data loss whenever the user shrinks the time window just to broaden it again, 
 * the `Stack` instance objects in use internally store a wider amount of records, depicted by `BUFFER_SIZE`, 
 * although the data rendered disregards this data. However, if the user constrains the time window and
 * expands it again, the Stack objects will still rely on the buffered data to ensure minimum data loss, if any.
 * 
 * This POC does not feature currently a settings update UI feature, so `BUFFER_SIZE` is configured in 'strict mode'.
 * 
 * @example Use the following setup for override 'strict mode' and configure stacks to allocate up to 100 items.
 * 
 * const BUFFER_SIZE = 100;
 * 
 * @see TIME_SERIES_EXPIRATION_LIMIT_MS
 * @see REFRESH_RATE_MS
 */
const BUFFER_SIZE = Math.floor(TIME_SERIES_EXPIRATION_LIMIT_MS / REFRESH_RATE_MS); // Strict mode

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
 * @see [Node.js Express implementation](/server/index.js)
 */
const API_ENDPOINT = '/api/cpu';

/**
 * Do not modify anything below this point
 */
export {
  REFRESH_RATE_MS,
  TIME_SERIES_EXPIRATION_LIMIT_MS,
  BUFFER_SIZE,
  CPU_LOAD_RECOVERY_THRESHOLD_MS,
  CPU_OVERLOAD_ALERT_THRESHOLD_MS,
  LOAD_AVERAGE_THRESHOLD,
  API_ENDPOINT,
};