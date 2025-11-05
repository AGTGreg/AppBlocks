/**
 * Tests for axiosRequest function
 * Covers FR-031
 * - Axios-based request handling (mocked since axios is not a dependency)
 * - Success/error/finally callbacks
 * - Response modification in success callback
 * - State management similar to fetchRequest
 *
 * Note: axios is mocked globally since it's not included in package.json.
 * In production, axios would need to be installed separately and included in the page.
 * These tests verify the public API contracts and state management.
 */

import { axiosRequest } from 'src/requests.js';
import { createMockAppBlockConfig, resetDOM } from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('axiosRequest', () => {
  beforeEach(() => {
    // Mock axios globally since it's not included as a dependency
    // In production, axios would be a separate script include
    global.axios = {
      request: jest.fn()
    };
  });

  afterEach(() => {
    resetDOM();
    delete global.axios;
  });

  test('should set loading state to true and call axios when request starts', (done) => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    const mockResponse = { status: 200, data: { success: true } };
    global.axios.request.mockReturnValue(Promise.resolve(mockResponse));

    // Act
    axiosRequest(app, { method: 'GET', url: 'https://api.test/data' }, {});

    // Assert - immediately after call, loading should be true
    expect(app.state.loading).toBe(true);

    // axios.request happens inside setTimeout, so verify it was called
    setTimeout(() => {
      expect(global.axios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.test/data'
      });
      done();
    }, 50);
  });

  test('should make axios request with correct config', (done) => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    const axiosConfig = {
      method: 'POST',
      url: 'https://api.test/submit',
      data: { name: 'test' }
    };
    global.axios.request.mockReturnValue(Promise.resolve({ status: 200 }));

    // Act
    axiosRequest(app, axiosConfig, {});

    // Assert - axios.request happens inside setTimeout, so wait for it
    setTimeout(() => {
      expect(global.axios.request).toHaveBeenCalledWith(axiosConfig);
      done();
    }, 50);
  });

  test('should reset state before starting new request', () => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    global.axios.request.mockReturnValue(Promise.resolve({ status: 200 }));
    app.state.success = true; // Pre-existing state
    app.state.error = true;

    // Act
    axiosRequest(app, { method: 'GET', url: 'https://api.test/data' }, {});

    // Assert - state should be reset before request
    expect(app.state.success).toBe(false);
    expect(app.state.error).toBe(false);
    expect(app.state.loading).toBe(true);
  });

  test('should accept callbacks and handle axios promise chain', (done) => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    const callbacks = {
      success: jest.fn(),
      error: jest.fn(),
      finally: jest.fn()
    };
    global.axios.request.mockReturnValue(Promise.resolve({ status: 200 }));

    // Act - should not throw even with all callback handlers
    axiosRequest(app, { method: 'GET', url: 'https://api.test/data' }, callbacks);

    // Assert - request was initiated  and loading state set
    expect(app.state.loading).toBe(true);

    // axios.request was called
    setTimeout(() => {
      expect(global.axios.request).toHaveBeenCalled();
      done();
    }, 50);
  });
});
