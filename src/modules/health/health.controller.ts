import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { ControllerTextEnum } from '../../common/enum/controller-text.enum';
import { AuthTypeEnum } from '../auth/auth.enum';
import { Auth } from '../auth/decorators';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: MongooseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get()
  @Auth(AuthTypeEnum.NONE)
  @HealthCheck()
  @ApiOperation({ summary: ControllerTextEnum.HEALTH_CHECK_SUMMARY })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }

  @Get('ready')
  @Auth(AuthTypeEnum.NONE)
  @HealthCheck()
  @ApiOperation({ summary: ControllerTextEnum.HEALTH_READINESS_SUMMARY })
  checkReadiness() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('live')
  @Auth(AuthTypeEnum.NONE)
  @HealthCheck()
  @ApiOperation({ summary: ControllerTextEnum.HEALTH_LIVENESS_SUMMARY })
  checkLiveness() {
    return this.health.check([]);
  }
}
