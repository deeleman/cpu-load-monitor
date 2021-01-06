import { CpuPollingService } from '../cpu-polling.service';
import * as httpClentModule from '../http-client.service';

jest.mock('../http-client.service', () => ({
  httpClientService: jest.fn()
    .mockResolvedValueOnce({ loadAvg: 0.22233332101001, timestamp: 1609932400001 })
    .mockResolvedValueOnce({ loadAvg: 0.22233332102002, timestamp: 1609932405002 })
    .mockResolvedValueOnce({ loadAvg: 0.22233332102003, timestamp: 1609932410003 })
    .mockResolvedValueOnce({ loadAvg: 0.22233332102004, timestamp: 1609932415004 })
    .mockResolvedValueOnce({ loadAvg: 0.22233332102005, timestamp: 1609932420005 })
    .mockResolvedValueOnce({ loadAvg: 0.22233332102006, timestamp: 1609932425006 })
}));

describe('CpuPollingService', () => {
  const pollingRateMock = 1000;
  let cpuPollingService: CpuPollingService;
  let teardownSubscriptionsFn: () => void;
  const flushPromises = () => new Promise(setImmediate);

  beforeEach(() => {
    cpuPollingService = new CpuPollingService(pollingRateMock);
  });

  afterEach(() => {
    if (teardownSubscriptionsFn) {
      teardownSubscriptionsFn();
    }
  });

  test('should be instanced', () => {
    expect(cpuPollingService).not.toBeUndefined();
  });

  test('should let peeking into the polling rate via the refreshRate property', () => {
    expect(cpuPollingService.refreshRate).toBe(pollingRateMock);
  });

  test('should update the polling rate via the refreshRate property', () => {
    const largerPollingRateMock = 3000;
    cpuPollingService.refreshRate = largerPollingRateMock;

    expect(cpuPollingService.refreshRate).toBe(largerPollingRateMock);
  });

  test('should emit values through the subscribe() method', (done) => {
    teardownSubscriptionsFn = cpuPollingService.subscribe((data) => {
      expect(data).toEqual({ loadAvg: 0.22233332101001, timestamp: 1609932400001 });
      done();
    });
  });

  test('should broadcast via subscribe() the same value to all subscribers at once', async () => {
    const subscriberOneStub = jest.fn();
    const subscriberTwoStub = jest.fn();

    cpuPollingService.subscribe(subscriberOneStub);
    teardownSubscriptionsFn = cpuPollingService.subscribe(subscriberTwoStub);
    
    await flushPromises();
    
    expect(subscriberOneStub).toHaveBeenCalledWith({ loadAvg: 0.22233332102002, timestamp: 1609932405002 });
    expect(subscriberTwoStub).toHaveBeenCalledWith({ loadAvg: 0.22233332102002, timestamp: 1609932405002 });
  });

  test('should replay the last emitted value to any new subscriber added before the next tick', async () => {
    const replaySubscriberStub = jest.fn();

    cpuPollingService.subscribe(jest.fn);
    await flushPromises();

    teardownSubscriptionsFn = cpuPollingService.subscribe(replaySubscriberStub);
    
    expect(replaySubscriberStub).toHaveBeenCalledWith({ loadAvg: 0.22233332102003, timestamp: 1609932410003 });
  });

  test('should broadcast the same values to multiple subscribers on each polling cycle', async () => {
    const subscriberOneStub = jest.fn();
    const subscriberTwoStub = jest.fn();

    cpuPollingService.subscribe(subscriberOneStub);
    teardownSubscriptionsFn = cpuPollingService.subscribe(subscriberTwoStub);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await flushPromises();
    
    expect(subscriberOneStub).toHaveBeenLastCalledWith({ loadAvg: 0.22233332102006, timestamp: 1609932425006 });
    expect(subscriberTwoStub).toHaveBeenLastCalledWith({ loadAvg: 0.22233332102006, timestamp: 1609932425006 });
  });

  test('should cancel the ongoing polling cycle and spawn a new one upon updating the refreshRate', async () => {
    const httpClientServiceSpy = jest.spyOn(httpClentModule, 'httpClientService');

    teardownSubscriptionsFn = cpuPollingService.subscribe(() => void 0);

    await flushPromises();
    httpClientServiceSpy.mockClear();

    cpuPollingService.refreshRate = pollingRateMock + 1;

    expect(httpClientServiceSpy).toHaveBeenCalledTimes(1);
  });
});