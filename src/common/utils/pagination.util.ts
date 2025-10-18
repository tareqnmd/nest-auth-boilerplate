import { PaginatedResponse, PaginationMeta } from '../dto';

export class PaginationUtil {
  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);

    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
    };

    return {
      data,
      meta,
    };
  }

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
