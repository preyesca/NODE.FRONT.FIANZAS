export interface IPaginate<T> {
  docs: Array<T>;
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface IPaginateMet<T> extends IPaginate<T> {
  hasOneRequestOnGoing?:string;
}

export interface IRequestPaginate {
  paginate: {
    limit?: any;
    page?: any;
    search?: any;
  };
}

export interface IPaginateParams {
  pageSize?: number;
  pageIndex?: number;
  order: string;
  sort: 'asc' | 'desc';
  search?: string;
}
