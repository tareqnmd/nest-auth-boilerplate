import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashingModule } from '../hashing/hashing.module';
import { UploadModule } from '../upload/upload.module';
import { GetUserByGithubIdProvider } from './providers';
import { ChangePasswordProvider } from './providers/change-password.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { DeleteUserProvider } from './providers/delete-user.provider';
import { GetAllUsersProvider } from './providers/get-all-users.provider';
import { GetUserByEmailProvider } from './providers/get-user-by-email.provider';
import { GetUserByGoogleIdProvider } from './providers/get-user-by-google-id.provider';
import { GetUserByIdProvider } from './providers/get-user-by-id.provider';
import { UpdateUserImageProvider } from './providers/update-user-image.provider';
import { UpdateUserStatusProvider } from './providers/update-user-status.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { UserRoleUpdateProvider } from './providers/user-role-update.provider';
import { UserService } from './providers/user.service';
import { User, UserSchema } from './user.schema';
import { UserController } from './users.controller';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    GetUserByEmailProvider,
    GetUserByGoogleIdProvider,
    GetUserByIdProvider,
    CreateUserProvider,
    UpdateUserProvider,
    GetAllUsersProvider,
    DeleteUserProvider,
    ChangePasswordProvider,
    UserRoleUpdateProvider,
    UpdateUserStatusProvider,
    UpdateUserImageProvider,
    GetUserByGithubIdProvider,
  ],
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HashingModule,
    UploadModule,
  ],
})
export class UsersModule {}
