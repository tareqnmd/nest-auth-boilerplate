import { ConfigService } from '@nestjs/config';

interface LoggerLike {
  log: (message: string | object, ...optionalParams: unknown[]) => void;
  error: (message: string | object, ...optionalParams: unknown[]) => void;
}

export class BootstrapLogger {
  constructor(
    private readonly logger: LoggerLike,
    private readonly configService: ConfigService,
  ) {}

  logApplicationStarting(): void {
    this.logger.log({
      message: 'Application starting',
      environment: this.configService.get<string>('appConfig.env'),
      nodeVersion: process.version,
      port: this.configService.get<number>('appConfig.port'),
      pid: process.pid,
    });
  }

  logApplicationStarted(port: number): void {
    this.logger.log({
      message: 'Application started successfully',
      url: `http://localhost:${port}`,
      pid: process.pid,
    });
  }

  logServerStartError(error: unknown, port: number): void {
    this.logger.error({
      message: 'Failed to start HTTP server',
      error: error instanceof Error ? error.message : String(error),
      port,
    });
  }

  static logBootstrapError(error: unknown): void {
    console.error('Bootstrap failed:', error);
  }
}
