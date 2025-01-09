import { HttpParams } from '@angular/common/http';
import { QueryParams } from '../models/query-param.model';

/**
 * Method to convert params object to HttpParams
 * @param { ApiQueryParams } params - query params like pagination, sorting, filter
 * @returns { HttpParams }
 */
export const convertToHttpParams = (
  params: Partial<QueryParams>
): HttpParams => {
  let httpParams = new HttpParams();
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null) {
      httpParams = httpParams.set(key, value.toString());
    }
  });
  return httpParams;
};
