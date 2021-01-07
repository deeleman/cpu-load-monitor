import { CpuLoadRecord } from './cpu-load-record';

export enum NotificationType {
  heavyLoad,
  recovery,
}

export interface Notification {
  type: NotificationType;
  createdOn: number;
  emittedOn?: number;
  cpuLoadRecords: CpuLoadRecord[];
}
