import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { QueryParams } from '../../../shared/models/query-param.model';
import { convertToHttpParams } from '../../../shared/utils/utility';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  // Injecting ApiInterfaceService to handle API calls
  private apiInterfaceService = inject(ApiInterfaceService);

  /**
   * Retrieves a list of posts.
   * @param params - accepts query parameters for filtering, sorting, or pagination.
   * @returns posts list
   */
  getPostsList(params: Partial<QueryParams> = {}): Observable<Post[]> {
    return this.apiInterfaceService.get<Post[]>(
      '/posts',
      convertToHttpParams(params)
    );
  }

  /**
   * Fetches detailed information about a specific post by its ID.
   * @param id - The unique identifier of the post.
   * @returns post detail
   */
  getPostById(id: number): Observable<Post> {
    return this.apiInterfaceService.get<Post>(`/posts/${id}`);
  }

  /**
   * Retrieves a list of posts with total counts.
   * @param params - accepts query parameters for filtering, sorting, or pagination.
   * @returns posts list
   */
  getPostsListWithTotalCount(
    params: Partial<QueryParams> = {}
  ): Observable<ApiResponse<Post[]>> {
    return this.apiInterfaceService
      .getHttp<Post[]>('/posts', convertToHttpParams(params))
      .pipe(
        map((response: HttpResponse<Post[]>) => {
          const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
          return { data: response.body || [], totalCount };
        })
      );
  }
}
