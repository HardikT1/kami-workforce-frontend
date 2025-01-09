import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiInterfaceService {
  http = inject(HttpClient);

  // GET request
  get<T>(
    path: string,
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >
  ): Observable<T> {
    const options = {
      params:
        params instanceof HttpParams
          ? params
          : new HttpParams({ fromObject: params }),
    };
    return this.http.get<T>(environment.apiUrl + path, options);
  }

  // POST request
  post(
    path: string,
    body: unknown,
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >
  ): Observable<unknown> {
    const options = {
      params:
        params instanceof HttpParams
          ? params
          : new HttpParams({ fromObject: params }),
    };

    return this.http.post(environment.apiUrl + path, body, options);
  }

  // PUT request
  put(
    path: string,
    body: unknown,
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >
  ): Observable<unknown> {
    const options = {
      params:
        params instanceof HttpParams
          ? params
          : new HttpParams({ fromObject: params }),
    };
    return this.http.put(environment.apiUrl + path, body, options);
  }

  // DELETE request
  delete(
    path: string,
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >
  ): Observable<unknown> {
    const options = {
      params:
        params instanceof HttpParams
          ? params
          : new HttpParams({ fromObject: params }),
    };
    return this.http.delete(environment.apiUrl + path, options);
  }
}
