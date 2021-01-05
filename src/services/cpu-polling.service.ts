import { CpuLoadRecord } from '../models';
import { httpClientService } from './http-client.service';

export class CpuPollingService {
  private subscribers: Array<(cpuLoadRecord: CpuLoadRecord) => void> = [];
  private pollingTimeout: any;

  constructor(private pollingRate: number) { }

  set refreshRate(rate: number) {
    this.pollingRate = rate;

    if (this.pollingTimeout !== void 0) {
      this.requestCpuLoadRecord();
    }
  }

  get refreshRate(): number {
    return this.pollingRate;
  }

  subscribe(next: (cpuLoadRecord: CpuLoadRecord) => void): () => void {
    this.subscribers.push(next);

    if (this.pollingTimeout === void 0) {
      this.requestCpuLoadRecord();
    }

    return this.unsubscribeAllSubscribers;
  }

  private async requestCpuLoadRecord(): Promise<void> {
    clearTimeout(this.pollingTimeout);

    const cpuLoadRecord = await httpClientService<CpuLoadRecord>('/api/cpu');
    this.subscribers.forEach((subscription) => subscription.call(null, cpuLoadRecord));

    this.pollingTimeout = setTimeout(async () => await this.requestCpuLoadRecord(), this.pollingRate);
  }

  private unsubscribeAllSubscribers(): void {
    clearTimeout(this.pollingTimeout);
    this.subscribers = [];
  }
}
