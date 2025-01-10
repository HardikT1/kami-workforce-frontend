import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../../services/albums.service';
import { forkJoin } from 'rxjs';
import { PhotosService } from '../../../photos/services/photos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Photo } from '../../../photos/models/photo.model';
import { PhotoItemComponent } from '../../../../shared/components/photo-item/photo-item.component';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrl: './album-detail.component.scss',
  imports: [HeaderComponent, PhotoItemComponent],
})
export class AlbumDetailComponent implements OnInit {
  // injecting Albums service
  private albumsService = inject(AlbumsService);

  //inject Photos service
  private photosService = inject(PhotosService);

  // ActivatedRoute for accessing query parameters from the route
  private activatedRoute = inject(ActivatedRoute);

  // DestroyRef to manage the lifecycle of subscriptions
  private destroyRef = inject(DestroyRef);

  // page heading
  title = 'Album Page';

  // page album heading
  albumTitle = '';

  // List of photos fetched from the API
  photos: Photo[] = [];

  ngOnInit(): void {
    const albumId = this.activatedRoute.snapshot.paramMap.get('id');
    if (albumId) {
      this.loadAlbumData(Number(albumId));
    }
  }

  /**
   * Load Album details.
   * @param albumId - album id
   */
  loadAlbumData(albumId: number): void {
    forkJoin({
      album: this.albumsService.getAlbumById(albumId),
      photos: this.photosService.getPhotosList({ albumId: albumId }),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (albumData) => {
          this.albumTitle = albumData.album.title;
          this.photos = albumData.photos;
        },
        error: (err) => {
          console.error('Error fetching dashboard data', err);
        },
      });
  }
}
