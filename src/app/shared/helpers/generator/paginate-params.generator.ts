import { IPaginateParams } from '../interfaces/paginate';

export class PaginateParamsGenerator {
  static getUri(paginateParams: IPaginateParams): string {
    const params: Array<string> = [];

    if (paginateParams.search)
      params.push(`search=${encodeURIComponent('' + paginateParams.search)}`);

    if (paginateParams.pageIndex)
      params.push(
        `page=${encodeURIComponent('' + (+paginateParams.pageIndex + 1))}`
      );

    if (paginateParams.pageSize)
      params.push(`limit=${encodeURIComponent('' + paginateParams.pageSize)}`);

    params.push(`order=${encodeURIComponent('' + paginateParams.order)}`);

    if (paginateParams.sort)
      params.push(`sort=${encodeURIComponent('' + paginateParams.sort)}`);


    return params.join('&');
  }
}
