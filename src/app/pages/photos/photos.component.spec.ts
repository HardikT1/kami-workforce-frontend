import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PhotosComponent } from './photos.component';
import { PhotosService } from './services/photos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { of, throwError } from 'rxjs';
import { Photo } from './models/photo.model';
import { provideRouter } from '@angular/router';

//Mock services
class MockPhotosService {
  getPhotosListWithTotalCount(params: any) {
    return of({
      data: [
        {
          id: 1,
          title: 'accusamus beatae ad facilis cum similique qui sunt',
          thumbnailUrl: 'https://via.placeholder.com/150/92c952',
          url: 'https://via.placeholder.com/600/92c952',
          albumId: 1,
        } as Photo,
      ],
      totalCount: 1,
    });
  }
}

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let photosService: PhotosService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaginationComponent,
        HeaderComponent,
        FormsModule,
        PhotosComponent,
      ],
      providers: [
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

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;
    photosService = TestBed.inject(PhotosService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch photos on initialization', fakeAsync(() => {
    spyOn(component, 'getAllPhotos').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.getAllPhotos).toHaveBeenCalled();
    expect(component.photos.length).toBe(1);
    expect(component.totalCount).toBe(1);
  }));

  it('should fetch photos with correct parameters', fakeAsync(() => {
    spyOn(photosService, 'getPhotosListWithTotalCount').and.callThrough();
    component.getAllPhotos();
    tick();
    expect(photosService.getPhotosListWithTotalCount).toHaveBeenCalledWith({
      title_like: '',
      _page: 1,
      _limit: 10,
      _sort: '',
      _order: '',
    });
    expect(component.photos.length).toBe(1);
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

  it('should handle errors when fetching photos', fakeAsync(() => {
    const errorMessage = 'Error fetching photos';
    spyOn(photosService, 'getPhotosListWithTotalCount').and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    spyOn(console, 'error');

    component.getAllPhotos();
    tick();

    // Verify that console.error is called with the correct arguments
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching photos:',
      jasmine.any(Error)
    );
    const errorArg = (console.error as jasmine.Spy).calls.mostRecent().args[1];
    expect(errorArg.message).toBe(errorMessage);
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
      replaceUrl: true,
    });
  }));
});
