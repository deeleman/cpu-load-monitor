import { httpClientService } from '../http-client.service';

describe('httpClientService', () => {
  let fetchSpy: jest.SpyInstance<Promise<unknown>>;
  const endpointUrlMock = 'https://test.dev/api/v1/data';
  const dataFixture = { cpuLoad: 0.29656982421875, hostName: 'TestHost' };

  beforeEach(() => {
    fetchSpy = jest.spyOn(window, 'fetch');
  });

  it('should pass a valid request URL to the fetch middleware', () => {
    httpClientService(endpointUrlMock);

    expect(fetchSpy)
      .toHaveBeenCalledWith('https://test.dev/api/v1/data');
  });

  it('should return a valid product items recordset if the API responds successfully', async () => {
    window.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockReturnValue(dataFixture)
    });

    const apiResponse = await httpClientService(endpointUrlMock);

    expect(apiResponse)
      .toEqual(dataFixture);
  });

  it('should statically type the returning recordset if the API responds successfully', async () => {
    type expectedType = { hostName: string; cpuLoad: number };
    const isExpectedType = (input: any): input is expectedType =>
      (input as expectedType).hostName !== undefined &&
      (input as expectedType).cpuLoad !== undefined;

    window.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockReturnValue(dataFixture)
    });

    const apiResponse = await httpClientService<expectedType>(endpointUrlMock);

    expect(isExpectedType(apiResponse))
      .toBeTruthy();
  });

  it('should reject the returning promise if the fetch middleware throws an exception', async () => {
    fetchSpy.mockRejectedValue(new Error('test error'));

    await expect(httpClientService(endpointUrlMock)).rejects.toThrow('test error');
  });

  it('should reject the returning promise if the response is not ok', async () => {
    window.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    });

    await expect(httpClientService(endpointUrlMock)).rejects.toThrow('Invalid Response');
  });

  it('should reject the returning promise if the response HTTP status is below 200', async () => {
    window.fetch = jest.fn().mockResolvedValueOnce({
      status: 190,
      ok: true,
    });

    await expect(httpClientService(endpointUrlMock)).rejects.toThrow('Http Error 190');
  });

  it('should reject the returning promise if the response HTTP status is equals or above 300', async () => {
    window.fetch = jest.fn().mockResolvedValueOnce({
      status: 300,
      ok: true,
    });

    await expect(httpClientService(endpointUrlMock)).rejects.toThrow('Http Error 300');

    window.fetch = jest.fn().mockResolvedValueOnce({
      status: 404,
      ok: true,
    });

    await expect(httpClientService(endpointUrlMock)).rejects.toThrow('Http Error 404');

    window.fetch = jest.fn().mockResolvedValueOnce({
      status: 500,
      ok: true,
    });

    await expect(httpClientService(endpointUrlMock)).rejects.toThrow('Http Error 500');
  });
});