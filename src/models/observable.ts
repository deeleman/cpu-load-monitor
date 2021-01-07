export interface Observable<T> {
  subscribe(next: (observer: T) => void): () => void;
}
