import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AlbumsComponent } from './albums.component';
import { AlbumsService } from './services/albums.service';
import { PhotosService } from '../photos/services/photos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { of, throwError } from 'rxjs';
import { Album } from './models/album.model';
import { Photo } from '../photos/models/photo.model';
import { provideRouter } from '@angular/router';

//Mock services
class MockAlbumsService {
  getAlbumbsListWithTotalCount(params: any) {
    return of({
      data: [{ id: 1, title: 'quidem molestiae enim', userId: 1 } as Album],
      totalCount: 1,
    });
  }
}

class MockPhotosService {
  getPhotosList(params: any) {
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

describe('AlbumsComponent', () => {
  let component: AlbumsComponent;
  let fixture: ComponentFixture<AlbumsComponent>;
  let albumsService: AlbumsService;
  let photosService: PhotosService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        AlbumsComponent,
        PaginationComponent,
        HeaderComponent,
      ],
      providers: [
        { provide: AlbumsService, useClass: MockAlbumsService },
        { provide: PhotosService, useClass: MockPhotosService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ page: 1, limit: 10 }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumsComponent);
    component = fixture.componentInstance;
    albumsService = TestBed.inject(AlbumsService);
    photosService = TestBed.inject(PhotosService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch albums on initialization', fakeAsync(() => {
    spyOn(component, 'getAllAlbums').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.getAllAlbums).toHaveBeenCalled();
    expect(component.albums.length).toBe(1);
    expect(component.totalCount).toBe(1);
  }));

  it('should fetch photos and associate with albums', fakeAsync(() => {
    spyOn(component, 'loadAlbumsPhotosDetails').and.callThrough();
    component.getAllAlbums();
    tick();
    expect(component.loadAlbumsPhotosDetails).toHaveBeenCalledWith([1]);
    expect(component.albums[0]?.photos?.length).toBe(1);
  }));

  it('should handle page changes', fakeAsync(() => {
    spyOn(component, 'appendQueryParams').and.callThrough();
    component.onPageChange(2);
    tick();
    expect(component.params._page).toBe(2);
    expect(component.appendQueryParams).toHaveBeenCalled();
  }));

  it('should handle sorting changes', fakeAsync(() => {
    spyOn(component, 'appendQueryParams').and.callThrough();
    component.onSortChange();
    tick();
    expect(component.appendQueryParams).toHaveBeenCalled();
  }));

  it('should update filter on filter change', fakeAsync(() => {
    spyOn(component['filterSubject'], 'next').and.callThrough();
    component.params.filter = 'test';
    component.onFilterChange();
    tick(500);
    expect(component['filterSubject'].next).toHaveBeenCalledWith('test');
  }));

  it('should handle errors when fetching albums', fakeAsync(() => {
    const errorMessage = 'Error fetching albums';

    // Spy on the service method and make it throw an error
    spyOn(albumsService, 'getAlbumbsListWithTotalCount').and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    // Spy on console.error
    spyOn(console, 'error');

    // Call the method that triggers the error
    component.getAllAlbums();
    tick();

    // Check if console.error was called with the correct arguments
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching albums:',
      jasmine.any(Error)
    );

    // Extract the error argument and check its message
    const errorArg = (console.error as jasmine.Spy).calls.argsFor(0)[1];
    expect(errorArg.message).toBe(errorMessage);
  }));

  it('should handle errors when fetching photos', fakeAsync(() => {
    spyOn(photosService, 'getPhotosList').and.returnValue(
      throwError(() => new Error('Error fetching photos'))
    );
    spyOn(console, 'error');

    component.loadAlbumsPhotosDetails([1]);
    tick();

    // Verify that console.error was called with the correct arguments
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching photos:',
      jasmine.any(Error)
    );

    // Check that the Error object contains the correct message
    const errorArg = (console.error as jasmine.Spy).calls.argsFor(0)[1];
    expect(errorArg.message).toBe('Error fetching photos');
  }));

  it('should append query parameters correctly when values are provided', fakeAsync(() => {
    spyOn(router, 'navigate').and.callThrough();

    // Set up parameters with values
    component.params._page = 2;
    component.params._limit = 10;
    component.params._sort = 'title';
    component.params._order = 'asc';
    component.params.filter = 'test';

    component.appendQueryParams();
    tick();

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: jasmine.any(Object),
      queryParams: {
        page: 2,
        limit: 10,
        sort: 'title',
        order: 'asc',
        filter: 'test',
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }));

  it('should append only query parameters with values', fakeAsync(() => {
    spyOn(router, 'navigate').and.callThrough();

    component.params._page = 2;
    component.params._limit = 10;
    component.params._sort = '';
    component.params._order = 'desc';
    component.params.filter = '  ';

    component.appendQueryParams();
    tick();

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: jasmine.any(Object),
      queryParams: {
        page: 2,
        limit: 10,
        order: 'desc',
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }));
});
