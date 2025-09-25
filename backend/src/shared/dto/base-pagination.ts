export class BasePagination {
  public page: number;
  public limit: number;
  public totalPages: number;
  public total: number;
  public hasNextPage: boolean;
  public hasPrevPage: boolean;
  public prevPage: number | null;
  public nextPage: number | null;

  public constructor({ limit, page, total }: Pick<BasePagination, 'limit' | 'page' | 'total'>) {
    const totalPages = Math.ceil(total / limit);
    this.total = total;
    this.limit = limit;
    this.page = page;
    this.prevPage = this.hasPrevPage ? this.page - 1 : null;
    this.nextPage = this.hasNextPage ? this.page + 1 : null;
    this.hasNextPage = this.page >= 1 && this.page < totalPages;
    this.hasPrevPage = this.page > 1 && this.page <= totalPages + 1;
    this.totalPages = totalPages;
  }
}
