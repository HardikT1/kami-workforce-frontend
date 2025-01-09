export interface QueryParams {
  _page: number;
  _sort?: string;
  _order?: string;
  _limit: number;
  filter: string;
  [key: string]: string | number | boolean | undefined;
}
