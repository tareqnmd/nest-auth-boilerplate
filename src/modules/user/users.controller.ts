import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ControllerTextEnum } from '../../common/enum/controller-text.enum';

import { UserRoute } from '../../common/enum';
import type * as UserInterfaces from '../../common/interfaces/user.interface';
import { AuthTypeEnum } from '../auth/auth.enum';
import { Auth, Roles, Token } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import {
  ChangePasswordDto,
  UpdateUserDto,
  UserQueryDto,
  UserRoleUpdateDto,
} from './dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UserRoleEnum } from './enum';
import { UserService } from './providers/user.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller({ path: UserRoute.ROOT, version: '1' })
@Auth(AuthTypeEnum.BEARER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({
    summary: ControllerTextEnum.USER_GET_ALL_SUMMARY,
  })
  getAllUsers(@Query() query: UserQueryDto) {
    return this.userService.getAllUsers(query);
  }

  @Get(UserRoute.USER)
  @ApiOperation({ summary: ControllerTextEnum.USER_GET_BY_ID_SUMMARY })
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(UserRoute.USER)
  @ApiOperation({ summary: ControllerTextEnum.USER_UPDATE_SUMMARY })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch(UserRoute.CHANGE_PASSWORD)
  @ApiOperation({ summary: ControllerTextEnum.USER_CHANGE_PASSWORD_SUMMARY })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Patch(UserRoute.UPDATE_ROLE)
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: ControllerTextEnum.USER_UPDATE_ROLE_SUMMARY })
  userRoleUpdate(
    @Param('id') id: string,
    @Body() userRoleUpdateDto: UserRoleUpdateDto,
  ) {
    return this.userService.userRoleUpdate(id, userRoleUpdateDto);
  }

  @Delete(UserRoute.USER)
  @ApiOperation({ summary: ControllerTextEnum.USER_DELETE_SUMMARY })
  deleteUser(
    @Param('id') id: string,
    @Token() currentUser: UserInterfaces.ITokenUser,
  ) {
    return this.userService.deleteUser(id, currentUser.id, currentUser.role);
  }

  @Patch(UserRoute.UPDATE_STATUS)
  @ApiOperation({ summary: ControllerTextEnum.USER_UPDATE_STATUS_SUMMARY })
  updateUserProfileStatus(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.userService.updateUserStatus(id, updateUserStatusDto);
  }

  @Patch(UserRoute.UPDATE_PROFILE_IMAGE)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: ControllerTextEnum.USER_UPDATE_IMAGE_SUMMARY })
  updateUserProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUserProfileImage(id, file);
  }
}
