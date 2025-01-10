import { TestBed } from '@angular/core/testing';
import { AlbumsService } from './albums.service';
import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { of, throwError } from 'rxjs';
import { Album } from '../models/album.model';
import { HttpResponse } from '@angular/common/http';

describe('AlbumsService', () => {
  let service: AlbumsService;
  let apiInterfaceSpy: jasmine.SpyObj<ApiInterfaceService>;

  const mockAlbums: Album[] = [
    { id: 1, userId: 1, title: 'Album 1' },
    { id: 2, userId: 1, title: 'Album 2' },
  ];
  const mockAlbum: Album = { id: 1, userId: 1, title: 'Album 1' };
  const mockHeaders = {
    get: (header: string) => (header === 'X-Total-Count' ? '150' : null),
  };

  beforeEach(() => {
    const apiInterfaceMock = jasmine.createSpyObj('ApiInterfaceService', [
      'get',
      'getHttp',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AlbumsService,
        { provide: ApiInterfaceService, useValue: apiInterfaceMock },
      ],
    });

    service = TestBed.inject(AlbumsService);
    apiInterfaceSpy = TestBed.inject(
      ApiInterfaceService
    ) as jasmine.SpyObj<ApiInterfaceService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAlbumbsList', () => {
    it('should call the correct API endpoint and return a list of albums', () => {
      apiInterfaceSpy.get.and.returnValue(of(mockAlbums));

      service.getAlbumbsList({ userId: 1 }).subscribe((albums) => {
        expect(albums).toEqual(mockAlbums);
      });

      expect(apiInterfaceSpy.get).toHaveBeenCalledWith(
        '/albums',
        jasmine.any(Object)
      );
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch albums';
      apiInterfaceSpy.get.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getAlbumbsList().subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });

  describe('getAlbumById', () => {
    it('should call the correct API endpoint and return album details', () => {
      apiInterfaceSpy.get.and.returnValue(of(mockAlbum));

      service.getAlbumById(1).subscribe((album) => {
        expect(album).toEqual(mockAlbum);
      });

      expect(apiInterfaceSpy.get).toHaveBeenCalledWith('/albums/1');
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch album details';
      apiInterfaceSpy.get.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getAlbumById(1).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });

  describe('getAlbumbsListWithTotalCount', () => {
    it('should call the correct API endpoint and return albums with total count', () => {
      const mockHttpResponse = new HttpResponse<Album[]>({
        body: mockAlbums,
        headers: mockHeaders as any,
      });
      apiInterfaceSpy.getHttp.and.returnValue(of(mockHttpResponse));

      service
        .getAlbumbsListWithTotalCount({ page: 1, limit: 10 })
        .subscribe((response) => {
          expect(response.data).toEqual(mockAlbums);
          expect(response.totalCount).toBe(150);
        });

      expect(apiInterfaceSpy.getHttp).toHaveBeenCalledWith(
        '/albums',
        jasmine.any(Object)
      );
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'Failed to fetch albums with total count';
      apiInterfaceSpy.getHttp.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.getAlbumbsListWithTotalCount().subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });
    });
  });
});
