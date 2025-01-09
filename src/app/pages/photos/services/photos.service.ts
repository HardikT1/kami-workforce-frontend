import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';
import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { QueryParams } from '../../../shared/models/query-param.model';
import { convertToHttpParams } from '../../../shared/utils/utility';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  // Injecting ApiInterfaceService to handle API calls
  private apiInterfaceService = inject(ApiInterfaceService);

  /**
   *  Retrieves a list of photos.
   * @param params -accepts query parameters for filtering, sorting, or pagination.
   * @returns photos list
   */
  getPhotosList(params: Partial<QueryParams> = {}): Observable<Photo[]> {
    return this.apiInterfaceService.get<Photo[]>(
      '/photos',
      convertToHttpParams(params)
    );
  }

  /**
   * Fetches detailed information about a specific photo by its ID.
   * @param id - The unique identifier of the photo.
   * @returns photo detail
   */
  getPhotoById(id: number): Observable<Photo> {
    return this.apiInterfaceService.get<Photo>(`/photos/${id}`);
  }
}
