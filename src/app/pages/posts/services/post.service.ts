import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { QueryParams } from '../../../shared/models/query-param.model';
import { convertToHttpParams } from '../../../shared/utils/utility';

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
}
