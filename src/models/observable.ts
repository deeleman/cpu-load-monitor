/**
 * @description
 * Informs that the class implements an observable interface via a generic `subscribe()` API method.
 */
export interface Observable<T> {
  subscribe(next: (observer: T) => void): () => void;
}
