import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { Album } from '../models/album.model';
import { QueryParams } from '../../../shared/models/query-param.model';
import { convertToHttpParams } from '../../../shared/utils/utility';

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
  getAlbumById(id: string): Observable<Album> {
    return this.apiInterfaceService.get<Album>(`/albums/${id}`);
  }
}
