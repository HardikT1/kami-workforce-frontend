import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { of, throwError } from 'rxjs';
import { Post } from '../models/post.model';
import { HttpResponse } from '@angular/common/http';

describe('PostService', () => {
  let service: PostService;
  let apiInterfaceSpy: jasmine.SpyObj<ApiInterfaceService>;

  const mockPosts: Post[] = [
    {
      id: 1,
      userId: 1,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    },
    {
      id: 2,
      userId: 1,
      title: 'qui est esse',
      body: '  eatae ea dolores neque',
    },
  ];
  const mockPost: Post = {
    id: 1,
    userId: 1,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
  };
  const mockHeaders = {
    get: (header: string) => (header === 'X-Total-Count' ? '100' : null),
  };

  beforeEach(() => {
    const apiInterfaceMock = jasmine.createSpyObj('ApiInterfaceService', [
      'get',
      'getHttp',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PostService,
        { provide: ApiInterfaceService, useValue: apiInterfaceMock },
      ],
    });

    service = TestBed.inject(PostService);
    apiInterfaceSpy = TestBed.inject(
      ApiInterfaceService
    ) as jasmine.SpyObj<ApiInterfaceService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPostsList', () => {
    it('should call the correct API endpoint and return a list of posts', () => {
      apiInterfaceSpy.get.and.returnValue(of(mockPosts));

      service.getPostsList({ userId: 1 }).subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
      });

      expect(apiInterfaceSpy.get).toHaveBeenCalledWith(
        '/posts',
        jasmine.any(Object)
      );
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch posts';
      apiInterfaceSpy.get.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getPostsList().subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });

  describe('getPostById', () => {
    it('should call the correct API endpoint and return post details', () => {
      apiInterfaceSpy.get.and.returnValue(of(mockPost));

      service.getPostById(1).subscribe((post) => {
        expect(post).toEqual(mockPost);
      });

      expect(apiInterfaceSpy.get).toHaveBeenCalledWith('/posts/1');
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch post details';
      apiInterfaceSpy.get.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getPostById(1).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });

  describe('getPostsListWithTotalCount', () => {
    it('should call the correct API endpoint and return posts with total count', () => {
      const mockHttpResponse = new HttpResponse<Post[]>({
        body: mockPosts,
        headers: mockHeaders as any,
      });
      apiInterfaceSpy.getHttp.and.returnValue(of(mockHttpResponse));

      service
        .getPostsListWithTotalCount({ page: 1, limit: 10 })
        .subscribe((response) => {
          expect(response.data).toEqual(mockPosts);
          expect(response.totalCount).toBe(100);
        });

      expect(apiInterfaceSpy.getHttp).toHaveBeenCalledWith(
        '/posts',
        jasmine.any(Object)
      );
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch posts with total count';
      apiInterfaceSpy.getHttp.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getPostsListWithTotalCount().subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });
});
