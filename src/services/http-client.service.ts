/**
 * Http Status mapping enum
 * @internal
 */
enum HttpStatus {
  Success     = 200,
  Redirect    = 300,
  ClientError = 400,
  ServerError = 500
}

/**
 * @description
 * General purpose network client for submitting GET request to a given endpoint URL with
 * extended support for typed responses.
 * @param endpointUrl URL of remote resource
 * @param serializer OPTIONAL: generic transform function that will serialize data before returning it
 * @returns Typed promise with response output, featuring error handling functionality
 */
export const httpClientService = async <T>(endpointUrl: string, serializer?: (input: any) => T): Promise<T> => {
  return fetch(endpointUrl)
    .then((response: Response) => {
      if (response.ok && response.status >= HttpStatus.Success && response.status < HttpStatus.Redirect) {
        return response.json();
      } else {
        const errorMessage = !response.ok ? 'Invalid Response' : `Http Error ${response.status}`;
        throw new Error(errorMessage);
      }
    })
    .then((data) => (serializer !== void 0 ? serializer(data) : data as T))
    .catch((error: Error) => Promise.reject(error));
};