import { vi } from 'vitest';

// Mock Tone.js
vi.mock('tone', () => ({
  Tone: {
    start: vi.fn(),
    now: vi.fn(() => Date.now() / 1000),
    Transport: {
      start: vi.fn(),
      stop: vi.fn(),
      cancel: vi.fn(),
    },
    Synth: vi.fn().mockImplementation(() => ({
      toDestination: vi.fn(),
      triggerAttackRelease: vi.fn(),
    })),
  },
}));

// Global test setup
global.console = {
  ...console,
  // Uncomment to ignore specific console logs during tests
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};
