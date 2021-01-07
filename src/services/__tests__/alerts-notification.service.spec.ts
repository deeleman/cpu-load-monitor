import { AlertNotificationType } from '../../models';
import { AlertsNotificationService } from '../alerts-notification.service';

describe('AlertsNotificationService', () => {
  let alertsNotificationService: AlertsNotificationService;
  const subscriptionSpy = jest.fn();
  const testingAlertSettings = {
    cpuRecoveryNotificationThreshold: 10000,
    cpuOverloadAlertingThreshold: 10000,
    cpuLoadAverageThreshold: 1,
    bufferSize: 5,
  };

  jest.useFakeTimers();

  beforeEach(() => {
    alertsNotificationService = new AlertsNotificationService(testingAlertSettings);
    alertsNotificationService.subscribe(subscriptionSpy);
  });

  afterEach(subscriptionSpy.mockClear);

  describe('should emit heavy load alert notifications', () => {
    test('after processing enough heavy CPU load records given the alerting time threshold', () => {
      // Emulates heavy load CPU records spanning more than 10 seconds (min. time required for spawning an alert)
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 });

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(1);
      expect(subscriptionSpy).toHaveBeenCalledWith({
        type: AlertNotificationType.HeavyLoad,
        createdOn: 1609932400001,
        emittedOn: 1609932410003,
        cpuLoadRecords: [
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 }
        ],
      });
    });

    test('and keep emitting alert notifications if the heavy load scenario persists', () => {
      // Emulates heavy load CPU records spanning more than 10 seconds leading to 2 alert notifications
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932415004 });

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(2);
      expect(subscriptionSpy).toHaveBeenLastCalledWith({
        type: AlertNotificationType.HeavyLoad,
        createdOn: 1609932400001,
        emittedOn: 1609932415004,
        cpuLoadRecords: [
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932415004 }
        ],
      });
    });

    test('until CPU load drops below the alerting threshold', () => {
      // Emulates a heavy load CPU scenario followed by a permanent recovery
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 });
      alertsNotificationService.pipe({ loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 }); // Recovery!
      alertsNotificationService.pipe({ loadAvg: 0.88, timeLabel: '', timestamp: 1609932420005 });

      jest.advanceTimersToNextTimer();

      // expect(subscriptionSpy).toHaveBeenCalledTimes(1);
      expect(subscriptionSpy).toHaveBeenLastCalledWith({
        type: AlertNotificationType.HeavyLoad,
        createdOn: 1609932400001,
        emittedOn: 1609932410003,
        cpuLoadRecords: [
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 },
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 },
        ],
      });
    });

    test('and resume notifications on a high load scenario after a recovery', () => {
      // Emulates a heavy load CPU scenario followed by a short recovery and then another heavy load
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 });
      alertsNotificationService.pipe({ loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 }); // Recovery!
      alertsNotificationService.pipe({ loadAvg: 1.26, timeLabel: '', timestamp: 1609932420005 });
      alertsNotificationService.pipe({ loadAvg: 1.26, timeLabel: '', timestamp: 1609932425006 });
      alertsNotificationService.pipe({ loadAvg: 1.26, timeLabel: '', timestamp: 1609932430007 });

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(2);
      expect(subscriptionSpy).toHaveBeenLastCalledWith({
        type: AlertNotificationType.HeavyLoad,
        createdOn: 1609932420005,
        emittedOn: 1609932430007,
        cpuLoadRecords: [
          { loadAvg: 1.26, timeLabel: '', timestamp: 1609932420005 },
          { loadAvg: 1.26, timeLabel: '', timestamp: 1609932425006 },
          { loadAvg: 1.26, timeLabel: '', timestamp: 1609932430007 },
        ],
      });
    });
  });
  
  describe('should emit recovery alert notifications', () => {
    test('NOT BEFORE a heavy load alert scenario has been emitted first', () => {
      // Emulates a normal load CPU scenario spanning more than 10 seconds (min. time required for spawning an alert)
      alertsNotificationService.pipe({ loadAvg: 0.35, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 0.35, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 0.35, timeLabel: '', timestamp: 1609932410003 });
      alertsNotificationService.pipe({ loadAvg: 0.35, timeLabel: '', timestamp: 1609932415004 });
      alertsNotificationService.pipe({ loadAvg: 0.35, timeLabel: '', timestamp: 1609932420005 });

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).not.toHaveBeenCalled();
    });

    test('only after processing enough recovery CPU load records AFTER a heavy load alert', () => {
      // Emulates heavy load CPU records followed by an immediate recovery
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 });
      alertsNotificationService.pipe({ loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 }); // Recovery
      alertsNotificationService.pipe({ loadAvg: 0.70, timeLabel: '', timestamp: 1609932420005 });
      alertsNotificationService.pipe({ loadAvg: 0.50, timeLabel: '', timestamp: 1609932425006 });

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(2);
      expect(subscriptionSpy).toHaveBeenLastCalledWith({
        type: AlertNotificationType.Recovery,
        createdOn: 1609932415004,
        emittedOn: 1609932425006,
        cpuLoadRecords: [
          { loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 },
          { loadAvg: 0.70, timeLabel: '', timestamp: 1609932420005 },
          { loadAvg: 0.50, timeLabel: '', timestamp: 1609932425006 },
        ],
      });
    });

    test('and keep emitting recovery notifications while the recovery scenario persists', () => {
      // Emulates heavy load CPU records followed by an immediate recovery
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 }); // HeavyLoad Notification
      alertsNotificationService.pipe({ loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 }); // Recovery starts...
      alertsNotificationService.pipe({ loadAvg: 0.70, timeLabel: '', timestamp: 1609932420005 });
      alertsNotificationService.pipe({ loadAvg: 0.50, timeLabel: '', timestamp: 1609932425006 }); // Recovery notification #1
      alertsNotificationService.pipe({ loadAvg: 0.45, timeLabel: '', timestamp: 1609932430007 }); // Recovery notification #2
      alertsNotificationService.pipe({ loadAvg: 0.40, timeLabel: '', timestamp: 1609932435008 }); // Recovery notification #3

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(4);
      expect(subscriptionSpy).toHaveBeenLastCalledWith({
        type: AlertNotificationType.Recovery,
        createdOn: 1609932415004,
        emittedOn: 1609932435008,
        cpuLoadRecords: [
          { loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 },
          { loadAvg: 0.70, timeLabel: '', timestamp: 1609932420005 },
          { loadAvg: 0.50, timeLabel: '', timestamp: 1609932425006 },
          { loadAvg: 0.45, timeLabel: '', timestamp: 1609932430007 },
          { loadAvg: 0.40, timeLabel: '', timestamp: 1609932435008 },
        ],
      });
    });

    test('until CPU load exceeds the alerting threshold again', () => {
      // Emulates heavy load CPU records followed by an immediate recovery and then another heavy load peak
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 }); // HeavyLoad Notification
      alertsNotificationService.pipe({ loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 }); // Recovery starts...
      alertsNotificationService.pipe({ loadAvg: 0.70, timeLabel: '', timestamp: 1609932420005 });
      alertsNotificationService.pipe({ loadAvg: 0.50, timeLabel: '', timestamp: 1609932425006 }); // Recovery notification #1
      alertsNotificationService.pipe({ loadAvg: 0.45, timeLabel: '', timestamp: 1609932430007 }); // Recovery notification #2
      alertsNotificationService.pipe({ loadAvg: 1.26, timeLabel: '', timestamp: 1609932435008 }); // HeavyLoad resumes...

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(3);
      expect(subscriptionSpy).toHaveBeenLastCalledWith({
        type: AlertNotificationType.Recovery,
        createdOn: 1609932415004,
        emittedOn: 1609932430007,
        cpuLoadRecords: [
          { loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 },
          { loadAvg: 0.70, timeLabel: '', timestamp: 1609932420005 },
          { loadAvg: 0.50, timeLabel: '', timestamp: 1609932425006 },
          { loadAvg: 0.45, timeLabel: '', timestamp: 1609932430007 },
        ],
      });
    });

    test('and resume notifications on a recovery after a high load scenario', () => {
      // Emulates two cycles of heavy load CPU records followed by an immediate recovery
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 }); // HeavyLoad Notification #1
      alertsNotificationService.pipe({ loadAvg: 0.88, timeLabel: '', timestamp: 1609932415004 }); // Recovery starts... 
      alertsNotificationService.pipe({ loadAvg: 0.70, timeLabel: '', timestamp: 1609932420005 });
      alertsNotificationService.pipe({ loadAvg: 0.50, timeLabel: '', timestamp: 1609932425006 }); // Recovery notification #1
      alertsNotificationService.pipe({ loadAvg: 1.25, timeLabel: '', timestamp: 1609932430007 }); // HeavyLoad resumes...
      alertsNotificationService.pipe({ loadAvg: 1.26, timeLabel: '', timestamp: 1609932435008 }); 
      alertsNotificationService.pipe({ loadAvg: 1.29, timeLabel: '', timestamp: 1609932440009 }); // HeavyLoad Notification #2
      alertsNotificationService.pipe({ loadAvg: 0.40, timeLabel: '', timestamp: 1609932445010 }); // Back to recovery...
      alertsNotificationService.pipe({ loadAvg: 0.40, timeLabel: '', timestamp: 1609932450011 });
      alertsNotificationService.pipe({ loadAvg: 0.40, timeLabel: '', timestamp: 1609932455012 }); // Recovery notification #2

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(4);
      expect(subscriptionSpy).toHaveBeenLastCalledWith({
        type: AlertNotificationType.Recovery,
        createdOn: 1609932445010,
        emittedOn: 1609932455012,
        cpuLoadRecords: [
          { loadAvg: 0.40, timeLabel: '', timestamp: 1609932445010 },
          { loadAvg: 0.40, timeLabel: '', timestamp: 1609932450011 },
          { loadAvg: 0.40, timeLabel: '', timestamp: 1609932455012 },
        ],
      });
    });
  });
  
  describe('should observe a maximum time window for records in alert notifications', () => {
    test.only('so no alert notification CPU load records amount is greater than the buffer size', () => {
      // Emulates a long-running heavy load scenario
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932405002 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932410003 }); // First HeavyLoad Notification
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932415004 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932420005 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932425006 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932430007 });
      alertsNotificationService.pipe({ loadAvg: 1.10, timeLabel: '', timestamp: 1609932435008 }); // First CPU load record included in final alert 
      alertsNotificationService.pipe({ loadAvg: 1.29, timeLabel: '', timestamp: 1609932440009 });
      alertsNotificationService.pipe({ loadAvg: 1.29, timeLabel: '', timestamp: 1609932445010 });
      alertsNotificationService.pipe({ loadAvg: 1.29, timeLabel: '', timestamp: 1609932450011 });
      alertsNotificationService.pipe({ loadAvg: 1.29, timeLabel: '', timestamp: 1609932455012 });
      alertsNotificationService.pipe({ loadAvg: 0.80, timeLabel: '', timestamp: 1609932460013 });

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenLastCalledWith({
        type: AlertNotificationType.HeavyLoad,
        createdOn: 1609932435008,
        emittedOn: 1609932455012,
        cpuLoadRecords: [
          { loadAvg: 1.10, timeLabel: '', timestamp: 1609932435008 }, 
          { loadAvg: 1.29, timeLabel: '', timestamp: 1609932440009 },
          { loadAvg: 1.29, timeLabel: '', timestamp: 1609932445010 },
          { loadAvg: 1.29, timeLabel: '', timestamp: 1609932450011 },
          { loadAvg: 1.29, timeLabel: '', timestamp: 1609932455012 },
        ],
      });
    });
  })

  describe('should support custom settings configuration', () => {
    const updatedAlertSettings = {
      cpuRecoveryNotificationThreshold: 5000,
      cpuOverloadAlertingThreshold: 5000,
      cpuLoadAverageThreshold: 0.75,
      bufferSize: 3,
    };

    test('by passing a settings object thru the constructor', () => {
      alertsNotificationService = new AlertsNotificationService(updatedAlertSettings);
      alertsNotificationService.subscribe(subscriptionSpy);

      // Emulates mild load CPU records spanning 10 seconds ONLY (not enough for a notification under default settings)
      alertsNotificationService.pipe({ loadAvg: 0.25, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 0.79, timeLabel: '', timestamp: 1609932405002 }); // Heavy load starts...
      alertsNotificationService.pipe({ loadAvg: 0.82, timeLabel: '', timestamp: 1609932410003 }); // Heavyload Notification #1

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(1);
      expect(subscriptionSpy).toHaveBeenCalledWith({
        type: AlertNotificationType.HeavyLoad,
        createdOn: 1609932405002,
        emittedOn: 1609932410003,
        cpuLoadRecords: [
          { loadAvg: 0.79, timeLabel: '', timestamp: 1609932405002 },
          { loadAvg: 0.82, timeLabel: '', timestamp: 1609932410003 },
        ],
      });
    });

    test('by passing a settings object thru the updateSettings() API method', () => {
      alertsNotificationService.updateSettings(updatedAlertSettings);

      // Emulates mild load CPU records spanning 10 seconds ONLY (not enough for a notification under default settings)
      alertsNotificationService.pipe({ loadAvg: 0.25, timeLabel: '', timestamp: 1609932400001 });
      alertsNotificationService.pipe({ loadAvg: 0.79, timeLabel: '', timestamp: 1609932405002 }); // Heavy load starts...
      alertsNotificationService.pipe({ loadAvg: 0.79, timeLabel: '', timestamp: 1609932410003 }); // Heavyload Notification #1
      alertsNotificationService.pipe({ loadAvg: 0.82, timeLabel: '', timestamp: 1609932415004 }); // Heavyload Notification #2
      alertsNotificationService.pipe({ loadAvg: 0.82, timeLabel: '', timestamp: 1609932420005 }); // Heavyload Notification #3

      jest.advanceTimersToNextTimer();

      expect(subscriptionSpy).toHaveBeenCalledTimes(1);
      expect(subscriptionSpy).toHaveBeenCalledWith({
        type: AlertNotificationType.HeavyLoad,
        createdOn: 1609932410003,
        emittedOn: 1609932420005,
        cpuLoadRecords: [
          { loadAvg: 0.79, timeLabel: '', timestamp: 1609932410003 },
          { loadAvg: 0.82, timeLabel: '', timestamp: 1609932415004 },
          { loadAvg: 0.82, timeLabel: '', timestamp: 1609932420005 },
        ],
      });
    });
  });
});
