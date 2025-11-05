import { logError, logWarning, logInfo } from 'src/logger.js';
import { createMockAppBlockConfig, createConsoleSpy, restoreConsoleSpy } from 'tests/fixtures/mockData.js';

describe('logger functions', () => {
  let comp;
  let spy;

  beforeEach(() => {
    comp = createMockAppBlockConfig();
  });

  afterEach(() => {
    if (spy) restoreConsoleSpy(spy);
    spy = null;
  });

  test('logError uses console.error and includes component name', () => {
    spy = createConsoleSpy('error');
    logError(comp, 'something broke');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(`${comp.name}: something broke`);
  });

  test('logWarning uses console.warn and includes component name', () => {
    spy = createConsoleSpy('warn');
    logWarning(comp, 'be careful');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(`${comp.name}: be careful`);
  });

  test('logInfo uses console.info and includes component name', () => {
    spy = createConsoleSpy('info');
    logInfo(comp, 'for your information');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(`${comp.name}: for your information`);
  });
});
