import { defaultSettings } from '../settings';

/**
 * @description
 * Generic stack store service intended to be used as singleton class persisting
 * a stack of `<T>` objects, where the last added item is the top element in the stack.
 * The Stack object implements an internal buffer depicting the maximum size allocated
 * for its underlying collection, ensuring the size of the stack can be kept in check,
 * regardless the amount of items which will be eventually retrieved for later use or rendering.
 * The Stack object can be - optionally - instanced with an already existing stack collection
 * and override the default buffer size by informing such data in the class constructor or thru its API.
 * 
 * @see [BUFFER_SIZE](../settings/settings.configuration.ts)
 */
export class Stack<T> {
  constructor(private records: T[] = [], private bufferSize: number = defaultSettings.bufferSize) {
    this.records = records.slice(0, this.bufferSize);
  }

  /**
   * Retrieves the Stack underlying collection, capped by the buffering size.
   * @param length If provided, the method will only return the top {n} items informed by the parameter.
   */
  entries(length?: number): Readonly<T[]> {
    return this.records.slice(0, length) as Readonly<T[]>;
  }

  /**
   * Adds a new record to the Stack. If the underlying Stack collection exceeds the Buffer size
   * allocated, the resulting collection will be capped to the length informed by `bufferSize`.
   * @param record The record to stack on top of the Stack object.
   * @returns The resulting Stack value after the latest addition
   */
  add(record: T): T[] {
    this.records = [record, ...this.records];

    if (this.records.length > this.bufferSize) {
      this.records = this.records.slice(0, this.bufferSize);
    }

    return this.records;
  }

  /**
   * Clears and empties the Stack
   */
  clear(): void {
    this.records = [];
  }

  /**
   * Utility method that returns the record item on top of the Stack, corresponding
   * to the last item added, or `undefined` if the Stack is currently empty.
   */
  peek(): T | undefined {
    return this.records[0];
  }

  /**
   * The `resize` method overrides the default buffer size configured upon instantiating the
   * Stack object, which usually defaults to the value computed by the `BUFFER_SIZE` token in 
   * the configuration file.
   * @param bufferSize New length of the Stack buffer size.
   */
  resize(bufferSize: number): void {
    this.bufferSize = bufferSize;
    this.records = this.records.slice(0, this.bufferSize);
  }
}
