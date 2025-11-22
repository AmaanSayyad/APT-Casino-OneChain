import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock global objects if needed
global.fetch = global.fetch || vi.fn();

// Add custom matchers if needed
expect.extend({
  // Custom matchers can be added here
});
