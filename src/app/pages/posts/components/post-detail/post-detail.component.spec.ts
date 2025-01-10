import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Post } from '../../models/post.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { provideRouter } from '@angular/router';

//Mock services
class MockPostService {
  getPostById(id: number) {
    return of({
      id: 1,
      userId: 1,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas',
    } as Post);
  }
}

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postService: PostService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailComponent, HeaderComponent],
      providers: [
        { provide: PostService, useClass: MockPostService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post details on initialization', fakeAsync(() => {
    spyOn(component, 'fetchPostDetails').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.fetchPostDetails).toHaveBeenCalledWith(1);
    expect(component.post.title).toBe(
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
    );
    expect(component.post.body).toBe(
      'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas'
    );
  }));

  it('should handle errors when fetching post details', fakeAsync(() => {
    // Mock the error to be thrown by getPostById
    spyOn(postService, 'getPostById').and.returnValue(
      throwError(() => new Error('Error fetching post details'))
    );
    spyOn(console, 'error');

    // Call the component's ngOnInit method
    component.ngOnInit();
    tick();

    // Ensure console.error is called with the expected message and an Error object
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching post details:',
      jasmine.any(Error)
    );

    // Check that the Error object contains the correct message
    const errorArg = (console.error as jasmine.Spy).calls.argsFor(0)[1];
    expect(errorArg.message).toBe('Error fetching post details');
  }));

  it('should call post service with correct ID', fakeAsync(() => {
    spyOn(postService, 'getPostById').and.callThrough();
    component.ngOnInit();
    tick();
    expect(postService.getPostById).toHaveBeenCalledWith(1);
  }));
});
