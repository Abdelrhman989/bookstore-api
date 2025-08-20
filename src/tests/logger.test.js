const logger = require('../utils/logger').default;

describe('Logger', () => {
  test('should have all required logging methods', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.http).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  test('should log messages without throwing errors', () => {
    // Spy on console methods to prevent actual logging during tests
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    expect(() => {
      logger.info('Test info message');
      logger.error('Test error message');
      logger.warn('Test warning message');
      logger.debug('Test debug message');
      logger.http('Test HTTP message');
    }).not.toThrow();
    
    consoleSpy.mockRestore();
  });
});