import { CpuLoadRecord } from './cpu-load-record';

export enum AlertNotificationType {
  heavyLoad,
  recovery,
  
}

export interface AlertNotification {
  type: AlertNotificationType;
  createdOn: number;
  emittedOn?: number;
  cpuLoadRecords: CpuLoadRecord[];
}
