import { TestBed } from '@angular/core/testing';
import { PhotosService } from './photos.service';
import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { of, throwError } from 'rxjs';
import { Photo } from '../models/photo.model';
import { HttpResponse } from '@angular/common/http';

describe('PhotosService', () => {
  let service: PhotosService;
  let apiInterfaceSpy: jasmine.SpyObj<ApiInterfaceService>;

  const mockPhotos: Photo[] = [
    {
      id: 1,
      albumId: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952',
    },
    {
      id: 2,
      albumId: 1,
      title: 'reprehenderit est deserunt velit ipsam',
      url: 'https://via.placeholder.com/600/771796',
      thumbnailUrl: 'https://via.placeholder.com/150/771796',
    },
  ];
  const mockPhoto: Photo = {
    id: 1,
    albumId: 1,
    title: 'accusamus beatae ad facilis cum similique qui sunt',
    url: 'https://via.placeholder.com/600/92c952',
    thumbnailUrl: 'https://via.placeholder.com/150/92c952',
  };
  const mockHeaders = {
    get: (header: string) => (header === 'X-Total-Count' ? '200' : null),
  };

  beforeEach(() => {
    const apiInterfaceMock = jasmine.createSpyObj('ApiInterfaceService', [
      'get',
      'getHttp',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PhotosService,
        { provide: ApiInterfaceService, useValue: apiInterfaceMock },
      ],
    });

    service = TestBed.inject(PhotosService);
    apiInterfaceSpy = TestBed.inject(
      ApiInterfaceService
    ) as jasmine.SpyObj<ApiInterfaceService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPhotosList', () => {
    it('should call the correct API endpoint and return a list of photos', () => {
      apiInterfaceSpy.get.and.returnValue(of(mockPhotos));

      service.getPhotosList({ albumId: 1 }).subscribe((photos) => {
        expect(photos).toEqual(mockPhotos);
      });

      expect(apiInterfaceSpy.get).toHaveBeenCalledWith(
        '/photos',
        jasmine.any(Object)
      );
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch photos';
      apiInterfaceSpy.get.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getPhotosList().subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });

  describe('getPhotoById', () => {
    it('should call the correct API endpoint and return photo details', () => {
      apiInterfaceSpy.get.and.returnValue(of(mockPhoto));

      service.getPhotoById(1).subscribe((photo) => {
        expect(photo).toEqual(mockPhoto);
      });

      expect(apiInterfaceSpy.get).toHaveBeenCalledWith('/photos/1');
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch photo details';
      apiInterfaceSpy.get.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getPhotoById(1).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });

  describe('getPhotosListWithTotalCount', () => {
    it('should call the correct API endpoint and return photos with total count', () => {
      const mockHttpResponse = new HttpResponse<Photo[]>({
        body: mockPhotos,
        headers: mockHeaders as any,
      });
      apiInterfaceSpy.getHttp.and.returnValue(of(mockHttpResponse));

      service
        .getPhotosListWithTotalCount({ page: 1, limit: 10 })
        .subscribe((response) => {
          expect(response.data).toEqual(mockPhotos);
          expect(response.totalCount).toBe(200);
        });

      expect(apiInterfaceSpy.getHttp).toHaveBeenCalledWith(
        '/posts',
        jasmine.any(Object)
      );
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch photos with total count';
      apiInterfaceSpy.getHttp.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getPhotosListWithTotalCount().subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });
});
