import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserField } from '../../../common/enum';
import responseMessage from '../../../common/messages/response.message';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class GetUserByGoogleIdProvider {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserByGoogleId(googleId: string) {
    try {
      const user = await this.userModel
        .findOne({ [UserField.GOOGLE_ID]: googleId })
        .select('-password')
        .exec();
      if (!user) {
        throw new NotFoundException(responseMessage.user.notFound);
      }
      return user;
    } catch {
      return null;
    }
  }
}
