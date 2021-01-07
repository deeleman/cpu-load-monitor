import { AlertSettings, alertSettings, CpuLoadRecord, AlertNotification, AlertNotificationType, Observable } from '../models';

export class AlertNotificationsService implements Observable<AlertNotification> {
  private hasNotifiedHeavyLoadAlready = false;
  private pivotalAlert: AlertNotification | undefined;
  private subscribers: Array<(notification: AlertNotification) => void> = [];

  constructor(private settings: AlertSettings = alertSettings) {}

  updateSettings(settings: AlertSettings): void {
    this.settings = settings;
  }

  add(cpuLoadRecord: CpuLoadRecord): void {
    const cpuLoadRecordType = cpuLoadRecord.loadAvg >= this.settings.cpuLoadAverageThreshold ?
      AlertNotificationType.heavyLoad : 
      AlertNotificationType.recovery;

    // If no previous alert notification, we only create the first one not before the first heavy load alert pops up
    if (this.pivotalAlert === void 0 && cpuLoadRecordType === AlertNotificationType.heavyLoad) {
      this.replacePivotalAlert(cpuLoadRecord, cpuLoadRecordType);
    // If alerting has kicked off, we only replace the current ongoing alert upon a change in the alert type trend
    } else if (this.pivotalAlert !== void 0 && this.pivotalAlert.type !== cpuLoadRecordType) {
      this.replacePivotalAlert(cpuLoadRecord, cpuLoadRecordType);
    // If alerting has kicked off but the CPU load trend remains the same, we just update the current ongoing alert
    } else if (this.pivotalAlert !== void 0 && this.pivotalAlert.type === cpuLoadRecordType) {
      const notification = this.updatePivotalAlert(cpuLoadRecord);
      if (notification.emittedOn !== void 0) {
        this.emitNotification(notification);
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
    const pivotalAlert = this.pivotalAlert as AlertNotification;
    pivotalAlert.cpuLoadRecords.push(cpuLoadRecord);
    
    const timeThreshold = pivotalAlert.type === AlertNotificationType.heavyLoad ?
      this.settings.cpuOverloadAlertingThreshold :
      this.settings.cpuRecoveryNotificationThreshold;
    
    const exceedsTimeThreshold = (cpuLoadRecord.timestamp - pivotalAlert.createdOn) >= timeThreshold;
    const isHeavyLoadAlert = pivotalAlert.type === AlertNotificationType.heavyLoad;
    const isRecoveryAfterHeavyLoadAlert = pivotalAlert.type === AlertNotificationType.recovery && this.hasNotifiedHeavyLoadAlready;

    const shouldEmitNotification = exceedsTimeThreshold && (isHeavyLoadAlert || isRecoveryAfterHeavyLoadAlert);

    if (shouldEmitNotification) {
      pivotalAlert.emittedOn = cpuLoadRecord.timestamp;
    }
   
    return pivotalAlert;
  }

  private emitNotification(notification: AlertNotification): void {
    this.subscribers.forEach((subscription) => subscription.call(null, notification));
    if (notification.type === AlertNotificationType.heavyLoad && !this.hasNotifiedHeavyLoadAlready) {
      this.hasNotifiedHeavyLoadAlready = true;
    }
  }

  private unsubscribeAllSubscribers(): void {
    this.subscribers = [];
    this.pivotalAlert = void 0;
  }
}
