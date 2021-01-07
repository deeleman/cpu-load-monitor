import { AlertSettings, alertSettings, CpuLoadRecord, Notification, NotificationType, Observable } from '../models';

export class NotificationsService implements Observable<Notification> {
  private pivotalNotification: Notification | undefined;
  private subscribers: Array<(notification: Notification) => void> = [];

  constructor(private settings: AlertSettings = alertSettings) {}

  updateSettings(settings: AlertSettings): void {
    this.settings = settings;
  }

  add(cpuLoadRecord: CpuLoadRecord): void {
    const type = cpuLoadRecord.loadAvg >= this.settings.cpuLoadAverageThreshold ?
      NotificationType.heavyLoad : 
      NotificationType.recovery;

    if (this.pivotalNotification === void 0 && type === NotificationType.heavyLoad) {
      this.replacePivotalNotification(cpuLoadRecord, type);
    } else if (this.pivotalNotification !== void 0 && this.pivotalNotification.type !== type) {
      this.replacePivotalNotification(cpuLoadRecord, type);
    } else if (this.pivotalNotification !== void 0 && this.pivotalNotification.type === type) {
      const notification = this.updatePivotalNotification(cpuLoadRecord);
      if (notification.emittedOn !== void 0) {
        this.emitNotification(notification);
      }
    }
  }

  subscribe(next: (notification: Notification) => void): () => void {
    this.subscribers.push(next);

    return this.unsubscribeAllSubscribers.bind(this);
  }

  private replacePivotalNotification(cpuLoadRecord: CpuLoadRecord, type: NotificationType): void {
    this.pivotalNotification = {
      type,
      createdOn: cpuLoadRecord.timestamp,
      cpuLoadRecords: [],
    };
  }

  private updatePivotalNotification(cpuLoadRecord: CpuLoadRecord): Notification {
    const pivotalNotification = this.pivotalNotification as Notification;
    pivotalNotification.cpuLoadRecords.push(cpuLoadRecord);
    
    const threshold = pivotalNotification.type === NotificationType.heavyLoad ?
      this.settings.cpuOverloadAlertingThreshold :
      this.settings.cpuRecoveryNotificationThreshold;
    
    const shouldEmit = (cpuLoadRecord.timestamp - pivotalNotification.createdOn) >= threshold;
    
    if (shouldEmit) {
      pivotalNotification.emittedOn = cpuLoadRecord.timestamp;
    }
   
    return pivotalNotification;
  }

  private emitNotification(notification: Notification): void {
    this.subscribers.forEach((subscription) => subscription.call(null, notification));
  }

  private unsubscribeAllSubscribers(): void {
    this.subscribers = [];
    this.pivotalNotification = void 0;
  }
}
