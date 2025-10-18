export const PROCESS_EXIT_CODES = {
  SUCCESS: 0,
  FAILURE: 1,
} as const;

export const PROCESS_TIMEOUTS = {
  GRACEFUL_SHUTDOWN: 30000,
} as const;
