import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PAGINATION_CONSTANTS } from '../../../common/constants';
import { PaginatedResponse } from '../../../common/dto';
import { QueryField, UserField } from '../../../common/enum';
import { PaginationUtil } from '../../../common/utils/pagination.util';
import { QueryUtil } from '../../../common/utils/query.util';
import { UserQueryDto } from '../dto';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class GetAllUsersProvider {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAllUsers(
    query: UserQueryDto,
  ): Promise<PaginatedResponse<UserDocument>> {
    const page = query[QueryField.PAGE] || PAGINATION_CONSTANTS.DEFAULT_PAGE;
    const limit = query[QueryField.LIMIT] || PAGINATION_CONSTANTS.DEFAULT_LIMIT;
    const skip = PaginationUtil.getSkip(page, limit);

    const customFilters: FilterQuery<UserDocument> = {};
    if (query[UserField.ROLE] !== undefined)
      customFilters[UserField.ROLE] = query[UserField.ROLE];
    if (query[UserField.IS_ACTIVE] !== undefined)
      customFilters[UserField.IS_ACTIVE] = query[UserField.IS_ACTIVE];
    if (query[UserField.IS_USER_VERIFIED] !== undefined)
      customFilters[UserField.IS_USER_VERIFIED] =
        query[UserField.IS_USER_VERIFIED];

    const searchFields = [
      UserField.EMAIL,
      UserField.FIRST_NAME,
      UserField.LAST_NAME,
    ];

    const filter = QueryUtil.buildCompleteFilter(
      query,
      customFilters,
      searchFields,
    );

    const allowedSortFields = [
      UserField.EMAIL,
      UserField.FIRST_NAME,
      UserField.LAST_NAME,
      UserField.ROLE,
      UserField.IS_ACTIVE,
      UserField.IS_USER_VERIFIED,
    ];
    const sort = QueryUtil.buildSort(query, 'createdAt', allowedSortFields);

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return PaginationUtil.createPaginatedResponse(users, total, page, limit);
  }
}
