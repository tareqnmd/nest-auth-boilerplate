import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthTypeEnum } from './modules/auth/auth.enum';
import { Auth } from './modules/auth/decorators/auth.decorator';

@Controller()
@Auth(AuthTypeEnum.NONE)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
