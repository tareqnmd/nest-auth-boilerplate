import { Logger } from '@nestjs/common';
import { CIRCUIT_BREAKER_CONSTANTS } from '../constants';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  monitoringPeriod: number;
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_FAILURE_THRESHOLD,
  successThreshold: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_SUCCESS_THRESHOLD,
  timeout: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_TIMEOUT,
  monitoringPeriod: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_MONITORING_PERIOD,
};

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttemptTime = Date.now();
  private readonly logger: Logger;
  private failureTimestamps: number[] = [];

  constructor(
    private readonly name: string,
    private readonly options: CircuitBreakerOptions = DEFAULT_OPTIONS,
  ) {
    this.logger = new Logger(`CircuitBreaker:${name}`);
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        const error = new Error(
          `Circuit breaker is OPEN for ${this.name}. Service temporarily unavailable.`,
        );
        this.logger.warn(error.message);
        throw error;
      }
      this.state = CircuitState.HALF_OPEN;
      this.successCount = 0;
      this.logger.log(
        `Circuit breaker entering HALF_OPEN state for ${this.name}`,
      );
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.cleanOldFailures();

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
        this.logger.log(
          `Circuit breaker CLOSED for ${this.name}. Service recovered.`,
        );
      }
    }
  }

  private onFailure(): void {
    const now = Date.now();
    this.failureTimestamps.push(now);
    this.failureCount++;
    this.cleanOldFailures();

    if (
      this.state === CircuitState.HALF_OPEN ||
      this.failureCount >= this.options.failureThreshold
    ) {
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = now + this.options.timeout;
      this.logger.error(
        `Circuit breaker OPENED for ${this.name}. Too many failures (${this.failureCount}/${this.options.failureThreshold})`,
      );
    }
  }

  private cleanOldFailures(): void {
    const cutoffTime = Date.now() - this.options.monitoringPeriod;
    this.failureTimestamps = this.failureTimestamps.filter(
      (timestamp) => timestamp > cutoffTime,
    );
    this.failureCount = this.failureTimestamps.length;
  }

  getState(): CircuitState {
    return this.state;
  }

  getStats(): {
    state: CircuitState;
    failureCount: number;
    successCount: number;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
    };
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.failureTimestamps = [];
    this.nextAttemptTime = Date.now();
    this.logger.log(`Circuit breaker manually reset for ${this.name}`);
  }
}
