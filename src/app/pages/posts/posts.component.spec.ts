import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { PostService } from './services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { of, throwError } from 'rxjs';
import { Post } from './models/post.model';
import { provideRouter } from '@angular/router';

//Mock services
class MockPostService {
  getPostsListWithTotalCount(params: any) {
    return of({
      data: [
        {
          id: 1,
          userId: 1,
          title:
            'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
          body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
        } as Post,
      ],
      totalCount: 1,
    });
  }
}

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postService: PostService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        PaginationComponent,
        HeaderComponent,
        PostsComponent,
      ],
      providers: [
        { provide: PostService, useClass: MockPostService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ page: 1, limit: 10 }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch posts on initialization', fakeAsync(() => {
    spyOn(component, 'getAllPosts').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.getAllPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(1);
    expect(component.totalCount).toBe(1);
  }));

  it('should handle page change', fakeAsync(() => {
    spyOn(component, 'appendQueryParams').and.callThrough();
    component.onPageChange(2);
    tick();
    expect(component.params._page).toBe(2);
    expect(component.appendQueryParams).toHaveBeenCalled();
  }));

  it('should handle sorting change', fakeAsync(() => {
    spyOn(component, 'appendQueryParams').and.callThrough();
    component.onSortChange();
    tick();
    expect(component.appendQueryParams).toHaveBeenCalled();
  }));

  it('should update filter subject on filter change', fakeAsync(() => {
    spyOn(component['filterSubject'], 'next').and.callThrough();
    component.params.filter = 'test';
    component.onFilterChange();
    tick(500);
    expect(component['filterSubject'].next).toHaveBeenCalledWith('test');
  }));

  it('should fetch posts with correct parameters', fakeAsync(() => {
    spyOn(postService, 'getPostsListWithTotalCount').and.callThrough();
    component.getAllPosts();
    tick();
    expect(postService.getPostsListWithTotalCount).toHaveBeenCalledWith({
      title_like: '',
      _page: 1,
      _limit: 10,
      _sort: '',
      _order: '',
    });
    expect(component.posts.length).toBe(1);
    expect(component.totalCount).toBe(1);
  }));

  it('should handle errors while fetching posts', fakeAsync(() => {
    spyOn(postService, 'getPostsListWithTotalCount').and.returnValue(
      throwError(() => new Error('Error fetching posts'))
    );
    spyOn(console, 'error');

    component.getAllPosts();
    tick();

    // Verify that console.error was called with the correct arguments
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching posts:',
      jasmine.any(Error)
    );

    // Check that the Error object contains the correct message
    const errorArg = (console.error as jasmine.Spy).calls.argsFor(0)[1];
    expect(errorArg.message).toBe('Error fetching posts');
  }));

  it('should append query parameters correctly', fakeAsync(() => {
    spyOn(router, 'navigate').and.callThrough();
    component.params._page = 2;
    component.appendQueryParams();
    tick();
    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: jasmine.any(Object),
      queryParams: {
        page: 2,
        limit: 10,
        sort: '',
        order: '',
        filter: '',
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }));
});
