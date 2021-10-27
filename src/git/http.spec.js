const fetch = require('node-fetch');
const http = require('./http');

jest.mock('node-fetch', () => jest.fn());

describe('http', () => {
  describe('GET requests', () => {
    it('should make a GET request', async () => {
      fetch.mockImplementation(() => Promise.resolve({
        status: 200,
        json: () => ({ message: 'ok!' }),
      }));

      const result = await http.get('some url');

      expect(result.message).toEqual('ok!');
    });

    it('should catch errors', async () => {
      fetch.mockImplementation(() => Promise.resolve({
        status: 500,
        statusText: 'test error',
        json: () => ({ message: 'not ok!' }),
      }));

      await expect(http.get('some url')).rejects.toThrow('Http request failed: test error');
    });

    it('should catch 401 errors', async () => {
      fetch.mockImplementation(() => Promise.resolve({
        status: 401,
        statusText: 'test error',
        json: () => ({ message: 'not ok!' }),
      }));

      await expect(http.get('some url')).rejects.toThrow('Http request failed: test error (is your Github token correct?)');
    });
  });

  describe('PATCH requests', () => {
    it('should make a PATCH request', async () => {
      fetch.mockImplementation(() => Promise.resolve({
        status: 200,
        json: () => ({ message: 'ok!' }),
      }));

      const result = await http.patch('some url');

      expect(result.message).toEqual('ok!');
    });

    it('should catch errors', async () => {
      fetch.mockImplementation(() => Promise.resolve({
        status: 500,
        statusText: 'test error',
        json: () => ({ message: 'not ok!' }),
      }));

      await expect(http.patch('some url')).rejects.toThrow('Http request failed: test error');
    });

    it('should catch 401 errors', async () => {
      fetch.mockImplementation(() => Promise.resolve({
        status: 401,
        statusText: 'test error',
        json: () => ({ message: 'not ok!' }),
      }));

      await expect(http.patch('some url')).rejects.toThrow('Http request failed: test error (is your Github token correct?)');
    });
  });

  describe('POST requests', () => {
    it('should make a POST request', async () => {
      fetch.mockImplementation(() => Promise.resolve({
        status: 200,
        json: () => ({ message: 'ok!' }),
      }));

      await expect(http.post('some url')).resolves.not.toThrow();
    });
  });

  describe('DELETE requests', () => {
    it('should make a DELETE request', async () => {
      fetch.mockImplementation(() => Promise.resolve({
        status: 200,
        json: () => ({ message: 'ok!' }),
      }));

      await expect(http.remove('some url')).resolves.not.toThrow();
    });
  });
});
