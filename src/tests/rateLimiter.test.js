const { rateLimiter, authLimiter } = require('../middlewares/rateLimiter.middleware');

describe('Rate Limiter Middleware', () => {
  test('should have rateLimiter middleware', () => {
    expect(rateLimiter).toBeDefined();
    expect(typeof rateLimiter).toBe('function');
  });

  test('should have authLimiter middleware', () => {
    expect(authLimiter).toBeDefined();
    expect(typeof authLimiter).toBe('function');
  });

  test('should have different configurations', () => {
    // Check that the two limiters have different configurations
    // by examining their internal options
    expect(rateLimiter.options).toBeDefined();
    expect(authLimiter.options).toBeDefined();
    
    // Auth limiter should be more restrictive
    expect(authLimiter.options.max).toBeLessThan(rateLimiter.options.max);
  });
});