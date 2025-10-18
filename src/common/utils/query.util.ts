import { FilterQuery } from 'mongoose';
import { QueryDto } from '../dto/query.dto';
import { SortOrderEnum } from '../enum/sort-order.enum';

export interface QueryBuilderOptions {
  searchFields?: string[];
  defaultSortField?: string;
  allowedSortFields?: string[];
}

export class QueryUtil {
  static buildSearchFilter<T>(
    query: QueryDto,
    searchFields: string[],
  ): FilterQuery<T> {
    const filter: FilterQuery<T> = {};

    if (query.search && searchFields.length > 0) {
      const orConditions: FilterQuery<T>[] = searchFields.map((field) => ({
        [field]: { $regex: query.search, $options: 'i' },
      })) as FilterQuery<T>[];

      filter.$or = orConditions;
    }

    return filter;
  }

  static buildSort(
    query: QueryDto,
    defaultSortField = 'createdAt',
    allowedSortFields: string[] = [],
  ): Record<string, 1 | -1> {
    const sortOrder = query.sortOrder === SortOrderEnum.ASC ? 1 : -1;
    let sortField = defaultSortField;

    if (
      query.sortBy &&
      (allowedSortFields.length === 0 ||
        allowedSortFields.includes(query.sortBy))
    ) {
      sortField = query.sortBy;
    }

    return { [sortField]: sortOrder };
  }

  static buildCompleteFilter<T>(
    query: QueryDto,
    customFilters: FilterQuery<T>,
    searchFields: string[],
  ): FilterQuery<T> {
    const searchFilter = this.buildSearchFilter<T>(query, searchFields);

    if (searchFilter.$or && Object.keys(customFilters).length > 0) {
      return {
        $and: [customFilters, searchFilter],
      };
    }

    if (searchFilter.$or) {
      return searchFilter;
    }

    return customFilters;
  }

  static extractFilters<T extends QueryDto>(
    query: T,
    excludeFields: string[] = [
      'page',
      'limit',
      'search',
      'sortBy',
      'sortOrder',
    ],
  ): Record<string, unknown> {
    const filters: Record<string, unknown> = {};

    (Object.keys(query) as Array<keyof T>).forEach((key) => {
      const keyString = key as string;
      if (!excludeFields.includes(keyString) && query[key] !== undefined) {
        filters[keyString] = query[key];
      }
    });

    return filters;
  }
}
