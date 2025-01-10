import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { PostService } from '../posts/services/post.service';
import { AlbumsService } from '../albums/services/albums.service';
import { PhotosService } from '../photos/services/photos.service';
import { UsersService } from '../users/services/users.service';
import { Observable, of, throwError } from 'rxjs';
import { Post } from '../posts/models/post.model';
import { Album } from '../albums/models/album.model';
import { Photo } from '../photos/models/photo.model';
import { User } from '../users/models/user.model';

// Mock services
class MockPostService {
  getPostsList() {
    return of([
      {
        id: 1,
        userId: 1,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
      } as Post,
    ]);
  }
}

class MockAlbumsService {
  getAlbumbsList() {
    return of([{ id: 1, title: 'quidem molestiae enim', userId: 1 } as Album]);
  }
}

class MockPhotosService {
  getPhotosList() {
    return of([
      {
        id: 1,
        title: 'accusamus beatae ad facilis cum similique qui sunt',
        thumbnailUrl: 'https://via.placeholder.com/150/92c952',
        url: 'https://via.placeholder.com/600/92c952',
        albumId: 1,
      } as Photo,
    ]);
  }
}

class MockUsersService {
  getUserById(id: number): Observable<User> {
    return of({ id: 1, username: 'Bret' } as User);
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: PostService, useClass: MockPostService },
        { provide: AlbumsService, useClass: MockAlbumsService },
        { provide: PhotosService, useClass: MockPhotosService },
        { provide: UsersService, useClass: MockUsersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', fakeAsync(() => {
    spyOn(component, 'loadDashboardData').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.loadDashboardData).toHaveBeenCalled();
    expect(component.posts.length).toBe(1);
    expect(component.albums.length).toBe(1);
    expect(component.photos.length).toBe(1);
  }));

  it('should handle dashboard data correctly', fakeAsync(() => {
    const dashboardData = {
      posts: [
        {
          id: 1,
          userId: 1,
          title:
            'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
          body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
        },
      ],
      albums: [{ id: 1, title: 'quidem molestiae enim', userId: 1 }],
      photos: [
        {
          id: 1,
          title: 'accusamus beatae ad facilis cum similique qui sunt',
          thumbnailUrl: 'https://via.placeholder.com/150/92c952',
          url: 'https://via.placeholder.com/600/92c952',
          albumId: 1,
        },
      ],
    };

    component.handleDashboardData(dashboardData);
    tick();
    expect(component.topPosts.length).toBe(1);
    expect(component.recentPhotos.length).toBe(1);
  }));

  it('should load user details and enrich posts', fakeAsync(() => {
    const userIds = [1];

    spyOn(component, 'loadUserDetails').and.callThrough();
    spyOn(component, 'enrichPostsWithUserDetails').and.callThrough();

    // Mock user data to ensure that the posts are enriched with user details
    const mockPosts = [
      {
        id: 1,
        userId: 1,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
        user: { username: 'Bret' },
      },
    ];

    component.topPosts = mockPosts;
    component.loadUserDetails(userIds);
    tick();

    expect(component.loadUserDetails).toHaveBeenCalledWith(userIds);
    expect(component.enrichPostsWithUserDetails).toHaveBeenCalled();

    expect(component.topPosts[0].user?.username).toBe('Bret');
  }));

  it('should handle error while fetching dashboard data', fakeAsync(() => {
    const postService = TestBed.inject(PostService);

    // Mocking the error returned by the postService
    spyOn(postService, 'getPostsList').and.returnValue(
      throwError(() => new Error('Error fetching posts'))
    );

    // Spy on console.error
    spyOn(console, 'error');

    // Trigger the method that will cause the error
    component.loadDashboardData();
    tick();

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching dashboard data',
      jasmine.any(Error)
    );

    const errorArg = (console.error as jasmine.Spy).calls.argsFor(0)[1];
    expect(errorArg.message).toBe('Error fetching posts');
  }));

  it('should handle error while fetching user details', fakeAsync(() => {
    const userErrorMessage = 'Error fetching user details';
    const usersService = TestBed.inject(UsersService);

    // Mock the error thrown by getUserById
    spyOn(usersService, 'getUserById').and.returnValue(
      throwError(() => new Error(userErrorMessage))
    );

    // Spy on console.error
    spyOn(console, 'error');

    // Trigger the method that will cause the error
    component.loadUserDetails([1]);
    tick();

    expect(console.error).toHaveBeenCalledWith(
      userErrorMessage,
      jasmine.any(Error)
    );

    const errorArg = (console.error as jasmine.Spy).calls.argsFor(0)[1];
    expect(errorArg.message).toBe(userErrorMessage);
  }));
});
