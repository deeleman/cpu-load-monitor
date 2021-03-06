import { AlertNotification, AlertNotificationType, CpuLoadRecord, Observable } from '../models';
import { AlertSettings, defaultSettings } from '../settings';

/**
 * @description
 * Class service exposing an observable interface that allows subscribers to receive alert notifications
 * about the current load state of the host CPU. Such notifications are the result of digesting
 * CPU load records passed via the `pipe()` API method into the notification pipeline. The overall business
 * logic dictates that notifications will kick off once heavy CPU load is informed via successive CPU load
 * records after the time window defined by the settings. Recovery alert notifications will only be emitted
 * after a pre-existing heavy load notification, never after a non notified heavy load temporary state.
 * 
 * Settings can be defined via the constructor or by running the `updateSettings()` API method. If not defined
 * the system will fetch the default settings as configured in the configuration manifest.
 *
 * @see [CPU_LOAD_RECOVERY_THRESHOLD_MS](../settings/settings.configuration.ts)
 * @see [CPU_OVERLOAD_ALERT_THRESHOLD_MS](../settings/settings.configuration.ts)
 * @see [LOAD_AVERAGE_THRESHOLD](../settings/settings.configuration.ts)
 */
export class AlertsNotificationService implements Observable<AlertNotification> {
  private isRecoveryAlertPending = false;
  private pivotalAlert: AlertNotification | undefined;
  private subscribers: Array<(notification: AlertNotification) => void> = [];

  constructor(private alertSettings: AlertSettings = defaultSettings) {}

  updateSettings(settings: AlertSettings): void {
    this.alertSettings = settings;
  }

  pipe(cpuLoadRecord: CpuLoadRecord): void {
    const cpuLoadRecordType = cpuLoadRecord.loadAvg >= this.alertSettings.cpuLoadAverageThreshold ?
      AlertNotificationType.HeavyLoad : 
      AlertNotificationType.Recovery;

    // If no previous alert notification, we only create the first one not before the first heavy load alert pops up
    if (this.pivotalAlert === void 0 && cpuLoadRecordType === AlertNotificationType.HeavyLoad) {
      this.replacePivotalAlert(cpuLoadRecord, cpuLoadRecordType);
    // If alerting has kicked off, we only replace the current ongoing alert upon a change in the alert type trend
    } else if (this.pivotalAlert !== void 0 && this.pivotalAlert.type !== cpuLoadRecordType) {
      this.replacePivotalAlert(cpuLoadRecord, cpuLoadRecordType);
    // If alerting has kicked off but the CPU load trend remains the same, we just update the current ongoing alert
    } else if (this.pivotalAlert !== void 0 && this.pivotalAlert.type === cpuLoadRecordType) {
      this.pivotalAlert = this.updatePivotalAlert(cpuLoadRecord);

      if (this.pivotalAlert.emittedOn !== void 0) {
        this.emitNotification(this.pivotalAlert);
      } else if (this.pivotalAlert.type === AlertNotificationType.HeavyLoad) {
        this.isRecoveryAlertPending = false;
      }
    }
  }

  subscribe(next: (notification: AlertNotification) => void): () => void {
    this.subscribers.push(next);

    return this.unsubscribeAllSubscribers.bind(this);
  }

  private replacePivotalAlert(cpuLoadRecord: CpuLoadRecord, type: AlertNotificationType): void {
    this.pivotalAlert = {
      type,
      createdOn: cpuLoadRecord.timestamp,
      cpuLoadRecords: [cpuLoadRecord],
    };
  }

  private updatePivotalAlert(cpuLoadRecord: CpuLoadRecord): AlertNotification {
    const pivotalAlert = { ...this.pivotalAlert } as AlertNotification;
    pivotalAlert.cpuLoadRecords.push(cpuLoadRecord);

    if (pivotalAlert.cpuLoadRecords.length > this.alertSettings.bufferSize) {
      const startingIndex = pivotalAlert.cpuLoadRecords.length - this.alertSettings.bufferSize;
      pivotalAlert.cpuLoadRecords = pivotalAlert.cpuLoadRecords.slice(startingIndex);
    }  
    
    pivotalAlert.createdOn = pivotalAlert.cpuLoadRecords[0].timestamp;

    const timeThreshold = pivotalAlert.type === AlertNotificationType.HeavyLoad ?
      this.alertSettings.cpuOverloadAlertingThreshold :
      this.alertSettings.cpuRecoveryNotificationThreshold;
    
    const hasExceededTimeThreshold = (cpuLoadRecord.timestamp - pivotalAlert.createdOn) >= timeThreshold;
    const isHeavyLoadAlert = pivotalAlert.type === AlertNotificationType.HeavyLoad;
    const isRecoveryAlert = pivotalAlert.type === AlertNotificationType.Recovery && this.isRecoveryAlertPending;

    const shouldEmitNotification = hasExceededTimeThreshold && (isHeavyLoadAlert || isRecoveryAlert);

    if (shouldEmitNotification) {
      pivotalAlert.emittedOn = cpuLoadRecord.timestamp;
    }
   
    return pivotalAlert;
  }

  private emitNotification(notification: AlertNotification): void {
    this.subscribers.forEach((subscription) => subscription.call(null, notification));
    if (notification.type === AlertNotificationType.HeavyLoad && !this.isRecoveryAlertPending) {
      this.isRecoveryAlertPending = true;
    }
  }

  private unsubscribeAllSubscribers(): void {
    this.subscribers = [];
    this.pivotalAlert = void 0;
  }
}
