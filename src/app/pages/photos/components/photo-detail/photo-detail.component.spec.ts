import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PhotoDetailComponent } from './photo-detail.component';
import { PhotosService } from '../../services/photos.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Photo } from '../../models/photo.model';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

//Mock services
class MockPhotosService {
  getPhotoById(id: number) {
    return of({
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952',
      url: 'https://via.placeholder.com/600/92c952',
      albumId: 1,
    } as Photo);
  }
}

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let photosService: PhotosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetailComponent, HeaderComponent],
      providers: [
        { provide: PhotosService, useClass: MockPhotosService },
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

    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    photosService = TestBed.inject(PhotosService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch photo details on initialization', fakeAsync(() => {
    // Mock the photo data that should be returned, including all required properties
    const mockPhotoData = {
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      albumId: 1,
      thumbnailUrl: 'https://via.placeholder.com/150/92c952',
    };

    // Mock the fetchPhotoDetails method to return the mock data
    spyOn(component, 'fetchPhotoDetails').and.callFake(() => {
      component.photo = mockPhotoData;
    });

    // Call ngOnInit which should trigger fetchPhotoDetails
    component.ngOnInit();
    tick();

    // Verify that the fetchPhotoDetails method was called with the correct parameter
    expect(component.fetchPhotoDetails).toHaveBeenCalledWith(1);

    // Verify the photo data was correctly fetched
    expect(component.photo?.title).toBe(
      'accusamus beatae ad facilis cum similique qui sunt'
    );
    expect(component.photo?.url).toBe('https://via.placeholder.com/600/92c952');
    expect(component.photo?.albumId).toBe(1);
    expect(component.photo?.thumbnailUrl).toBe(
      'https://via.placeholder.com/150/92c952'
    );
  }));

  it('should call photosService with correct ID', fakeAsync(() => {
    spyOn(photosService, 'getPhotoById').and.callThrough();
    component.fetchPhotoDetails(1);
    tick();
    expect(photosService.getPhotoById).toHaveBeenCalledWith(1);
  }));

  it('should handle errors when fetching photo details', fakeAsync(() => {
    const errorMessage = 'Error fetching photo details';
    spyOn(photosService, 'getPhotoById').and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    spyOn(console, 'error');

    component.fetchPhotoDetails(1);
    tick();

    // Check that console.error is called with the correct arguments
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching photos details:',
      jasmine.any(Error)
    );

    // Verify the error message
    const errorArg = (console.error as jasmine.Spy).calls.mostRecent().args[1];
    expect(errorArg.message).toBe(errorMessage);
  }));
});
