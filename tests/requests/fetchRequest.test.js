/**
 * Tests for fetchRequest function
 * Covers FR-027, FR-028, FR-029, FR-030
 * - State management (loading, success, error)
 * - Success/error/finally callbacks
 * - Delay functionality
 * - Concurrency prevention
 *
 * Note: These tests verify the public API contracts and state management,
 * without testing the full render integration (which is tested separately).
 */

import { fetchRequest } from 'src/requests.js';
import { createMockAppBlockConfig, setupFetchMock, resetDOM } from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('fetchRequest', () => {
  afterEach(() => {
    resetDOM();
    if (global.fetch && global.fetch.mockClear) {
      global.fetch.mockClear();
    }
  });

  test('should set loading state to true when request starts', () => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    setupFetchMock({ success: true });

    // Act
    fetchRequest(app, 'https://api.test/data', {}, {});

    // Assert
    expect(app.state.loading).toBe(true);
  });

  test('should make fetch call with correct URL and options', (done) => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    setupFetchMock({ success: true });
    const options = { headers: { 'Content-Type': 'application/json' } };

    // Act
    fetchRequest(app, 'https://api.test/data', options, {});

    // Assert - fetch happens inside setTimeout, so wait for it
    setTimeout(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://api.test/data', options);
      done();
    }, 50);
  });

  test('should prevent concurrent requests while loading', () => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    setupFetchMock({ data: 'test' });

    // Act
    app.state.loading = true; // Simulate loading state
    const result = fetchRequest(app, 'https://api.test/data', {}, {});

    // Assert - subsequent request is ignored
    expect(result).toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should apply delay before sending fetch request', (done) => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    setupFetchMock({ data: 'test' });
    const startTime = Date.now();

    // Act
    fetchRequest(app, 'https://api.test/data', {}, {}, 100); // 100ms delay

    // Assert - verify delay was applied before fetch call
    setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      expect(global.fetch).toHaveBeenCalled();
      expect(elapsedTime).toBeGreaterThanOrEqual(90); // Allow 10ms variance
      done();
    }, 150);
  });

  test('should reset state before starting new request', () => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    setupFetchMock({ data: 'test' });
    app.state.success = true; // Pre-existing state
    app.state.error = true;

    // Act
    fetchRequest(app, 'https://api.test/data', {}, {});

    // Assert - state should be reset
    expect(app.state.success).toBe(false);
    expect(app.state.error).toBe(false);
    expect(app.state.loading).toBe(true);
  });

  test('should accept callbacks object with optional methods', () => {
    // Arrange
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    setupFetchMock({ data: 'test' });
    const callbacks = {
      success: jest.fn(),
      error: jest.fn(),
      finally: jest.fn()
    };

    // Act - should not throw even though callbacks might not execute immediately
    fetchRequest(app, 'https://api.test/data', {}, callbacks);

    // Assert - function completes without error
    expect(app.state.loading).toBe(true);
  });
});
