import { CpuLoadRecord, Observable } from '../models';
import { settings } from '../settings';
import { cpuLoadRecordSerializer } from './helpers';
import { httpClientService } from './http-client.service';

/**
 * @description
 * Class service exposing an observable interface that pings the API endpoint on regular
 * intervals and emits the last-minute CPU load data through its `subscribe()` method.
 * This method returns a hot observable that lazily initiates polling and supports multiple subscribers.
 * The method returns an unsunscription handler that will cancel polling and terminate all subscriptions.
 * The polling milliseconds interval is both configurable upon creating an instance and via
 * the `refreshRate` public property. Nonetheless it assumes the value configured by default for the
 * `REFRESH_RATE_MS` (wrapped by the settings token) token in the configuration file.
 * 
 * @see [REFRESH_RATE_MS](../settings/settings.configuration.ts)
 * @see [API_ENDPOINT](../settings/settings.configuration.ts)
 */
export class CpuPollingService implements Observable<CpuLoadRecord> {
  private subscribers: Array<(cpuLoadRecord: CpuLoadRecord) => void> = [];
  private pollingTimeout: any;
  private replayCpuLoadRecord: CpuLoadRecord | undefined;

  constructor(private pollingRate: number = settings.refreshRate) { }

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
    if (this.replayCpuLoadRecord !== void 0) {
      next.call(null, this.replayCpuLoadRecord);
    }    

    this.subscribers.push(next);

    if (this.subscribers.length === 1) {
      this.requestCpuLoadRecord();
    }

    return this.unsubscribeAllSubscribers.bind(this);
  }

  private async requestCpuLoadRecord(): Promise<void> {
    clearTimeout(this.pollingTimeout);
    
    this.replayCpuLoadRecord = await httpClientService<CpuLoadRecord>(settings.pollingEndpoint, cpuLoadRecordSerializer);
    this.subscribers.forEach((subscription) => subscription.call(null, this.replayCpuLoadRecord!!));

    this.pollingTimeout = setTimeout(async () => await this.requestCpuLoadRecord(), this.pollingRate);
  }

  private unsubscribeAllSubscribers(): void {
    clearTimeout(this.pollingTimeout);
    this.subscribers = [];
    this.replayCpuLoadRecord = void 0;
  }
}
