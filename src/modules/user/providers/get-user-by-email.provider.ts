import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserField } from '../../../common/enum';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class GetUserByEmailProvider {
  private readonly logger = new Logger(GetUserByEmailProvider.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserByEmail(email: string) {
    try {
      const user = await this.userModel
        .findOne({ [UserField.EMAIL]: email })
        .exec();
      return user;
    } catch {
      return null;
    }
  }
}
