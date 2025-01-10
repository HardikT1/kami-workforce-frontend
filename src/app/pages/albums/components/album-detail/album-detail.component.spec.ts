import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AlbumDetailComponent } from './album-detail.component';
import { AlbumsService } from '../../services/albums.service';
import { PhotosService } from '../../../photos/services/photos.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Photo } from '../../../photos/models/photo.model';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

//Mock services
class MockAlbumsService {
  getAlbumById(albumId: number) {
    return of({ id: 1, title: 'quidem molestiae enim', userId: 1 });
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

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let fixture: ComponentFixture<AlbumDetailComponent>;
  let albumsService: AlbumsService;
  let photosService: PhotosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumDetailComponent, HeaderComponent],
      providers: [
        { provide: AlbumsService, useClass: MockAlbumsService },
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

    fixture = TestBed.createComponent(AlbumDetailComponent);
    component = fixture.componentInstance;
    albumsService = TestBed.inject(AlbumsService);
    photosService = TestBed.inject(PhotosService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch album and photos on initialization', fakeAsync(() => {
    spyOn(component, 'loadAlbumData').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.loadAlbumData).toHaveBeenCalledWith(1);
    expect(component.albumTitle).toBe('quidem molestiae enim');
    expect(component.photos.length).toBe(1);
    expect(component.photos[0].title).toBe(
      'accusamus beatae ad facilis cum similique qui sunt'
    );
  }));

  it('should call albumsService and photosService with correct parameters', fakeAsync(() => {
    spyOn(albumsService, 'getAlbumById').and.callThrough();
    spyOn(photosService, 'getPhotosList').and.callThrough();
    component.loadAlbumData(1);
    tick();
    expect(albumsService.getAlbumById).toHaveBeenCalledWith(1);
    expect(photosService.getPhotosList).toHaveBeenCalledWith({ albumId: 1 });
  }));
});
