import { CpuLoadRecord } from "../../models";
import { formatTimestamp } from './format-timestamp';

export type RawCpuLoadRecord = Pick<CpuLoadRecord, 'loadAvg' | 'timestamp'>;

/**
 * @description
 * Transforms a RawCpuLoadRecord, whic is basically a CpuLoadRecordObject with 
 * no timeLabel info (as returned by the API) into a fully populated CpuLoadRecord object.
 * 
 * @param rawCpuLoadRecord RawCpuLoadRecord, equals a CpuLoadRecordObject with 
 * no timeLabel info (as returned by the API).
 */
export const cpuLoadRecordSerializer = (rawCpuLoadRecord: RawCpuLoadRecord): CpuLoadRecord => {
  return {
    ...rawCpuLoadRecord,
    timeLabel: formatTimestamp(rawCpuLoadRecord.timestamp),
  };
};
