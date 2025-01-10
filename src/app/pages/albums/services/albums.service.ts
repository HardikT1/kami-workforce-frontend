import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { Album } from '../models/album.model';
import { QueryParams } from '../../../shared/models/query-param.model';
import { convertToHttpParams } from '../../../shared/utils/utility';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  // Injecting ApiInterfaceService to handle API calls
  private apiInterfaceService = inject(ApiInterfaceService);

  /**
   *  Retrieves a list of albums.
   * @param params -accepts query parameters for filtering, sorting, or pagination.
   * @returns albums list
   */
  getAlbumbsList(params: Partial<QueryParams> = {}): Observable<Album[]> {
    return this.apiInterfaceService.get<Album[]>(
      '/albums',
      convertToHttpParams(params)
    );
  }

  /**
   * Fetches detailed information about a specific album by its ID.
   * @param id - The unique identifier of the album.
   * @returns album detail
   */
  getAlbumById(id: number): Observable<Album> {
    return this.apiInterfaceService.get<Album>(`/albums/${id}`);
  }

  /**
   *  Retrieves a list of albums with total counts.
   * @param params -accepts query parameters for filtering, sorting, or pagination.
   * @returns albums list
   */
  getAlbumbsListWithTotalCount(
    params: Partial<QueryParams> = {}
  ): Observable<ApiResponse<Album[]>> {
    return this.apiInterfaceService
      .getHttp<Album[]>('/albums', convertToHttpParams(params))
      .pipe(
        map((response: HttpResponse<Album[]>) => {
          const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
          return { data: response.body || [], totalCount };
        })
      );
  }
}
