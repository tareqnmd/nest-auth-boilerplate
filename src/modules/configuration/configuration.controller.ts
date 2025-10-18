import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigurationRoute } from '../../common/enum';
import type { ITokenUser } from '../../common/interfaces';
import { AuthTypeEnum } from '../auth/auth.enum';
import { Auth, Token } from '../auth/decorators';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../user/enum';
import { CreateConfigurationDto, UpdateConfigurationDto } from './dto';
import { ConfigurationService } from './providers/configuration.service';

@ApiTags('Configuration')
@ApiBearerAuth('JWT-auth')
@Controller({ path: ConfigurationRoute.ROOT, version: '1' })
@Auth(AuthTypeEnum.BEARER)
@Roles(UserRoleEnum.ADMIN)
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new configuration',
    description:
      'Create a new key-value configuration entry. Only admins can access this endpoint.',
  })
  createConfiguration(
    @Body() createConfigurationDto: CreateConfigurationDto,
    @Token() currentUser: ITokenUser,
  ) {
    return this.configurationService.create(
      createConfigurationDto,
      currentUser.id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all configurations',
    description:
      'Retrieve all configuration entries. Only admins can access this endpoint.',
  })
  findAllConfigurations() {
    return this.configurationService.findAll();
  }

  @Get(ConfigurationRoute.CONFIGURATION)
  @ApiOperation({
    summary: 'Get configuration by ID',
    description:
      'Retrieve a specific configuration by its ID. Only admins can access this endpoint.',
  })
  findConfigurationById(@Param('id') id: string) {
    return this.configurationService.findOne(id);
  }

  @Patch(ConfigurationRoute.CONFIGURATION)
  @ApiOperation({
    summary: 'Update configuration by ID',
    description:
      'Update a specific configuration by its ID. Only admins can access this endpoint.',
  })
  updateConfiguration(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    return this.configurationService.update(id, updateConfigurationDto);
  }

  @Delete(ConfigurationRoute.CONFIGURATION)
  @ApiOperation({
    summary: 'Delete configuration by ID',
    description:
      'Delete a specific configuration by its ID. Only admins can access this endpoint.',
  })
  deleteConfiguration(@Param('id') id: string) {
    return this.configurationService.remove(id);
  }
}
