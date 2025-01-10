import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { UsersService } from '../../services/users.service';
import { PostService } from '../../../posts/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { Post } from '../../../posts/models/post.model';
import { provideRouter } from '@angular/router';

class MockUsersService {
  getUserById(id: number) {
    return of({
      id,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      phone: '1-770-736-8031 x56442',
      website: 'https://hildegard.org',
      company: { name: 'Romaguera-Crona' },
    } as User);
  }
}

class MockPostService {
  getPostsList(params: any) {
    return of([
      {
        id: 1,
        title: 'Post Title',
        body: 'Post Body',
        userId: params.userId,
      } as Post,
    ]);
  }
}

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userService: UsersService;
  let postService: PostService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
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

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UsersService);
    postService = TestBed.inject(PostService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user and posts on initialization', fakeAsync(() => {
    spyOn(component, 'fetchAllUserDetails').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.fetchAllUserDetails).toHaveBeenCalledWith(1);
    expect(component.user?.name).toBe('Leanne Graham');
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Post Title');
  }));

  it('should call userService and postService with correct parameters', fakeAsync(() => {
    spyOn(userService, 'getUserById').and.callThrough();
    spyOn(postService, 'getPostsList').and.callThrough();
    component.fetchAllUserDetails(1);
    tick();
    expect(userService.getUserById).toHaveBeenCalledWith(1);
    expect(postService.getPostsList).toHaveBeenCalledWith({ userId: 1 });
  }));
});
