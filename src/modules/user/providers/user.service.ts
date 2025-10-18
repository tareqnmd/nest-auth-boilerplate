import { Injectable } from '@nestjs/common';
import { SignUpDtoWithSocial } from '../../auth/dto/sign-up-social.dto';
import { SignUpDto } from '../../auth/dto/sign-up.dto';
import { ChangePasswordDto, UpdateUserSocialIdDto, UserQueryDto } from '../dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRoleUpdateDto } from '../dto/user-role-update.dto';
import { UserRoleEnum } from '../enum';
import { ChangePasswordProvider } from './change-password.provider';
import { CreateUserProvider } from './create-user.provider';
import { DeleteUserProvider } from './delete-user.provider';
import { GetAllUsersProvider } from './get-all-users.provider';
import { GetUserByEmailProvider } from './get-user-by-email.provider';
import { GetUserByGithubIdProvider } from './get-user-by-github-id.provider';
import { GetUserByGoogleIdProvider } from './get-user-by-google-id.provider';
import { GetUserByIdProvider } from './get-user-by-id.provider';
import { UpdateUserImageProvider } from './update-user-image.provider';
import { UpdateUserStatusProvider } from './update-user-status.provider';
import { UpdateUserProvider } from './update-user.provider';
import { UserRoleUpdateProvider } from './user-role-update.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly getUserByIdProvider: GetUserByIdProvider,
    private readonly getUserByEmailProvider: GetUserByEmailProvider,
    private readonly getUserByGoogleIdProvider: GetUserByGoogleIdProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly updateUserProvider: UpdateUserProvider,
    private readonly getAllUsersProvider: GetAllUsersProvider,
    private readonly deleteUserProvider: DeleteUserProvider,
    private readonly changePasswordProvider: ChangePasswordProvider,
    private readonly userRoleUpdateProvider: UserRoleUpdateProvider,
    private readonly updateUserStatusProvider: UpdateUserStatusProvider,
    private readonly updateUserImageProvider: UpdateUserImageProvider,
    private readonly getUserByGithubIdProvider: GetUserByGithubIdProvider,
  ) {}

  getUserById(id: string) {
    return this.getUserByIdProvider.getUserById(id);
  }

  getUserByEmail(email: string) {
    return this.getUserByEmailProvider.getUserByEmail(email);
  }

  getUserByGoogleId(googleId: string) {
    return this.getUserByGoogleIdProvider.getUserByGoogleId(googleId);
  }

  getUserByGithubId(githubId: string) {
    return this.getUserByGithubIdProvider.getUserByGithubId(githubId);
  }

  createUser(signUpDto: SignUpDto | SignUpDtoWithSocial) {
    return this.createUserProvider.createUser(signUpDto);
  }

  updateUser(id: string, updateUserDto: UpdateUserSocialIdDto | UpdateUserDto) {
    return this.updateUserProvider.updateUser(id, updateUserDto);
  }

  getAllUsers(query: UserQueryDto) {
    return this.getAllUsersProvider.getAllUsers(query);
  }

  deleteUser(id: string, currentUserId: string, currentUserRole: UserRoleEnum) {
    return this.deleteUserProvider.deleteUser(
      id,
      currentUserId,
      currentUserRole,
    );
  }

  changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    return this.changePasswordProvider.changePassword(id, changePasswordDto);
  }

  userRoleUpdate(id: string, userRoleUpdateDto: UserRoleUpdateDto) {
    return this.userRoleUpdateProvider.userRoleUpdate(id, userRoleUpdateDto);
  }

  updateUserStatus(id: string, updateUserStatusDto: UpdateUserStatusDto) {
    return this.updateUserStatusProvider.updateUserStatus(
      id,
      updateUserStatusDto,
    );
  }

  updateUserProfileImage(id: string, file: Express.Multer.File) {
    return this.updateUserImageProvider.updateUserImage(id, file);
  }
}
